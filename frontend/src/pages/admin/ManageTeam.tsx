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

const ManageTeam = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    color: 'from-purple-500 to-pink-500',
    linkedin: '',
    email: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: team, isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: () => api.get('/team').then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => api.post('/team', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    onSuccess: (response) => {
      // Handle response data (axios wraps in .data)
      const newMember = response.data?.data || response.data;
      // Optimistically update the cache immediately - add at beginning (latest first)
      queryClient.setQueryData(['team'], (old: any) => {
        return old ? [newMember, ...old] : [newMember];
      });
      toast({ title: 'Team member created successfully' });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating team member',
        description: error.response?.data?.message || 'Failed to create team member',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => api.put(`/team/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    onSuccess: (response, variables) => {
      // Handle response data (axios wraps in .data)
      const updatedMember = response.data?.data || response.data;
      // Optimistically update the cache immediately
      queryClient.setQueryData(['team'], (old: any) => {
        return old ? old.map((item: any) => item._id === variables.id ? updatedMember : item) : [updatedMember];
      });
      toast({ title: 'Team member updated successfully' });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating team member',
        description: error.response?.data?.message || 'Failed to update team member',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/team/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast({ title: 'Team member deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting team member',
        description: error.response?.data?.message || 'Failed to delete team member',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      color: 'from-purple-500 to-pink-500',
      linkedin: '',
      email: ''
    });
    setEditingMember(null);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      color: member.color || 'from-purple-500 to-pink-500',
      linkedin: member.linkedin || '',
      email: member.email || ''
    });
    setImagePreview(member.image?.url || null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    formDataToSend.append('name', formData.name);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('color', formData.color);
    formDataToSend.append('linkedin', formData.linkedin);
    formDataToSend.append('email', formData.email);
    
    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }

    if (editingMember) {
      updateMutation.mutate({ id: editingMember._id, data: formDataToSend });
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
                  <h1 className="text-3xl font-bold text-foreground mb-2">Manage Team</h1>
                  <p className="text-muted-foreground">Add, edit, or delete team members</p>
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
                    Add New Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
                    <DialogDescription>
                      {editingMember ? 'Update the team member details' : 'Create a new team member'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="color">Color Gradient</Label>
                      <Input
                        id="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="from-purple-500 to-pink-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn URL (optional)</Label>
                      <Input
                        id="linkedin"
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email (optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Profile Image</Label>
                      {imagePreview ? (
                        <div className="relative mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-full border-4 border-border mx-auto"
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
                        {editingMember ? 'Update' : 'Create'}
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
              {team?.map((member: any) => (
                <Card key={member._id} className="bg-card/50 backdrop-blur-sm border-border">
                  <CardHeader>
                    <div className={`h-32 bg-gradient-to-br ${member.color} rounded-lg flex items-center justify-center mb-4 overflow-hidden`}>
                      {member.image?.url ? (
                        <img
                          src={member.image.url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-3xl font-bold text-primary">{member.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(member)}
                        className="flex-1"
                      >
                        <Edit size={14} className="mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this team member?')) {
                            deleteMutation.mutate(member._id);
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

            {team?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No team members found. Add your first team member!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ManageTeam;

