
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";

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
    <div className="min-h-screen bg-gradient-to-b from-white to-tgwing-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to TGWing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The Greatest Waving - 혁신적인 생각과 기술로 파도를 일으키는 우리들의 이야기
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSIxMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0ODBjNDgwIDAgNDgwIDEyNCA5NjAgMTI0SDB6IiBmaWxsPSIjZjBmOWZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] 
            opacity-20 animate-wave pointer-events-none"
          />
          
          <div className="grid md:grid-cols-2 gap-8 relative">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">운영 소식</h2>
              {SAMPLE_POSTS.operation.map((post, index) => (
                <BlogCard
                  key={index}
                  {...post}
                  type="operation"
                />
              ))}
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">기술 블로그</h2>
              {SAMPLE_POSTS.tech.map((post, index) => (
                <BlogCard
                  key={index}
                  {...post}
                  type="tech"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
