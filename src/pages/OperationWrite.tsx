
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAxiosWithAuth } from "@/hooks/useAxiosWithAuth";
import Navbar from "@/components/Navbar";

const OperationWrite = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const axiosWithAuth = useAxiosWithAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await axiosWithAuth.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      return response.data.url;
    } catch (error) {
      toast({
        title: "이미지 업로드 실패",
        description: "이미지 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      return null;
    }
  }, [axiosWithAuth, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: "입력 오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosWithAuth.post("/api/operation-posts", {
        title,
        content,
      });
      toast({
        title: "성공",
        description: "글이 성공적으로 작성되었습니다.",
      });
      navigate("/operation");
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "글 작성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">게시글 작성</h1>
          
          <div>
            <Input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold border-gray-300"
            />
          </div>
          
          <div data-color-mode="light" className="space-y-2">
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || "")}
              height={500}
              preview="edit"
              onDrop={async (e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files);
                const imageFiles = files.filter(file => file.type.startsWith('image/'));
                
                for (const file of imageFiles) {
                  const url = await handleImageUpload(file);
                  if (url) {
                    const imageMarkdown = `![${file.name}](${url})\n`;
                    setContent(prev => prev + imageMarkdown);
                  }
                }
              }}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/operation")}
              className="border-gray-300 text-gray-700"
            >
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OperationWrite;
