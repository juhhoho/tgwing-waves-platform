
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_POSTS = {
  operation: [
    {
      title: "2024 신입 부원 모집 안내",
      description: "TGWing에서 2024학년도 신입 부원을 모집합니다. 컴퓨터공학에 관심이 있는 열정 넘치는 학우들의 많은 관심 부탁드립니다.",
      date: "2024.03.15",
      author: "운영진",
    },
    {
      title: "3월 정기 세미나 일정",
      description: "이번 달 정기 세미나에서는 최신 AI 기술 동향과 프로젝트 중간 발표가 있을 예정입니다.",
      date: "2024.03.10",
      author: "운영진",
    },
  ],
  tech: [
    {
      title: "React와 TypeScript로 시작하는 웹 개발",
      description: "React와 TypeScript를 활용한 모던 웹 개발의 기초부터 실전까지 다뤄봅니다.",
      date: "2024.03.14",
      author: "김개발",
    },
    {
      title: "알고리즘 스터디 후기",
      description: "6주간의 알고리즘 스터디를 통해 배운 점과 성장 경험을 공유합니다.",
      date: "2024.03.12",
      author: "이코딩",
    },
  ],
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#1E90FF] font-pixel">
      <Navbar />
      
      <div className="relative overflow-hidden">
        <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="text-center mb-16 animate-fade-in relative">
            <div className="relative z-20 mb-8">
              <h1 className="text-6xl font-bold text-white mb-6 [text-shadow:4px_4px_0_rgba(0,0,0,0.1)] [image-rendering:pixelated]">
                Welcome to TGWing
              </h1>
              <p className="text-3xl text-white max-w-2xl mx-auto leading-relaxed [text-shadow:2px_2px_0_rgba(0,0,0,0.1)] [image-rendering:pixelated]">
                The Greatest Waving
                <span className="block text-2xl mt-4 text-white/90">
                  혁신적인 생각과 기술로 파도를 일으키는 우리들의 이야기
                </span>
              </p>
            </div>

            <div className="mt-8 relative h-32">
              <svg className="w-full absolute bottom-0" 
                viewBox="0 0 1440 320" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ 
                  imageRendering: 'pixelated',
                  transform: 'translateY(1px)'
                }}>
                <path 
                  fill="#E0F2FE" 
                  fillOpacity="0.8" 
                  d="M0,96L48,128C96,160,192,224,288,245.3C384,267,480,245,576,234.7C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  className="animate-wave">
                </path>
                <path 
                  fill="#BAE6FD" 
                  fillOpacity="0.6" 
                  d="M0,160L48,170.7C96,181,192,203,288,213.3C384,224,480,224,576,213.3C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  className="animate-wave" 
                  style={{ animationDelay: '0.2s' }}>
                </path>
                <path 
                  fill="#7DD3FC" 
                  fillOpacity="0.4" 
                  d="M0,224L48,229.3C96,235,192,245,288,234.7C384,224,480,192,576,181.3C672,171,768,181,864,197.3C960,213,1056,235,1152,229.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  className="animate-wave"
                  style={{ animationDelay: '0.4s' }}>
                </path>
              </svg>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 relative mt-24">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white mb-4 [text-shadow:2px_2px_0_rgba(0,0,0,0.1)] [image-rendering:pixelated]">운영 소식</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => window.location.href = '/operation'}
                >
                  <PlusCircle className="w-5 h-5" />
                </Button>
              </div>
              {SAMPLE_POSTS.operation.map((post, index) => (
                <BlogCard
                  key={index}
                  {...post}
                  type="operation"
                />
              ))}
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white mb-4 [text-shadow:2px_2px_0_rgba(0,0,0,0.1)] [image-rendering:pixelated]">기술 블로그</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => window.location.href = '/tech'}
                >
                  <PlusCircle className="w-5 h-5" />
                </Button>
              </div>
              {SAMPLE_POSTS.tech.map((post, index) => (
                <BlogCard
                  key={index}
                  {...post}
                  type="tech"
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
