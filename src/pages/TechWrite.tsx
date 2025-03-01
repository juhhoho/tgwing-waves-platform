import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { v4 as uuidv4 } from "uuid";

const TechWrite = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const axiosWithAuth = useAxiosWithAuth();
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "",
    editorProps: { attributes: { class: 'prose mx-auto focus:outline-none min-h-[300px] p-4' } },
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
      let finalThumbnail = thumbnail;
      if(thumbnail.length == 0){
        finalThumbnail = "https://demo-bucket-605134439665.s3.ap-northeast-2.amazonaws.com/liz.png";
      }

      
      await axiosWithAuth.post("/api/feed", {
        title,
        content: editor.getHTML().replace(/<p><\/p>/g, "<p>&nbsp;</p>"),
        plainText: editor.getText().replace(/\n/g, "").replace(/\s+/g, ""),
        thumbnail: finalThumbnail
      },
      { 
        headers: { 
          "Content-Type": "application/json"
        } 
      });
      
      toast({ 
        title: "성공", 
        description: "글이 성공적으로 작성되었습니다." 
      });
      navigate(`/tech`);
    } catch (error) {
      toast({ 
        title: "오류 발생", 
        description: "글 작성 중 오류가 발생했습니다.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }

  };

  const MenuBar = ({ editor }: { editor: any }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addImage = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      const imageName = `${uuidv4()}-${file.name}`;

      if (!file) return;

      try {
        let  response  = await axiosWithAuth.get("http://localhost:8080/api/image/presignedUrl/upload", {
          params: { imageName: imageName },
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        });
    
        const presignedUrl = response.data.response.presignedUrl;
    
        await axiosWithAuth.put(presignedUrl, file, {
          withCredentials: true,
          headers: { 
            "Content-Type": file.type
           },
        });
    
        const imageUrl = `https://demo-bucket-605134439665.s3.ap-northeast-2.amazonaws.com/${imageName}`;
    
        editor.chain().focus().setImage({ src: imageUrl }).run();
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
      }
    }, [editor]);

    if (!editor) return null;

    return (
      <>
        <div className="fixed top-20 left-0 right-0 z-50 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="border border-gray-200 rounded-lg p-2 flex gap-2 bg-white shadow-md">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => editor.chain().focus().toggleBold().run()} 
                className={cn(
                  "text-gray-700 hover:bg-gray-100",
                  editor.isActive("bold") && "bg-gray-100"
                )}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => editor.chain().focus().toggleItalic().run()} 
                className={cn(
                  "text-gray-700 hover:bg-gray-100",
                  editor.isActive("italic") && "bg-gray-100"
                )}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => editor.chain().focus().toggleBulletList().run()} 
                className={cn(
                  "text-gray-700 hover:bg-gray-100",
                  editor.isActive("bulletList") && "bg-gray-100"
                )}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => editor.chain().focus().toggleOrderedList().run()} 
                className={cn(
                  "text-gray-700 hover:bg-gray-100",
                  editor.isActive("orderedList") && "bg-gray-100"
                )}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
          <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-md">
            <Button asChild variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
              <label htmlFor="imageUpload" className="cursor-pointer">
                <ImageIcon className="h-6 w-6" />
                <span className="sr-only">이미지 업로드</span>
              </label>
            </Button>
          </div>
          <input
            ref={fileInputRef}
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={addImage}
            className="hidden"
          />
        </div>
      </>
    );
  };

  const handleThumbnailChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
  
    if (!file) {
      const imageUrl = `https://demo-bucket-605134439665.s3.ap-northeast-2.amazonaws.com/liz.png`;
      setThumbnail(imageUrl);
      return; // 파일이 없으면 여기서 함수 종료
    }
  
    const thumbnailImageName = `${uuidv4()}-${file.name}`;
    console.log("선택한 파일 이름:", file.name); // 파일 이름 출력
  
    try {
      const response = await axiosWithAuth.get("http://localhost:8080/api/image/presignedUrl/upload", {
        params: { imageName: thumbnailImageName },
        headers: {
          "Content-Type": "application/json",
          access: localStorage.getItem("accessToken") ?? "",
        },
      });
  
      const presignedUrl = response.data.response.presignedUrl;
  
      await axiosWithAuth.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
          access: localStorage.getItem("accessToken") ?? "",
        },
      });
  
      const imageUrl = `https://demo-bucket-605134439665.s3.ap-northeast-2.amazonaws.com/${thumbnailImageName}`;
      setThumbnail(imageUrl);
    } catch (error) {
      console.error("썸네일 업로드 실패:", error);
    }
  }, [setThumbnail]); 
  
  

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-md">
              <Input 
                type="text" 
                placeholder="제목을 입력하세요" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="text-2xl font-semibold border-0 rounded-t-lg rounded-b-none focus-visible:ring-0 border-gray-200 text-gray-900 placeholder:text-gray-400" 
              />
              <div className="border-t border-gray-200">
                <MenuBar editor={editor} />
                <div className="bg-white">
                  <EditorContent editor={editor} className="min-h-[500px] text-gray-900 prose max-w-none" />
                </div>
              </div>
              <div className="border-t border-gray-200 p-4 bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-2">썸네일</label>
                <div className="flex gap-4 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700"
                />
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt="썸네일 미리보기"
                      className="h-20 w-20 object-cover rounded"
                    />
                  )}
                </div>
                {!thumbnail && (
                  <p className="mt-2 text-sm text-gray-500">
                    이미지를 선택하지 않으면 기본 이미지가 사용됩니다.
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/tech")} 
                className="border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold"
              >
                취소
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-blue-600 hover:bg-blue-700 font-semibold"
              >
                {isSubmitting ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TechWrite;
