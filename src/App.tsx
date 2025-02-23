
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Tech from "./pages/Tech";
import TechWrite from "./pages/TechWrite";
import Operation from "./pages/Operation";
import Study from "./pages/Study";
import StudyDetail from "./pages/StudyDetail";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tech" element={<Tech />} />
          <Route path="/tech/write" element={<TechWrite />} />
          <Route path="/operation" element={<Operation />} />
          <Route path="/study" element={<Study />} />
          <Route path="/study/:id" element={<StudyDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
