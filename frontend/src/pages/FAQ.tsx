import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/animations";

const FAQ = () => {
  const faqs = [
    {
      question: "What services does Speshway Solutions offer?",
      answer:
        "We offer a comprehensive range of IT services including web development, mobile app development, cloud solutions, AI & machine learning, database management, and cybersecurity. Our team specializes in creating custom solutions tailored to your specific business needs.",
    },
    {
      question: "How long does it take to complete a project?",
      answer:
        "Project timelines vary depending on complexity and scope. A simple website might take 4-6 weeks, while a complex enterprise application could take 3-6 months or more. We provide detailed timelines during the consultation phase and keep you updated throughout the development process.",
    },
    {
      question: "What is your development process?",
      answer:
        "We follow an agile development methodology that includes: 1) Discovery & Planning, 2) Design & Prototyping, 3) Development & Testing, 4) Deployment & Launch, and 5) Maintenance & Support. This ensures transparency, flexibility, and regular client involvement throughout the project.",
    },
    {
      question: "Do you provide ongoing support after project completion?",
      answer:
        "Yes! We offer comprehensive post-launch support and maintenance packages. This includes bug fixes, security updates, feature enhancements, and technical support. We believe in building long-term partnerships with our clients.",
    },
    {
      question: "What technologies do you work with?",
      answer:
        "We work with modern technologies including React, Next.js, Node.js, Python, React Native, Flutter, AWS, Azure, MongoDB, PostgreSQL, and many more. Our team stays updated with the latest technologies to provide cutting-edge solutions.",
    },
    {
      question: "How do you ensure project security?",
      answer:
        "Security is our top priority. We implement industry-standard security practices including encrypted data transmission, secure authentication, regular security audits, compliance with data protection regulations, and continuous monitoring for vulnerabilities.",
    },
    {
      question: "What are your payment terms?",
      answer:
        "We typically follow a milestone-based payment structure: 30% upon project initiation, 40% during development milestones, and 30% upon project completion. For larger projects, we can customize payment terms to suit your budget and requirements.",
    },
    {
      question: "Can you work with my existing team?",
      answer:
        "Absolutely! We excel at collaboration and can seamlessly integrate with your existing team. Whether you need staff augmentation, full team outsourcing, or technical consultation, we're flexible and adaptable to your working style.",
    },
    {
      question: "Do you sign NDAs?",
      answer:
        "Yes, we're happy to sign Non-Disclosure Agreements (NDAs) to protect your intellectual property and confidential information. We take client confidentiality very seriously and have strict internal policies to safeguard your data.",
    },
    {
      question: "What if I need to scale my project in the future?",
      answer:
        "We design all our solutions with scalability in mind. Whether you need to handle more users, add new features, or expand to new platforms, our architecture supports growth. We also offer ongoing development services to help you scale as your business grows.",
    },
  ];

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
                Frequently Asked <span className="text-primary">Questions</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Find answers to common questions about our services, process, and how we can help your business.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-card/50 backdrop-blur-sm border-border">
            <StaggerContainer staggerDelay={0.08}>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <StaggerItem key={index}>
                    <AccordionItem
                      value={`item-${index}`}
                      className="border border-border rounded-lg px-6 data-[state=open]:border-primary/50"
                    >
                      <AccordionTrigger className="text-left hover:text-primary transition-colors">
                        <span className="text-lg font-semibold">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pt-2">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </StaggerItem>
                ))}
              </Accordion>
            </StaggerContainer>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="container mx-auto px-4 relative z-10">
          <HoverScale>
          <Card className="p-12 bg-card/80 backdrop-blur-sm border-border text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-4">Still Have Questions?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our team is here to help. Get in touch with us and we'll respond as quickly as possible.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Contact Us
              </Button>
            </Link>
          </Card>
          </HoverScale>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
