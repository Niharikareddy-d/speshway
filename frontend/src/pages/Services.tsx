import { Code, Smartphone, Cloud, Brain, Database, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { StaggerContainer, StaggerItem, HoverScale, FadeIn } from "@/components/animations";

// Icon mapping
const iconMap: { [key: string]: any } = {
  Code,
  Smartphone,
  Cloud,
  Brain,
  Database,
  Shield,
};

const Services = () => {
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(res => res.data),
  });

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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center text-red-500">Error loading services</div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Our <span className="text-primary">Services</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Comprehensive IT solutions tailored to your business needs. From development to deployment, we've got you
                covered.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {services && services.length > 0 ? (
            <StaggerContainer staggerDelay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service: any, index: number) => {
                  const IconComponent = iconMap[service.icon] || Code;
                  return (
                    <StaggerItem key={service._id || index}>
                      <HoverScale>
                        <Card
                          className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all group hover:shadow-lg hover:shadow-primary/10"
                        >
                          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:animate-glow">
                            <IconComponent className="text-primary" size={32} />
                          </div>
                          <h3 className="text-2xl font-bold text-foreground mb-4">{service.title}</h3>
                          <p className="text-muted-foreground mb-6">{service.description}</p>
                          <ul className="space-y-2">
                            {service.features?.map((feature: string, idx: number) => (
                              <li key={idx} className="flex items-center text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </Card>
                      </HoverScale>
                    </StaggerItem>
                  );
                })}
              </div>
            </StaggerContainer>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="container mx-auto px-4 relative z-10">
          <Card className="p-12 bg-card/80 backdrop-blur-sm border-border text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-4">Need a Custom Solution?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Don't see exactly what you're looking for? We specialize in creating custom solutions tailored to your
              unique requirements.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Discuss Your Project
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
