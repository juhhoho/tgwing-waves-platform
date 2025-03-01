
import { Button } from "@/components/ui/button";
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
    <nav className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center space-x-2 text-gray-900 hover:text-gray-700 transition-colors">
            <span className="text-xl font-bold">TGwinG</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">About</a>
            <button 
              onClick={() => handleNavigation('/operation')}
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Projects
            </button>
            <button 
              onClick={() => handleNavigation('/tech')}
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Blog
            </button>
            <button 
              onClick={() => handleNavigation('/study')}
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Study
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-900 text-sm"
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
                  className="text-gray-600 hover:text-gray-900 text-sm"
                  onClick={() => navigate('/login')}
                >
                  로그인
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full"
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
