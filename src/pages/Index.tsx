
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
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <svg className="w-full absolute bottom-0" 
            viewBox="0 0 1440 320" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: 'translateY(1px)' }}>
            <path 
              fill="#e0f2fe" 
              fillOpacity="0.6" 
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="animate-wave">
            </path>
            <path 
              fill="#bae6fd" 
              fillOpacity="0.4" 
              d="M0,256L48,261.3C96,267,192,277,288,261.3C384,245,480,203,576,197.3C672,192,768,224,864,213.3C960,203,1056,149,1152,138.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="animate-wave" 
              style={{ animationDelay: '0.2s' }}>
            </path>
            <path 
              fill="#7dd3fc" 
              fillOpacity="0.3" 
              d="M0,288L48,282.7C96,277,192,267,288,245.3C384,224,480,192,576,181.3C672,171,768,181,864,181.3C960,181,1056,171,1152,160C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="animate-wave"
              style={{ animationDelay: '0.4s' }}>
            </path>
          </svg>
        </div>

        <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to TGWing
            </h1>
            <p className="text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The Greatest Waving
              <span className="block text-xl mt-2">
                혁신적인 생각과 기술로 파도를 일으키는 우리들의 이야기
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 relative mt-24">
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
        </main>
      </div>
    </div>
  );
};

export default Index;
