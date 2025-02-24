
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/ui/pagination";
import TechBlogCard from "@/components/TechBlogCard";
import useDebounce from "@/hooks/useDebounce";
import { useNavigate } from "react-router-dom";

interface TechPost {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  author: {
    name: string;
    avatar: string;
  };
}

// 목업 데이터
const mockPosts: TechPost[] = [
  {
    id: "1",
    title: "React Query로 서버 상태 관리하기",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    createdAt: "2024-02-20",
    author: {
      name: "김철수",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    }
  },
  {
    id: "2",
    title: "TypeScript와 함께하는 안전한 코딩",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    createdAt: "2024-02-19",
    author: {
      name: "이영희",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    }
  },
  {
    id: "3",
    title: "Next.js 13의 새로운 기능 탐구",
    thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    createdAt: "2024-02-18",
    author: {
      name: "박지민",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
    }
  }
];

const Tech = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["tech-posts", page, debouncedSearch],
    queryFn: async () => {
      // 실제 API 호출 대신 목업 데이터 반환
      return {
        posts: mockPosts,
        totalPages: 1
      };
    }
  });

  return (
    <div className="min-h-screen bg-[#111827] text-white overflow-hidden">
      <Navbar />
      <div className="relative">
        <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div className="relative flex items-center flex-1 mr-4">
              <Input
                type="search"
                placeholder="검색어를 입력하세요..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Button
              onClick={() => navigate("/tech/write")}
              className="whitespace-nowrap bg-tgwing-600 hover:bg-tgwing-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              글 작성
            </Button>
          </div>

          <div className="space-y-4 mb-8">
            {isLoading ? (
              <div className="text-center text-white">로딩 중...</div>
            ) : (
              data?.posts.map((post: TechPost) => (
                <TechBlogCard key={post.id} post={post} />
              ))
            )}
          </div>

          {!isLoading && (
            <Pagination 
              className="mt-8"
              currentPage={page}
              totalPages={data?.totalPages || 1}
              onPageChange={setPage}
            />
          )}
        </div>

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

export default Tech;
