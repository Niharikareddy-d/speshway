import { Link } from "react-router-dom";
import { ArrowRight, Code, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-bg.png";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/animations";
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const Home = () => {
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get('/clients').then(res => {
      // Handle both array response and wrapped response
      const data = res.data;
      return Array.isArray(data) ? data : (data?.data || data || []);
    }),
  });

  const features = [
    {
      icon: Code,
      title: "Custom Development",
      description: "Tailored software solutions built to match your unique business needs.",
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Agile methodology ensuring rapid deployment without compromising quality.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security and 99.9% uptime guarantee for peace of mind.",
    },
    {
      icon: TrendingUp,
      title: "Scalable Solutions",
      description: "Architecture designed to grow with your business, from startup to enterprise.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.3)",
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn delay={0.2} duration={0.8}>
            <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-glow">
                Welcome to the Future of IT
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Transform Your Business with{" "}
              <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Cutting-Edge
              </span>{" "}
              Technology
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Speshway Solutions delivers innovative IT solutions that drive digital transformation and accelerate
              business growth in the modern era.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group">
                  Get Started
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
              <Link to="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/50 text-foreground hover:bg-primary/10 font-semibold"
                >
                  Explore Services
                </Button>
              </Link>
            </div>
            </div>
          </FadeIn>
        </div>

        <div className="absolute bottom-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </section>
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <StaggerContainer staggerDelay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <StaggerItem>
                <HoverScale scale={1.05}>
                  <Card className="p-8 bg-card/50 backdrop-blur-sm border-border text-center group hover:border-primary/50 transition-all">
                    <div className="text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">100+</div>
                    <div className="text-muted-foreground">Projects Delivered</div>
                  </Card>
                </HoverScale>
              </StaggerItem>
              <StaggerItem>
                <HoverScale scale={1.05}>
                  <Card className="p-8 bg-card/50 backdrop-blur-sm border-border text-center group hover:border-primary/50 transition-all">
                    <div className="text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">76+</div>
                    <div className="text-muted-foreground">Happy Clients</div>
                  </Card>
                </HoverScale>
              </StaggerItem>
              <StaggerItem>
                <HoverScale scale={1.05}>
                  <Card className="p-8 bg-card/50 backdrop-blur-sm border-border text-center group hover:border-primary/50 transition-all">
                    <div className="text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">300+</div>
                    <div className="text-muted-foreground">Team Members</div>
                  </Card>
                </HoverScale>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </div>
      </section>
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Speshway?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine innovation, expertise, and dedication to deliver exceptional results.
            </p>
          </div>

          <StaggerContainer staggerDelay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <StaggerItem key={index}>
                  <HoverScale>
                    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/10">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:animate-glow transition-all">
                        <feature.icon className="text-primary" size={24} />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </Card>
                  </HoverScale>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Trusted Clients</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Proud to serve industry leaders across various sectors
            </p>
          </div>
          {clients && clients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {clients.filter((client: any) => client.isActive).map((client: any) => (
                <Card key={client._id} className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all text-center group">
                  {client.logo && (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-16 h-16 object-contain mx-auto mb-4 rounded"
                    />
                  )}
                  <div className="text-xl font-semibold text-primary mb-2 group-hover:scale-110 transition-transform">{client.name}</div>
                  {client.website && (
                    <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Visit Website
                    </a>
                  )}
                  {client.description && (
                    <p className="text-sm text-muted-foreground mt-2">{client.description}</p>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">No clients added yet. Admin can add clients from the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      

      <Footer />
    </div>
  );
};

export default Home;
