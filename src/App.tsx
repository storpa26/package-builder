import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import Index from "./pages/Index";
import AlarmPackage from "./pages/AlarmPackage";
import WordPressAlarmPackage from "./pages/WordPressAlarmPackage";
import IntercomLanding from "./pages/IntercomLanding";
import IntercomWired from "./pages/IntercomWired";
import IntercomWireless from "./pages/IntercomWireless";
import TestLeadForm from "./pages/TestLeadForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  // Check if we're in WordPress context or standalone
  const isWordPress = typeof window !== 'undefined' && window.location.pathname.includes('wp-');
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  
  // For WordPress integration, render specific pages based on path
  if (isWordPress || currentPath === '/alarm' || (currentPath === '/' && !window.location.hash)) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="alarm-package-app">
            <WordPressAlarmPackage />
            <Toaster />
            <Sonner />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }
  
  // For other pages, use routing
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HashRouter>
          <div className="app">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/alarm" element={<AlarmPackage />} />
              <Route path="/alarm-wordpress" element={<WordPressAlarmPackage />} />
              <Route path="/intercom" element={<IntercomLanding />} />
              <Route path="/intercom-wired" element={<IntercomWired wiringType="wired" />} />
              <Route path="/intercom-wireless" element={<IntercomWireless wiringType="wireless" />} />
              <Route path="/test-lead-form" element={<TestLeadForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </div>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
export default App;
