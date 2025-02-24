
import { Button } from "@/components/ui/button";
import { Activity, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAuthenticated = !!localStorage.getItem('accessToken');

  const handleNavigation = (path: string) => {
    if (!isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "해당 기능을 이용하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center space-x-2 text-tgwing-600 hover:text-tgwing-700 transition-colors">
            <Waves className="w-6 h-6" />
            <span className="text-xl font-semibold">TGWing</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/about" className="text-gray-600 hover:text-tgwing-600 transition-colors">동아리 소개</a>
            <button 
              onClick={() => handleNavigation('/operation')}
              className="text-gray-600 hover:text-tgwing-600 transition-colors"
            >
              운영 소식
            </button>
            <button 
              onClick={() => handleNavigation('/tech')}
              className="text-gray-600 hover:text-tgwing-600 transition-colors"
            >
              기술 블로그
            </button>
            <button 
              onClick={() => handleNavigation('/study')}
              className="text-gray-600 hover:text-tgwing-600 transition-colors flex items-center gap-1"
            >
              <Activity className="w-4 h-4" />
              스터디
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-tgwing-600"
                onClick={() => {
                  localStorage.removeItem('accessToken');
                  window.location.href = '/';
                }}
              >
                로그아웃
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-tgwing-600"
                  onClick={() => navigate('/login')}
                >
                  로그인
                </Button>
                <Button 
                  className="bg-tgwing-600 hover:bg-tgwing-700 text-white"
                  onClick={() => navigate('/register')}
                >
                  회원가입
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
