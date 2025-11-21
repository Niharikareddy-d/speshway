import { useState } from "react";
import { Linkedin, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/animations";

const Team = () => {
  const { data: team, isLoading, error } = useQuery({
    queryKey: ['team'],
    queryFn: () => api.get('/team').then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
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
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center text-red-500">Error loading team</div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 sm:py-28 md:py-32 bg-gradient-to-br from-primary/20 via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                Meet Our <span className="text-primary">Team</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
                Talented professionals dedicated to delivering exceptional results and driving your success.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Our Team</h2>
          </div>

          {team && team.length > 0 ? (
            <StaggerContainer staggerDelay={0.1}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {team.map((member: any, index: number) => (
                  <StaggerItem key={member._id || index}>
                    <HoverScale>
                      <Card
                        className="overflow-hidden bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 group hover-lift hover-glow"
                      >
                  {member.image?.url ? (
                    <div className="h-48 sm:h-56 md:h-64 relative overflow-hidden">
                      <img
                        src={member.image.url}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div
                      className={`h-48 sm:h-56 md:h-64 bg-gradient-to-br ${member.color || 'from-purple-500 to-pink-500'} flex items-center justify-center relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-background/20 group-hover:bg-background/10 transition-colors duration-300" />
                      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-primary/20 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">{member.name.charAt(0)}</span>
                      </div>
                    </div>
                  )}
                  <div className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">{member.name}</h3>
                    <div className="text-sm sm:text-base text-primary font-medium mb-2 sm:mb-3">{member.role}</div>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">{member.bio}</p>
                    <div className="flex space-x-2">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-secondary/50 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                        >
                          <Linkedin size={16} className="sm:w-[18px] sm:h-[18px] text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-secondary/50 hover:bg-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                        >
                          <Mail size={16} className="sm:w-[18px] sm:h-[18px] text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}
                    </div>
                  </div>
                      </Card>
                    </HoverScale>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No team members available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">Our Culture</h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
                What makes Speshway a great place to work and grow
              </p>
            </div>
            
            <StaggerContainer staggerDelay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <StaggerItem>
              <HoverScale>
              <Card className="p-5 sm:p-6 bg-card/50 backdrop-blur-sm border-border text-center hover-lift hover-glow transition-all duration-300">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 hover:scale-110 transition-transform duration-300">🚀</div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Innovation First</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  We encourage creativity and embrace new technologies
                </p>
              </Card>
              </HoverScale>
              </StaggerItem>
              <StaggerItem>
              <HoverScale>
              <Card className="p-5 sm:p-6 bg-card/50 backdrop-blur-sm border-border text-center hover-lift hover-glow transition-all duration-300">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 hover:scale-110 transition-transform duration-300">🤝</div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Collaboration</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Team work and knowledge sharing are at our core
                </p>
              </Card>
              </HoverScale>
              </StaggerItem>
              <StaggerItem>
              <HoverScale>
              <Card className="p-5 sm:p-6 bg-card/50 backdrop-blur-sm border-border text-center hover-lift hover-glow transition-all duration-300">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 hover:scale-110 transition-transform duration-300">📈</div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Growth Mindset</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Continuous learning and development opportunities
                </p>
              </Card>
              </HoverScale>
              </StaggerItem>
            </div>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Culture Photos Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">Life at Speshway</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
              Get a glimpse into our vibrant workplace culture and team activities
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="group relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center hover:scale-105 transition-transform duration-300 hover-glow animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="text-center p-3 sm:p-4">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">🤝</div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">Team Collaboration</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Working together on innovative projects</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center hover:scale-105 transition-transform duration-300 hover-glow animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="text-center p-3 sm:p-4">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">🏢</div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">Modern Workspace</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Comfortable and inspiring environment</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center hover:scale-105 transition-transform duration-300 hover-glow animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="text-center p-3 sm:p-4">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">🎉</div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">Celebrating Success</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Milestones and achievements</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center hover:scale-105 transition-transform duration-300 hover-glow animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <div className="text-center p-3 sm:p-4">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">📚</div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">Learning & Growth</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Continuous skill development</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center hover:scale-105 transition-transform duration-300 hover-glow animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <div className="text-center p-3 sm:p-4">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">🎯</div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">Team Building</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Fun activities and bonding</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center hover:scale-105 transition-transform duration-300 hover-glow animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <div className="text-center p-3 sm:p-4">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">💡</div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">Innovation Workshops</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Creative problem solving</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-pink-500/20 to-pink-500/5 flex items-center justify-center hover:scale-105 transition-transform duration-300 hover-glow animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
              <div className="text-center p-3 sm:p-4">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">☕</div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">Great Amenities</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Comfort and convenience</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 flex items-center justify-center hover:scale-105 transition-transform duration-300 hover-glow animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
              <div className="text-center p-3 sm:p-4">
                <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">🌍</div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">Diversity & Inclusion</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Celebrating our differences</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
