
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      
      <div className="relative">
        <main className="container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <img 
              src="/lovable-uploads/4a5e0136-fa69-4d89-a1ee-b42ee2a95138.png" 
              alt="TGwinG Logo" 
              className="mx-auto mb-12 h-20 object-contain"
            />
            
            <h1 className="text-5xl font-bold mb-8 text-gray-900">
              혁신적인 생각과 기술로 파도를 일으키는 우리들의 이야기
            </h1>
            
            <p className="text-xl mb-12 text-gray-600">
              The Greatest Waving!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate("/register")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full"
              >
                지금 시작하기
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/about")}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-6 text-lg rounded-full"
              >
                더 알아보기
              </Button>
            </div>

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">Developer</h3>
                <p className="text-gray-600">최신 기술 트렌드와 함께 성장하는 개발자 커뮤니티</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">Project</h3>
                <p className="text-gray-600">실전 프로젝트 경험을 통한 실력 향상</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">Community</h3>
                <p className="text-gray-600">함께 배우고 성장하는 열정 가득한 동료들</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
