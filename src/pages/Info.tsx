
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

interface UserInfo {
  username: string;
  name: string;
  email: string;
  studentId: string;
  phone: string;
  bio: string;
  joinDate: string;
}

const Info = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const axiosWithAuth = useAxiosWithAuth();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    name: "",
    email: "",
    studentId: "",
    phone: "",
    bio: "",
    joinDate: "",
  });
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [posts, setPosts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Mock data - replace with actual API call when available
        const mockUserInfo = {
          username: localStorage.getItem('username') || "사용자",
          name: "홍길동",
          email: "user@example.com",
          studentId: "20200001",
          phone: "010-1234-5678",
          bio: "안녕하세요! TGWing에서 활동하는 개발자입니다. 웹 개발과 인공지능에 관심이 많습니다.",
          joinDate: "2023-03-15",
        };
        
        setUserInfo(mockUserInfo);
        setNewBio(mockUserInfo.bio);
        setIsLoading(false);
        
        // In a real application, you would fetch the user data from your API:
        // const response = await axiosWithAuth.get("/api/user/info");
        // setUserInfo(response.data);
        // setNewBio(response.data.bio);
      } catch (error) {
        toast({
          title: "정보 로드 실패",
          description: "사용자 정보를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    fetchUserInfo();
  }, []);

  const handleUpdateBio = async () => {
    try {
      // Replace with actual API call when available
      // await axiosWithAuth.put("/api/user/bio", { bio: newBio });
      
      setUserInfo({ ...userInfo, bio: newBio });
      setIsEditingBio(false);
      
      toast({
        title: "프로필 업데이트 성공",
        description: "자기소개가 업데이트되었습니다.",
      });
    } catch (error) {
      toast({
        title: "업데이트 실패",
        description: "자기소개 업데이트에 실패했습니다.",
        variant: "destructive",
      });
    }
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
                  <CardTitle className="text-center mt-4">{userInfo.name}</CardTitle>
                  <CardDescription className="text-center text-gray-500">@{userInfo.username}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-700">{userInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-700">{userInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-700">학번: {userInfo.studentId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-700">가입일: {userInfo.joinDate}</span>
                    </div>
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
                      >
                        저장
                      </Button>
                    </>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-line">{userInfo.bio}</p>
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
                      <div className="text-center text-gray-500 py-10">
                        <p>아직 작성한 게시글이 없습니다.</p>
                        <Button
                          onClick={() => navigate("/tech/write")}
                          className="mt-4 bg-blue-600 hover:bg-blue-700"
                        >
                          첫 게시글 작성하기
                        </Button>
                      </div>
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
