
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#111827] text-white overflow-hidden">
      <Navbar />
      
      <div className="relative">
        <main className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-tgwing-400 to-tgwing-600">
              프로젝트에 즐거움을
              <br />
              모두에게 기회를
            </h1>
            
            <p className="text-xl sm:text-2xl mb-12 text-gray-300">
              혁신적인 생각과 기술로 파도를 일으키는 우리들의 이야기
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate("/register")}
                className="bg-tgwing-600 hover:bg-tgwing-700 text-white px-8 py-6 text-lg rounded-full"
              >
                지금 시작하기
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/about")}
                className="border-tgwing-400 text-tgwing-400 hover:bg-tgwing-400/10 px-8 py-6 text-lg rounded-full"
              >
                더 알아보기
              </Button>
            </div>

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-tgwing-400">Developer</h3>
                <p className="text-gray-400">최신 기술 트렌드와 함께 성장하는 개발자 커뮤니티</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-tgwing-400">Project</h3>
                <p className="text-gray-400">실전 프로젝트 경험을 통한 실력 향상</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-tgwing-400">Community</h3>
                <p className="text-gray-400">함께 배우고 성장하는 열정 가득한 동료들</p>
              </div>
            </div>
          </div>
        </main>

        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0 h-64 z-0">
          <svg className="w-full h-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path 
              fill="#0284c7" 
              fillOpacity="0.1" 
              d="M0,96L48,128C96,160,192,224,288,245.3C384,267,480,245,576,234.7C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="animate-wave"
            />
            <path 
              fill="#0284c7" 
              fillOpacity="0.2" 
              d="M0,160L48,170.7C96,181,192,203,288,213.3C384,224,480,224,576,213.3C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="animate-wave"
              style={{ animationDelay: "0.2s" }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Index;
