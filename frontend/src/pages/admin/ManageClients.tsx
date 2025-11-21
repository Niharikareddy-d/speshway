import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Plus, Edit, Trash2, ArrowLeft, LogOut, Users } from 'lucide-react';

const ManageClients = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: '',
    description: '',
    isActive: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients', 'admin'],
    queryFn: () => api.get('/clients?all=true').then(res => {
      // Handle both array response and wrapped response
      const data = res.data;
      return Array.isArray(data) ? data : (data?.data || data || []);
    }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/clients', data),
    onSuccess: (response) => {
      // Handle response data (axios wraps in .data)
      const newClient = response.data?.data || response.data;
      // Optimistically update the cache immediately - add at beginning (latest first)
      queryClient.setQueryData(['clients', 'admin'], (old: any) => {
        return old ? [newClient, ...old] : [newClient];
      });
      // Invalidate public query to update homepage
      queryClient.invalidateQueries({ queryKey: ['clients'], exact: false });
      toast({ title: 'Client created successfully' });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating client',
        description: error.response?.data?.message || 'Failed to create client',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/clients/${id}`, data),
    onSuccess: (response, variables) => {
      // Handle response data (axios wraps in .data)
      const updatedClient = response.data?.data || response.data;
      // Optimistically update the cache immediately
      queryClient.setQueryData(['clients', 'admin'], (old: any) => {
        return old ? old.map((item: any) => item._id === variables.id ? updatedClient : item) : [updatedClient];
      });
      // Invalidate public query to update homepage
      queryClient.invalidateQueries({ queryKey: ['clients'], exact: false });
      toast({ title: 'Client updated successfully' });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating client',
        description: error.response?.data?.message || 'Failed to update client',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({ title: 'Client deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting client',
        description: error.response?.data?.message || 'Failed to delete client',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({ name: '', logo: '', website: '', description: '', isActive: true });
    setEditingClient(null);
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      logo: client.logo || '',
      website: client.website || '',
      description: client.description || '',
      isActive: client.isActive
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean up the data - convert empty strings to empty strings (backend handles defaults)
    const data = {
      name: formData.name.trim(),
      logo: formData.logo.trim() || '',
      website: formData.website.trim() || '',
      description: formData.description.trim() || '',
      isActive: formData.isActive
    };

    if (editingClient) {
      updateMutation.mutate({ id: editingClient._id, data });
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
                  <h1 className="text-3xl font-bold text-foreground mb-2">Manage Clients</h1>
                  <p className="text-muted-foreground">Add, edit, or delete clients</p>
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
                    Add New Client
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
                    <DialogDescription>
                      {editingClient ? 'Update the client details' : 'Create a new client'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Client Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="logo">Logo URL (optional)</Label>
                      <Input
                        id="logo"
                        value={formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website URL (optional)</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description about the client"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Active (visible on homepage)</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingClient ? 'Update' : 'Create'}
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
              {clients?.map((client: any) => (
                <Card key={client._id} className="bg-card/50 backdrop-blur-sm border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {client.logo && (
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="w-12 h-12 object-contain rounded"
                        />
                      )}
                      <div>
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        <CardDescription>
                          {client.isActive ? 'Active' : 'Inactive'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {client.website && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Website: <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{client.website}</a>
                      </p>
                    )}
                    {client.description && (
                      <p className="text-sm text-muted-foreground mb-4">{client.description}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(client)}
                        className="flex-1"
                      >
                        <Edit size={14} className="mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this client?')) {
                            deleteMutation.mutate(client._id);
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

            {clients?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No clients found. Add your first client!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ManageClients;
