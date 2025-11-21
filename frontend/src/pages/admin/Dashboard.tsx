import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Briefcase, Users, LogOut, FileText, Image, Building2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out.",
    });
  };

  const menuItems = [
    {
      title: 'Services',
      description: 'Manage your services',
      icon: Settings,
      path: '/admin/services',
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      title: 'Projects',
      description: 'Manage projects',
      icon: Briefcase,
      path: '/admin/portfolio',
      color: 'from-purple-500/20 to-pink-500/20'
    },
    {
      title: 'Team',
      description: 'Manage team members',
      icon: Users,
      path: '/admin/team',
      color: 'from-green-500/20 to-teal-500/20'
    },
    {
      title: 'Gallery',
      description: 'Manage gallery images',
      icon: Image,
      path: '/admin/gallery',
      color: 'from-pink-500/20 to-rose-500/20'
    },
    {
      title: 'Clients',
      description: 'Manage client testimonials',
      icon: Building2,
      path: '/admin/clients',
      color: 'from-indigo-500/20 to-purple-500/20'
    },
    {
      title: 'Submissions',
      description: 'View contact submissions',
      icon: FileText,
      path: '/admin/submissions',
      color: 'from-orange-500/20 to-red-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your website content</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={index}
                    className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/10"
                    onClick={() => navigate(item.path)}
                  >
                    <CardHeader>
                      <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className="text-primary" size={32} />
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Manage {item.title}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;

