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
import { Plus, Edit, Trash2, ArrowLeft, LogOut, Upload, X } from 'lucide-react';

const ManagePortfolio = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    technologies: '',
    color: 'from-blue-500/20 to-cyan-500/20'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['portfolios'],
    queryFn: () => api.get('/portfolios').then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => api.post('/portfolios', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    onSuccess: (response) => {
      // Handle response data (axios wraps in .data)
      const newProject = response.data?.data || response.data;
      // Optimistically update the cache immediately - add at beginning (latest first)
      queryClient.setQueryData(['portfolios'], (old: any) => {
        return old ? [newProject, ...old] : [newProject];
      });
      toast({ title: 'Project created successfully' });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating project',
        description: error.response?.data?.message || 'Failed to create project',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => api.put(`/portfolios/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    onSuccess: (response, variables) => {
      // Handle response data (axios wraps in .data)
      const updatedProject = response.data?.data || response.data;
      // Optimistically update the cache immediately
      queryClient.setQueryData(['portfolios'], (old: any) => {
        return old ? old.map((item: any) => item._id === variables.id ? updatedProject : item) : [updatedProject];
      });
      toast({ title: 'Project updated successfully' });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating project',
        description: error.response?.data?.message || 'Failed to update project',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/portfolios/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast({ title: 'Project deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting project',
        description: error.response?.data?.message || 'Failed to delete project',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      technologies: '',
      color: 'from-blue-500/20 to-cyan-500/20'
    });
    setEditingPortfolio(null);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleEdit = (portfolio: any) => {
    setEditingPortfolio(portfolio);
    setFormData({
      title: portfolio.title,
      category: portfolio.category,
      description: portfolio.description,
      technologies: portfolio.technologies.join(', '),
      color: portfolio.color || 'from-blue-500/20 to-cyan-500/20'
    });
    setImagePreview(portfolio.image?.url || null);
    setSelectedImage(null);
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    formDataToSend.append('title', formData.title);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('technologies', JSON.stringify(formData.technologies.split(',').map(t => t.trim()).filter(t => t)));
    formDataToSend.append('color', formData.color);
    
    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }

    if (editingPortfolio) {
      updateMutation.mutate({ 
        id: editingPortfolio._id, 
        data: formDataToSend 
      });
    } else {
      createMutation.mutate(formDataToSend);
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
                  <h1 className="text-3xl font-bold text-foreground mb-2">Manage Projects</h1>
                  <p className="text-muted-foreground">Add, edit, or delete projects</p>
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
                    Add New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingPortfolio ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                    <DialogDescription>
                      {editingPortfolio ? 'Update the project details' : 'Create a new project'}
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
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                      <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                      <Input
                        id="technologies"
                        value={formData.technologies}
                        onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                    <div>
                      <Label htmlFor="color">Color Gradient</Label>
                      <Input
                        id="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="from-blue-500/20 to-cyan-500/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Project Image</Label>
                      {imagePreview ? (
                        <div className="relative mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border border-border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveImage}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (MAX. 5MB)</p>
                            </div>
                            <input
                              id="image-upload"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingPortfolio ? 'Update' : 'Create'}
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
              {portfolios?.map((portfolio: any) => (
                <Card key={portfolio._id} className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
                  {portfolio.image?.url && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={portfolio.image.url}
                        alt={portfolio.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{portfolio.title}</CardTitle>
                    <CardDescription>{portfolio.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{portfolio.description}</p>
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Technologies:</p>
                      <div className="flex flex-wrap gap-2">
                        {portfolio.technologies?.map((tech: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-secondary/50 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(portfolio)}
                        className="flex-1"
                      >
                        <Edit size={14} className="mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this project?')) {
                            deleteMutation.mutate(portfolio._id);
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

            {portfolios?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No projects found. Add your first project!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ManagePortfolio;

