
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Edit2, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAxiosWithAuth } from "@/hooks/useAxiosWithAuth";

interface TechPost {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  uploadAt: string;
  author: string;
  authorId: string;
}

const TechDetail = () => {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const axiosWithAuth = useAxiosWithAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ["tech-post", id],
    queryFn: async () => {
      const response = await axiosWithAuth.get(`http://localhost:8080/api/feed/${id}`);
      return response.data;
    }
  });

  const handleEdit = () => {
    navigate(`/tech/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    
    setIsDeleting(true);
    try {
      await axiosWithAuth.delete(`/api/feed/${id}`);
      toast({
        title: "삭제 완료",
        description: "게시글이 성공적으로 삭제되었습니다.",
      });
      navigate("/tech");
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "게시글 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const isAuthor = post?.authorId === localStorage.getItem("userId");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111827] text-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-32">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827] text-white overflow-hidden">
      <Navbar />
      <div className="relative">
        <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold">{post?.title}</h1>
              {isAuthor && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleEdit}
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mb-6 text-gray-300">
              <span>{post?.author}</span>
              <span>•</span>
              <time>{new Date(post?.uploadAt).toLocaleDateString()}</time>
            </div>

            {post?.thumbnail && (
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />
          </div>
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

export default TechDetail;