import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import Index from "./pages/Index";
import AlarmPackage from "./pages/AlarmPackage";
import WordPressAlarmPackage from "./pages/WordPressAlarmPackage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="alarm-package-app">
      <WordPressAlarmPackage />
    </div>
  );
}
export default App;
