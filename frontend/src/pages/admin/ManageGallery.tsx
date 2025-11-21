import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Briefcase, 
  Users, 
  LogOut, 
  FileText,
  Image,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  ExternalLink,
  Sparkles,
  Award,
  PartyPopper
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location?: string;
  readMoreLink?: string;
  image: {
    url: string;
    publicId: string;
  };
  isActive: boolean;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
  formattedDate?: string;
}

const ManageGallery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<GalleryItem | null>(null);
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Fests',
    date: '',
    location: '',
    readMoreLink: '',
    image: null as File | null
  });

  const [categories, setCategories] = useState<string[]>(['Fests', 'Awards', 'Fun Activities', 'Team Moments']);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchGalleryItems();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/gallery/categories`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch categories' }));
        throw new Error(errorData.message || 'Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch categories",
        variant: "destructive"
      });
    }
  };

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch(`${API_URL}/gallery${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch gallery items' }));
        throw new Error(errorData.message || 'Failed to fetch gallery items');
      }

      const data = await response.json();
      setGalleryItems(data.data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch gallery items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title.trim());
    formDataToSend.append('description', formData.description.trim());
    formDataToSend.append('category', formData.category);
    formDataToSend.append('date', formData.date);
    formDataToSend.append('location', formData.location.trim());
    formDataToSend.append('readMoreLink', formData.readMoreLink.trim());
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login again",
          variant: "destructive"
        });
        navigate('/admin/login');
        return;
      }
      
      const url = editingItem 
        ? `${API_URL}/gallery/${editingItem._id}`
        : `${API_URL}/gallery`;
      
      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to save gallery item' }));
        throw new Error(errorData.message || 'Failed to save gallery item');
      }

      const savedItem = await response.json();
      const itemData = savedItem.data || savedItem;

      // Optimistically update the state immediately instead of refetching
      if (editingItem) {
        setGalleryItems(prev => prev.map(item => 
          item._id === editingItem._id ? itemData : item
        ));
      } else {
        // Add at beginning (latest first)
        setGalleryItems(prev => [itemData, ...prev]);
      }

      toast({
        title: "Success",
        description: editingItem ? "Gallery item updated successfully" : "Gallery item created successfully"
      });

      resetForm();
      // Only refetch if we need to refresh categories or other data
      // fetchGalleryItems(); // Removed - using optimistic update instead
    } catch (error) {
      console.error('Error saving gallery item:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save gallery item",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login again",
          variant: "destructive"
        });
        navigate('/admin/login');
        return;
      }
      
      const response = await fetch(`${API_URL}/gallery/${deleteItem._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete gallery item' }));
        throw new Error(errorData.message || 'Failed to delete gallery item');
      }

      toast({
        title: "Success",
        description: "Gallery item deleted successfully"
      });

      setDeleteItem(null);
      fetchGalleryItems();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete gallery item",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Fests',
      date: '',
      location: '',
      readMoreLink: '',
      image: null
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      date: item.date.split('T')[0],
      location: item.location || '',
      readMoreLink: item.readMoreLink || '',
      image: null
    });
    setIsDialogOpen(true);
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

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a category name",
        variant: "destructive"
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login again",
          variant: "destructive"
        });
        navigate('/admin/login');
        return;
      }
      
      const response = await fetch(`${API_URL}/gallery/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create category' }));
        throw new Error(errorData.message || 'Failed to create category');
      }

      toast({
        title: "Success",
        description: "Category created successfully"
      });

      setNewCategoryName('');
      setShowNewCategoryInput(false);
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create category",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login again",
          variant: "destructive"
        });
        navigate('/admin/login');
        return;
      }
      
      const response = await fetch(`${API_URL}/gallery/categories/${encodeURIComponent(categoryName)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete category' }));
        throw new Error(errorData.message || 'Failed to delete category');
      }

      toast({
        title: "Success",
        description: "Category deleted successfully"
      });

      fetchCategories();
      if (selectedCategory === categoryName) {
        setSelectedCategory('all');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive"
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Fests': 'bg-purple-100 text-purple-800',
      'Awards': 'bg-yellow-100 text-yellow-800',
      'Fun Activities': 'bg-green-100 text-green-800',
      'Team Moments': 'bg-blue-100 text-blue-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Manage Gallery</h1>
                <p className="text-muted-foreground">Upload and manage gallery images</p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add New Image
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6 flex items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center justify-between w-full">
                        <span>{category}</span>
                        {category !== 'Fests' && category !== 'Awards' && category !== 'Fun Activities' && category !== 'Team Moments' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category);
                            }}
                          >
                            <Trash2 size={12} />
                          </Button>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {!showNewCategoryInput ? (
                <Button
                  onClick={() => setShowNewCategoryInput(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Category
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Enter category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-48"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCategory();
                      }
                      if (e.key === 'Escape') {
                        setShowNewCategoryInput(false);
                        setNewCategoryName('');
                      }
                    }}
                    autoFocus
                  />
                  <Button
                    onClick={handleAddCategory}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategoryName('');
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Gallery Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {galleryItems.map((item) => (
                  <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative">
                      <img 
                        src={item.image.url} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        {item.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span className="line-clamp-1">{item.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(item)}
                          className="flex-1"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteItem(item)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {galleryItems.length === 0 && !loading && (
              <div className="text-center py-12">
                <Image className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No gallery items found</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedCategory === 'all' 
                    ? "Get started by adding your first gallery image"
                    : `No items found in ${selectedCategory} category`
                  }
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Add New Image
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Enter image title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                placeholder="Enter image description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="readMoreLink">Read More Link</Label>
              <Input
                id="readMoreLink"
                type="url"
                value={formData.readMoreLink}
                onChange={(e) => setFormData({...formData, readMoreLink: e.target.value})}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image {editingItem ? '(optional - leave empty to keep current)' : '*'}</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})}
                {...(!editingItem && { required: true })}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {editingItem ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Gallery Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteItem?.title}"? This action cannot be undone and will also delete the associated image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageGallery;