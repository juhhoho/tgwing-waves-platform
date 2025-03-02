
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import StudyFormMultistep from "@/components/study/StudyFormMultistep";
import { Trash2, Users, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAxiosWithAuth } from "@/hooks/useAxiosWithAuth";

interface Study {
  id: string;
  title: string;
  description: string;
  capacity: number;
  currentParticipants: number;
  organizer: string;
}

interface StudyResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  response: {
    studies: Study[];
  };
}

const Study = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedSemester, setSelectedSemester] = useState("1");
  const { toast } = useToast();
  const axiosWithAuth = useAxiosWithAuth();

  // Fetch studies based on selected year and semester
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["studies", selectedYear, selectedSemester],
    queryFn: async () => {
      const response = await axiosWithAuth.get<StudyResponse>(
        `/api/studies?joinYear=${selectedYear}&joinSemester=${selectedSemester}`
      );
      return response.data.response.studies;
    }
  });

  const handleAddStudy = async (newStudy: any) => {
    try {
      const studyData = {
        title: newStudy.title,
        description: newStudy.description,
        capacity: newStudy.maxMembers || 8,
        currentParticipants: 1,
        location: newStudy.location || "온라인",
        organizer: localStorage.getItem('username') || '',
        joinYear: parseInt(selectedYear),
        joinSemester: parseInt(selectedSemester),
        status: newStudy.status || "RECRUITING",
        planFile: newStudy.planFile || ""
      };

      await axiosWithAuth.post("/api/studies", studyData);
      
      toast({
        title: "스터디 생성 완료",
        description: "새로운 스터디가 생성되었습니다.",
      });
      
      refetch();
    } catch (error) {
      console.error("Failed to create study:", error);
      toast({
        title: "스터디 생성 실패",
        description: "스터디 생성 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteStudy = async (studyId: string) => {
    if (window.confirm("정말로 이 스터디를 삭제하시겠습니까?")) {
      try {
        await axiosWithAuth.delete(`/api/studies/${studyId}`);
        
        toast({
          title: "스터디 삭제 완료",
          description: "스터디가 삭제되었습니다.",
        });
        
        refetch();
      } catch (error) {
        console.error("Failed to delete study:", error);
        toast({
          title: "스터디 삭제 실패",
          description: "스터디 삭제 중 오류가 발생했습니다.",
          variant: "destructive"
        });
      }
    }
  };

  // Refresh studies when year or semester changes
  useEffect(() => {
    refetch();
  }, [selectedYear, selectedSemester, refetch]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="relative">
        <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">스터디</h1>
            <p className="text-gray-600 mb-6">티지윙 스터디 목록을 확인하고 참여해보세요.</p>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32 border-gray-300 text-gray-700">
                    <SelectValue placeholder="년도" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025년</SelectItem>
                    <SelectItem value="2024">2024년</SelectItem>
                    <SelectItem value="2023">2023년</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-32 border-gray-300 text-gray-700">
                    <SelectValue placeholder="학기" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1학기</SelectItem>
                    <SelectItem value="2">2학기</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <StudyFormMultistep onSubmit={handleAddStudy} />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data && data.length > 0 ? (
                data.map((study) => (
                  <Card 
                    key={study.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 relative group"
                    onClick={() => navigate(`/study/${study.id}`)}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 border-red-200 hover:bg-red-100 text-red-500 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStudy(study.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{study.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{study.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{study.currentParticipants}/{study.capacity}명</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          개설자: {study.organizer}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-500">해당 학기에 개설된 스터디가 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-64 z-0 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path 
              fill="#0284c7" 
              fillOpacity="0.05" 
              d="M0,96L48,128C96,160,192,224,288,245.3C384,267,480,245,576,234.7C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
            <path 
              fill="#0284c7" 
              fillOpacity="0.1" 
              d="M0,160L48,170.7C96,181,192,203,288,213.3C384,224,480,224,576,213.3C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              style={{ animationDelay: "0.2s" }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Study;
