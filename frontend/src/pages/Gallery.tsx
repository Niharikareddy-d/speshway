import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Award,
  Users,
  PartyPopper,
  Eye,
  Image,
  Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from '@/components/animations';

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
  formattedDate?: string;
  createdAt?: string;
}


const Gallery = () => {
  const { toast } = useToast();
  
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [groupedItems, setGroupedItems] = useState<{ [key: string]: GalleryItem[] }>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('galleryReadIds') || '[]');
      return new Set(Array.isArray(saved) ? saved : []);
    } catch {
      return new Set<string>();
    }
  });

  useEffect(() => {
    fetchGalleryItems();
    fetchCategories();
  }, []);


  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      // Fetch all items without pagination or category filter
      const response = await fetch(`${API_URL}/gallery?limit=1000`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch gallery items' }));
        throw new Error(errorData.message || 'Failed to fetch gallery items');
      }

      const data = await response.json();
      const items = data.data || [];
      setGalleryItems(items);
      recomputeGroups(items, selectedCategory, selectedStatus, readIds);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load gallery items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/gallery/categories`);
      if (!response.ok) return;
      const data = await response.json();
      const list: string[] = data.data || [];
      setCategories(list);
    } catch {}
  };

  const isNewItem = (item: GalleryItem) => {
    const dateStr = item.createdAt || item.date;
    if (!dateStr) return false;
    const itemDate = new Date(dateStr).getTime();
    const days30 = 30 * 24 * 60 * 60 * 1000;
    return Date.now() - itemDate <= days30;
  };

  const recomputeGroups = (
    items: GalleryItem[],
    categoryFilter: string,
    statusFilter: string,
    readSet: Set<string>
  ) => {
    const filtered = items.filter((item) => {
      const categoryMatch = categoryFilter === 'all' || (item.category || 'Uncategorized') === categoryFilter;
      let statusMatch = true;
      if (statusFilter === 'new') statusMatch = isNewItem(item);
      else if (statusFilter === 'read') statusMatch = readSet.has(item._id);
      else if (statusFilter === 'unread') statusMatch = !readSet.has(item._id);
      return categoryMatch && statusMatch;
    });

    const grouped: { [key: string]: GalleryItem[] } = {};
    filtered.forEach((item: GalleryItem) => {
      const category = item.category || 'Uncategorized';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    });
    setGroupedItems(grouped);
  };

  useEffect(() => {
    recomputeGroups(galleryItems, selectedCategory, selectedStatus, readIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedStatus, readIds, galleryItems]);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Fests': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      'Awards': 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
      'Fun Activities': 'bg-gradient-to-r from-green-500 to-teal-500 text-white',
      'Team Moments': 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
    };
    return colors[category as keyof typeof colors] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Fests': PartyPopper,
      'Awards': Award,
      'Fun Activities': Users,
      'Team Moments': Users
    };
    return icons[category as keyof typeof icons] || Sparkles;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE1MFYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIyNSAxMjVIMjAwVjE3NUgyMjVWMTI1WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTc1IDE3NUgxNTBWMjAwSDE3NVYxNzVaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMjUgMTc1SDIwMFYyMDBIMjI1VjE3NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
  };

  const GalleryCard = ({ item }: { item: GalleryItem }) => {

    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={item.image.url} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
            onClick={() => {
              setSelectedItem(item);
              const next = new Set(readIds);
              next.add(item._id);
              setReadIds(next);
              localStorage.setItem('galleryReadIds', JSON.stringify(Array.from(next)));
            }}
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setSelectedItem(item);
                  const next = new Set(readIds);
                  next.add(item._id);
                  setReadIds(next);
                  localStorage.setItem('galleryReadIds', JSON.stringify(Array.from(next)));
                }}
                className="w-full"
              >
                <Eye size={16} className="mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </CardTitle>
          <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {item.location && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span className="line-clamp-1">{item.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(item.date)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video" />
          <CardHeader>
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
                Our Gallery
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Explore our journey through memorable moments, achievements, and celebrations
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
              <div className="flex gap-4 flex-wrap">
                <div className="w-[220px]">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-[220px]">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <>
                {Object.keys(groupedItems).length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                      <Image className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground mb-2">
                      No gallery items found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Check back later for amazing content!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {Object.entries(groupedItems).map(([category, items]) => {
                      const CategoryIcon = getCategoryIcon(category);
                      return (
                        <div key={category} className="space-y-6">
                          <div className="flex items-center gap-3">
                            <CategoryIcon className="w-6 h-6 text-primary" />
                            <h2 className="text-3xl font-bold text-foreground">
                              {category}
                            </h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
                            <Badge className={getCategoryColor(category)}>
                              {items.length} {items.length === 1 ? 'item' : 'items'}
                            </Badge>
                          </div>
                          <StaggerContainer staggerDelay={0.1}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {items.map((item) => (
                                <StaggerItem key={item._id}>
                                  <HoverScale>
                                    <GalleryCard item={item} />
                                  </HoverScale>
                                </StaggerItem>
                              ))}
                            </div>
                          </StaggerContainer>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Image Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedItem.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={selectedItem.image.url} 
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(selectedItem.category)}>
                      {getCategoryIcon(selectedItem.category) && 
                        React.createElement(getCategoryIcon(selectedItem.category), { size: 12, className: "mr-1" })
                      }
                      {selectedItem.category}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {selectedItem.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {selectedItem.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{selectedItem.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(selectedItem.date)}</span>
                    </div>
                  </div>
                  
                  {selectedItem.readMoreLink && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedItem.readMoreLink, '_blank')}
                      className="w-full sm:w-auto"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Read More
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
