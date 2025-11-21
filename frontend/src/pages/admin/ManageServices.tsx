import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Plus, Edit, Trash2, ArrowLeft, LogOut } from 'lucide-react';

const ManageServices = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    features: '',
    icon: 'Code'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/services', data),
    onSuccess: (response) => {
      // Handle response data (axios wraps in .data)
      const newService = response.data?.data || response.data;
      // Optimistically update the cache immediately - add at beginning (latest first)
      queryClient.setQueryData(['services'], (old: any) => {
        return old ? [newService, ...old] : [newService];
      });
      toast({ title: 'Service created successfully' });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating service',
        description: error.response?.data?.message || 'Failed to create service',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/services/${id}`, data),
    onSuccess: (response, variables) => {
      // Handle response data (axios wraps in .data)
      const updatedService = response.data?.data || response.data;
      // Optimistically update the cache immediately
      queryClient.setQueryData(['services'], (old: any) => {
        return old ? old.map((item: any) => item._id === variables.id ? updatedService : item) : [updatedService];
      });
      toast({ title: 'Service updated successfully' });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating service',
        description: error.response?.data?.message || 'Failed to update service',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({ title: 'Service deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting service',
        description: error.response?.data?.message || 'Failed to delete service',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', features: '', icon: 'Code' });
    setEditingService(null);
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      features: service.features.join('\n'),
      icon: service.icon || 'Code'
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      features: formData.features.split('\n').filter(f => f.trim())
    };

    if (editingService) {
      updateMutation.mutate({ id: editingService._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center">Loading...</div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Manage Services</h1>
                  <p className="text-muted-foreground">Add, edit, or delete services</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>

            <div className="mb-6">
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus size={16} className="mr-2" />
                    Add New Service
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                    <DialogDescription>
                      {editingService ? 'Update the service details' : 'Create a new service'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="features">Features (one per line)</Label>
                      <Textarea
                        id="features"
                        value={formData.features}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="icon">Icon Name</Label>
                      <Input
                        id="icon"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="Code, Smartphone, Cloud, etc."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingService ? 'Update' : 'Create'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.map((service: any) => (
                <Card key={service._id} className="bg-card/50 backdrop-blur-sm border-border">
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Features:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {service.features?.map((feature: string, idx: number) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service)}
                        className="flex-1"
                      >
                        <Edit size={14} className="mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this service?')) {
                            deleteMutation.mutate(service._id);
                          }
                        }}
                        className="flex-1"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {services?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No services found. Add your first service!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ManageServices;

