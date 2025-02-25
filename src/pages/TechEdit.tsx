
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAxiosWithAuth } from "@/hooks/useAxiosWithAuth";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Bold, Italic, List, ListOrdered, Image as ImageIcon } from "lucide-react";

const TechEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const axiosWithAuth = useAxiosWithAuth();
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "",
  });

  const { data: post } = useQuery({
    queryKey: ["tech-post", id],
    queryFn: async () => {
      const response = await axiosWithAuth.get(`/api/feeds/${id}`);
      return response.data;
    },
    meta: {
      onSuccess: (data: any) => {
        setTitle(data.title);
        editor?.commands.setContent(data.content);
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !editor?.getHTML()) {
      toast({
        title: "입력 오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosWithAuth.patch(`/api/feeds/${id}`, {
        title,
        content: editor.getHTML()
      });
      
      toast({
        title: "수정 완료",
        description: "글이 성공적으로 수정되었습니다."
      });
      navigate("/tech");
    } catch (error) {
      toast({
        title: "수정 실패",
        description: "글 수정 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    return (
      <div className="border border-white/20 rounded-t-lg p-2 flex gap-2 bg-white/5">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          className={cn(
            "text-white hover:bg-white/10",
            editor.isActive("bold") && "bg-white/10"
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          className={cn(
            "text-white hover:bg-white/10",
            editor.isActive("italic") && "bg-white/10"
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          className={cn(
            "text-white hover:bg-white/10",
            editor.isActive("bulletList") && "bg-white/10"
          )}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          className={cn(
            "text-white hover:bg-white/10",
            editor.isActive("orderedList") && "bg-white/10"
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
          <label htmlFor="imageUpload" className="cursor-pointer flex items-center justify-center">
            <ImageIcon className="h-4 w-4" />
          </label>
        </Button>
        <input id="imageUpload" type="file" accept="image/*" className="hidden" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white overflow-hidden">
      <Navbar />
      <div className="relative">
        <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg">
                <Input 
                  type="text" 
                  placeholder="제목을 입력하세요" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="text-2xl font-semibold border-0 rounded-t-lg rounded-b-none focus-visible:ring-0 bg-white/5 border-white/10 text-white placeholder:text-gray-400" 
                />
                
                <div className="flex items-center space-x-4 px-4 py-2 text-gray-300 bg-white/5 border-t border-white/10">
                  <span>{post?.author}</span>
                  <span>•</span>
                  <time>{new Date(post?.uploadAt).toLocaleDateString()}</time>
                </div>

                <div className="border-t border-white/10">
                  <MenuBar editor={editor} />
                  <div className="bg-white/5 rounded-b-lg">
                    <EditorContent editor={editor} className="min-h-[500px] text-white prose-invert max-w-none" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(`/tech/${id}`)} 
                  className="text-white border-white/20 hover:bg-white/10 font-semibold"
                >
                  취소
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="bg-tgwing-600 hover:bg-tgwing-700 font-semibold"
                >
                  {isSubmitting ? "저장 중..." : "저장"}
                </Button>
              </div>
            </form>
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

export default TechEdit;
