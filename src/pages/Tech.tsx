
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, PlusCircle, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/ui/pagination";
import TechBlogCard from "@/components/TechBlogCard";
import useDebounce from "@/hooks/useDebounce";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAxiosWithAuth } from "@/hooks/useAxiosWithAuth";
import { cn } from "@/lib/utils";

const HASHTAGS = ["backend", "frontend", "infra", "ai"];

const Tech = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedHashtag, setSelectedHashtag] = useState(searchParams.get("hashtag") || "");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const axiosInstance = useAxiosWithAuth();

  useEffect(() => {
    // URL 파라미터 업데이트
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedHashtag) params.set("hashtag", selectedHashtag);
    setSearchParams(params);
  }, [searchTerm, selectedHashtag, setSearchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["tech-posts", page, debouncedSearch, selectedHashtag],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page,
        size: 5,
      };
      
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedHashtag) params.hashtag = selectedHashtag;

      const response = await axiosInstance.get("/api/feeds", { params });
      const result = response.data;

      return {
        posts: result.response.feeds.map(feed => ({
          id: feed.id,
          title: feed.title,
          thumbnail: feed.thumbnail || "https://demo-bucket-605134439665.s3.ap-northeast-2.amazonaws.com/liz.png",
          uploadAt: feed.uploadAt,
          author: feed.author,
        })),
        totalPages: Math.ceil(result.response.totalElements / 5),
      };
    },
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="relative">
        <div className="container mx-auto px-4 pt-28 pb-16">
          {/* Hero Section */}
          <div className="w-full h-48 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mb-10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src="/lovable-uploads/3e204bef-a200-4c0a-855b-4311a04bc6f1.png" 
                alt="Tech Blog Banner" 
                className="w-full h-full object-cover opacity-50"
              />
            </div>
            <div className="text-center z-10">
              <h1 className="text-4xl font-bold text-white mb-2">Tech-Blog</h1>
              <p className="text-white/80">최신 기술을 나누는 공간입니다</p>
            </div>
          </div>
          
          <div className="flex gap-8">
            {/* Hashtag Sidebar */}
            <div className="w-48 space-y-2 hidden md:block">
              <div className="font-bold text-lg mb-4 text-gray-800">Categories</div>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left rounded-full text-sm",
                  !selectedHashtag && "bg-blue-50 text-blue-600 font-medium"
                )}
                onClick={() => setSelectedHashtag("")}
              >
                <Hash className="w-4 h-4 mr-2" />
                전체보기
              </Button>
              {HASHTAGS.map(hashtag => (
                <Button
                  key={hashtag}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left capitalize rounded-full text-sm",
                    selectedHashtag === hashtag && "bg-blue-50 text-blue-600 font-medium"
                  )}
                  onClick={() => setSelectedHashtag(hashtag)}
                >
                  <Hash className="w-4 h-4 mr-2" />
                  {hashtag}
                </Button>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1">
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
                  onClick={() => navigate("/tech/write")}
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
                  data?.posts.map((post) => (
                    <TechBlogCard key={post.id} post={post} />
                  ))
                )}
              </div>

              <Pagination
                className="mt-8"
                currentPage={page}
                totalPages={data?.totalPages || 1}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tech;
