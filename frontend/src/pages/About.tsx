import { Target, Eye, Award, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To empower businesses through innovative technology solutions that drive growth, efficiency, and digital transformation.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "To be the global leader in IT solutions, recognized for excellence, innovation, and lasting client partnerships.",
    },
    {
      icon: Award,
      title: "Our Values",
      description:
        "Integrity, innovation, excellence, and customer success guide everything we do at Speshway Solutions.",
    },
    {
      icon: Users,
      title: "Our Team",
      description:
        "A diverse team of passionate experts dedicated to delivering world-class solutions and exceptional service.",
    },
  ];

  const stats = [
    { number: "500+", label: "Projects Completed" },
    { number: "200+", label: "Happy Clients" },
    { number: "50+", label: "Team Members" },
    { number: "15+", label: "Years Experience" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              About <span className="text-primary">Speshway Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Pioneering digital transformation with innovative IT solutions since 2009. We're not just developers –
              we're your technology partners in success.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm border-border">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2009, Speshway Solutions Private Limited began with a simple yet powerful vision: to bridge
                  the gap between businesses and cutting-edge technology. What started as a small team of passionate
                  developers has grown into a full-service IT solutions provider serving clients across the globe.
                </p>
                <p>
                  Over the years, we've evolved alongside the rapidly changing technology landscape, continuously
                  expanding our expertise and service offerings. From web development to AI-powered solutions, we've
                  remained committed to delivering innovation that matters.
                </p>
                <p>
                  Today, we're proud to be a trusted partner for businesses of all sizes, from ambitious startups to
                  established enterprises. Our success is measured not just by the projects we complete, but by the
                  lasting relationships we build and the tangible results we deliver.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Drives Us</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our core values and principles that shape every decision and project we undertake.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card
                key={index}
                className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:animate-glow">
                  <value.icon className="text-primary" size={28} />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
