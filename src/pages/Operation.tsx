
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

interface OperationPost {
  id: string;
  title: string;
  thumbnail: string;
  uploadAt: string;
  author: string;
}

const mockPosts: OperationPost[] = [
  {
    id: "1",
    title: "2024년도 1학기 신입부원 모집",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    uploadAt: "2024-02-20",
    author : "운영진"
  },
  {
    id: "2",
    title: "2024년도 정기총회 안내",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    uploadAt: "2024-02-19",
    author: "회장"
  }
];

const Operation = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["operation-posts", page, debouncedSearch],
    queryFn: async () => {
      return {
        posts: mockPosts,
        totalPages: 1
      };
    }
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="relative">
        <div className="container mx-auto px-4 pt-28 pb-16">
          {/* Hero Section */}
          <div className="w-full h-48 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg mb-10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Operations Banner" 
                className="w-full h-full object-cover opacity-50"
              />
            </div>
            <div className="text-center z-10">
              <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
              <p className="text-white/80">TGWing 프로젝트 및 운영 소식</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-8">
            <div className="relative flex items-center flex-1 mr-4">
              <Input
                type="search"
                placeholder="검색어를 입력하세요..."
                className="pl-10 rounded-full border-gray-300 text-gray-800 placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Button
              onClick={() => navigate("/operation/write")}
              className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 rounded-full"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              글 작성
            </Button>
          </div>

          <div className="space-y-6 mb-8">
            {isLoading ? (
              <div className="text-center text-gray-600">로딩 중...</div>
            ) : (
              data?.posts.map((post: OperationPost) => (
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
      </div>
    </div>
  );
};

export default Operation;
