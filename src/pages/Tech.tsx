import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/ui/pagination";
import TechBlogCard from "@/components/TechBlogCard";
import { useAxiosWithAuth } from "@/hooks/useAxiosWithAuth";
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

const Tech = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const axiosWithAuth = useAxiosWithAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["tech-posts", page, debouncedSearch],
    queryFn: async () => {
      const response = await axiosWithAuth.get(`/api/tech-posts`, {
        params: {
          page,
          search: debouncedSearch,
          limit: 5
        }
      });
      return response.data;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#1E90FF]">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex justify-between items-center mb-8">
          <div className="relative flex items-center flex-1 mr-4">
            <Input
              type="search"
              placeholder="검색어를 입력하세요..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <Button
            onClick={() => navigate("/tech/write")}
            className="whitespace-nowrap"
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
    </div>
  );
};

export default Tech;
