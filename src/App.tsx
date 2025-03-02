import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Tech from "./pages/Tech";
import TechWrite from "./pages/TechWrite";
import TechDetail from "./pages/TechDetail";
import TechEdit from "./pages/TechEdit";
import Operation from "./pages/Operation";
import OperationWrite from "./pages/OperationWrite";
import Study from "./pages/Study";
import StudyDetail from "./pages/StudyDetail";
import StudyEdit from "./pages/StudyEdit";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Info from "./pages/Info";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Info Route */}
          <Route
            path="/info"
            element={
              <ProtectedRoute>
                <Info />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Routes */}
          <Route
            path="/tech"
            element={
              <ProtectedRoute>
                <Tech />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tech/write"
            element={
              <ProtectedRoute>
                <TechWrite />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tech/:id"
            element={
              <ProtectedRoute>
                <TechDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tech/edit/:id"
            element={
              <ProtectedRoute>
                <TechEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operation"
            element={
              <ProtectedRoute>
                <Operation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operation/write"
            element={
              <ProtectedRoute>
                <OperationWrite />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study"
            element={
              <ProtectedRoute>
                <Study />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study/:id"
            element={
              <ProtectedRoute>
                <StudyDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study/edit/:id"
            element={
              <ProtectedRoute>
                <StudyEdit />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
