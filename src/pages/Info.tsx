
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAxiosWithAuth } from "@/hooks/useAxiosWithAuth";
import Navbar from "@/components/Navbar";
import { UserCircle, Mail, Phone, BookOpen, Calendar, Edit2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Feed {
  id: string;
  title: string;
  uploadAt: string;
  author: string;
  thumbnail: string | null;
}

interface UserInfo {
  username: string;
  name: string;
  email: string;
  studentId: string;
  phone: string;
  bio: string;
  feeds: Feed[];
  joinDate?: string;
}

const Info = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const axiosWithAuth = useAxiosWithAuth();
  const queryClient = useQueryClient();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");

  // Fetch user info
  const { data: userInfo, isLoading, isError } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      try {
        const response = await axiosWithAuth.get("/api/info");
        const data = response.data.response;
        setNewBio(data.bio);
        return data;
      } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
      }
    }
  });

  // Update bio mutation
  const updateBioMutation = useMutation({
    mutationFn: async (bio: string) => {
      const response = await axiosWithAuth.post("/api/info/bio", { bio });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      setIsEditingBio(false);
      toast({
        title: "프로필 업데이트 성공",
        description: "자기소개가 업데이트되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "업데이트 실패",
        description: "자기소개 업데이트에 실패했습니다.",
        variant: "destructive",
      });
      console.error("Error updating bio:", error);
    },
  });

  const handleUpdateBio = () => {
    updateBioMutation.mutate(newBio);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="text-center">
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="text-center">
            <p>정보를 불러오는데 실패했습니다.</p>
            <Button
              onClick={() => navigate("/login")}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              로그인 페이지로 이동
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            <div className="md:w-1/3">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserCircle className="h-20 w-20 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-center mt-4">{userInfo?.name || ""}</CardTitle>
                  <CardDescription className="text-center text-gray-500">@{userInfo?.username || ""}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-700">{userInfo?.email || ""}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-700">{userInfo?.phone || ""}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-700">학번: {userInfo?.studentId || ""}</span>
                    </div>
                    {userInfo?.joinDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-gray-700">가입일: {userInfo.joinDate}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:w-2/3">
              <Card className="mb-6 border border-gray-200 shadow-sm">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <CardTitle>자기소개</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditingBio(!isEditingBio)}
                      className="text-blue-600"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      {isEditingBio ? "취소" : "수정"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {isEditingBio ? (
                    <>
                      <Textarea 
                        value={newBio} 
                        onChange={(e) => setNewBio(e.target.value)}
                        className="min-h-[120px] mb-2 border-gray-300"
                        placeholder="자기소개를 작성해주세요"
                      />
                      <Button 
                        onClick={handleUpdateBio}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={updateBioMutation.isPending}
                      >
                        {updateBioMutation.isPending ? "저장 중..." : "저장"}
                      </Button>
                    </>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-line">{userInfo?.bio || ""}</p>
                  )}
                </CardContent>
              </Card>
              
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="bg-gray-100 mb-6">
                  <TabsTrigger value="posts" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">내 게시글</TabsTrigger>
                  <TabsTrigger value="activities" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">활동 내역</TabsTrigger>
                </TabsList>
                
                <TabsContent value="posts">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle>내가 작성한 게시글</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userInfo?.feeds && userInfo.feeds.length > 0 ? (
                        <div className="space-y-4">
                          {userInfo.feeds.map((feed) => (
                            <div 
                              key={feed.id} 
                              className="p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer"
                              onClick={() => navigate(`/tech/${feed.id}`)}
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{feed.title || "제목 없음"}</h3>
                                <span className="text-sm text-gray-500">
                                  {new Date(feed.uploadAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-10">
                          <p>아직 작성한 게시글이 없습니다.</p>
                          <Button
                            onClick={() => navigate("/tech/write")}
                            className="mt-4 bg-blue-600 hover:bg-blue-700"
                          >
                            첫 게시글 작성하기
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="activities">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle>최근 활동</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center text-gray-500 py-10">
                        <p>최근 활동 내역이 없습니다.</p>
                        <Button
                          onClick={() => navigate("/study")}
                          className="mt-4 bg-blue-600 hover:bg-blue-700"
                        >
                          스터디 참여하기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
