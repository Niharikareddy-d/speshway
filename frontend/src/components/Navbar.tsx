import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/portfolio", label: "Projects" },
    { path: "/gallery", label: "Gallery" },
    { path: "/team", label: "Team" },
    { path: "/career", label: "Career" },
    { path: "/faq", label: "FAQ" },
  ];

  const adminLinks = [
    { path: "/admin/login", label: "Admin" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative p-1 rounded-none bg-card/40 border border-border shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Speshway Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-none"
              />
              <span className="absolute inset-0 rounded-none ring-0 group-hover:ring-2 ring-primary/30 transition-all animate-glow" />
            </div>
            <span className="text-sm sm:text-lg md:text-xl font-bold text-foreground hidden sm:inline-block" style={{ fontFamily: 'Times New Roman, serif' }}>
              <span className="hidden md:inline">SPESHWAY SOLUTIONS PRIVATE LIMITED</span>
              <span className="md:hidden">SPESHWAY</span>
              <span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.path);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ease-out group hover:-translate-y-0.5 ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {/* Active underline */}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform origin-left transition-all duration-300 ${
                    isActive(link.path) 
                      ? "scale-x-100 opacity-100" 
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                  }`}
                />
                {/* Hover background effect */}
                <span className="absolute inset-0 bg-primary/5 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300 origin-center opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
            {adminLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.path);
                }}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ease-out group ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform origin-left transition-all duration-300 ${
                    isActive(link.path) 
                      ? "scale-x-100 opacity-100" 
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                  }`}
                />
                <span className="absolute inset-0 bg-primary/5 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300 origin-center opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
            <Button 
              onClick={(e) => {
                e.preventDefault();
                navigate("/contact");
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
            >
              Contact Us
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground p-2 rounded-lg hover:bg-secondary/50 transition-all duration-300 active:scale-95"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="transition-transform duration-300 rotate-0" />
            ) : (
              <Menu size={24} className="transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-2 border-t border-border">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.path);
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`block py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform ${
                  isMobileMenuOpen 
                    ? "translate-x-0 opacity-100" 
                    : "translate-x-full opacity-0"
                } ${
                  isActive(link.path)
                    ? "text-primary bg-primary/10 border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 active:bg-secondary/70"
                }`}
                style={{ 
                  transitionDelay: isMobileMenuOpen ? `${index * 0.05}s` : '0s'
                }}
              >
                {link.label}
              </Link>
            ))}
            {adminLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`block py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 transform ${
                  isMobileMenuOpen 
                    ? "translate-x-0 opacity-100" 
                    : "translate-x-full opacity-0"
                } ${
                  isActive(link.path)
                    ? "text-primary bg-primary/10 border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 active:bg-secondary/70"
                }`}
                style={{ 
                  transitionDelay: isMobileMenuOpen ? `${(navLinks.length + index) * 0.05}s` : '0s'
                }}
              >
                {link.label}
              </Link>
            ))}
            <div 
              className={`px-4 pt-2 transition-all duration-300 transform ${
                isMobileMenuOpen 
                  ? "translate-x-0 opacity-100" 
                  : "translate-x-full opacity-0"
              }`}
              style={{ 
                transitionDelay: isMobileMenuOpen ? `${(navLinks.length + adminLinks.length) * 0.05}s` : '0s'
              }}
            >
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/contact");
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
