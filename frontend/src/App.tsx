import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, Spin } from "antd";
import { antdTheme } from "@/config/antd-theme";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Team = lazy(() => import("./pages/Team"));
const Career = lazy(() => import("./pages/Career"));
const Contact = lazy(() => import("./pages/Contact"));
const SendResume = lazy(() => import("./pages/SendResume"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Gallery = lazy(() => import("./pages/Gallery"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Submissions = lazy(() => import("./pages/admin/Submissions"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ManageServices = lazy(() => import("./pages/admin/ManageServices"));
const ManagePortfolio = lazy(() => import("./pages/admin/ManagePortfolio"));
const ManageTeam = lazy(() => import("./pages/admin/ManageTeam"));
const ManageGallery = lazy(() => import("./pages/admin/ManageGallery"));
const ManageClients = lazy(() => import("./pages/admin/ManageClients"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spin size="large" />
  </div>
);

const App = () => (
  <ConfigProvider theme={antdTheme}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/team" element={<Team />} />
            <Route path="/career" element={<Career />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/send-resume" element={<SendResume />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/services" element={<ManageServices />} />
            <Route path="/admin/portfolio" element={<ManagePortfolio />} />
            <Route path="/admin/team" element={<ManageTeam />} />
            <Route path="/admin/gallery" element={<ManageGallery />} />
            <Route path="/admin/clients" element={<ManageClients />} />
            <Route path="/admin/submissions" element={<Submissions />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </ConfigProvider>
);

export default App;
