
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useAxiosWithAuth } from "@/hooks/useAxiosWithAuth";
import { FileText, Upload, X, PlusCircle, Users  } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface StudyDetail {
  id: number;
  title: string;
  description: string;
  capacity: number;
  currentParticipants: number;
  location: string;
  organizer: string;
  joinYear: number;
  joinSemester: number;
  status: "RECRUITING" | "IN_PROGRESS" | "COMPLETED";
  studyParticipants: {
    username: string;
  }[];
  document?: string;
  schedule?: string;
}

interface StudyResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  response: StudyDetail;
}

const StudyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const axiosWithAuth = useAxiosWithAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    capacity: 4,
    location: "",
    status: "RECRUITING" as "RECRUITING" | "IN_PROGRESS" | "COMPLETED",
    document: "",
    schedule: "",
    studyParticipants: []
  });
  const [fileName, setFileName] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");

  // Fetch study details
  const { data: studyData, isLoading } = useQuery({
    queryKey: ["study", id],
    queryFn: async () => {
      const response = await axiosWithAuth.get<StudyResponse>(`/api/studies/${id}`);
      return response.data.response;
    }
  });

  // Set form data when study data is loaded
  useEffect(() => {
    if (studyData) {
      setFormData({
        title: studyData.title,
        description: studyData.description,
        capacity: studyData.capacity,
        location: studyData.location,
        status: studyData.status,
        document: studyData.document || "",
        schedule: studyData.schedule || "", 
        studyParticipants: studyData.studyParticipants
      });
      
      if (studyData.document) {
        const parts = studyData.document.split('/');
        const fileNameWithId = parts[parts.length - 1];
        const fileNameParts = fileNameWithId.split('-');
        setFileName(fileNameParts.slice(1).join('-'));
      }

      // Set participants from study data
      if (studyData.studyParticipants && studyData.studyParticipants.length > 0) {
        setParticipants(studyData.studyParticipants.map(p => p.username));
      }
    }
  }, [studyData]);

  // Update study mutation
  const updateStudyMutation = useMutation({
    mutationFn: async (data: any) => {
      return await axiosWithAuth.patch(`/api/studies/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "수정 완료",
        description: "스터디 정보가 성공적으로 수정되었습니다."
      });
      navigate(`/study/${id}`);
    },
    onError: () => {
      toast({
        title: "수정 실패",
        description: "스터디 정보 수정에 실패했습니다.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    try {
      setIsUploading(true);
      const fileName = `${uuidv4()}-${file.name}`;
      setFileName(file.name);
      
      const response = await axiosWithAuth.get("/api/image/presignedUrl/upload", {
        params: { imageName: fileName },
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
        }
      });
      
      const fileUrl = `https://demo-bucket-605134439665.s3.ap-northeast-2.amazonaws.com/${fileName}`;
      setFormData({...formData, document: fileUrl});
    
      await axiosWithAuth.post("/api/images/presignedUrl/upload", {
        fileName,
        withCredentials: true,
        headers: {
          "Content-Type": file.type
        }
      });

      toast({
        title: "업로드 성공",
        description: "스터디 계획서가 성공적으로 업로드되었습니다."
      });

    
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      toast({
        title: "업로드 실패",
        description: "파일 업로드 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddParticipant = () => {
    if (!newParticipant.trim()) {
      toast({
        title: "입력 오류",
        description: "참가자 이름을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    if (participants.includes(newParticipant.trim())) {
      toast({
        title: "중복 오류",
        description: "이미 추가된 참가자입니다.",
        variant: "destructive"
      });
      return;
    }
    
    setParticipants([...participants, newParticipant.trim()]);
    setNewParticipant("");
  };

  const handleRemoveParticipant = (username: string) => {
    setParticipants(participants.filter(p => p !== username));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast({
        title: "입력 오류",
        description: "제목과 설명은 필수 입력 항목입니다.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const updateData = {
      title: formData.title,
      description: formData.description,
      capacity: formData.capacity,
      currentParticipants: studyData?.currentParticipants || 1,
      location: formData.location,
      organizer: studyData?.organizer || localStorage.getItem('username'),
      joinYear: studyData?.joinYear || new Date().getFullYear(),
      joinSemester: studyData?.joinSemester || 1,
      status: formData.status,
      participants: participants, // Use the participants state array here
      document: formData.document,
      schedule: formData.schedule
    };
    
    updateStudyMutation.mutate(updateData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">스터디 정보 수정</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">스터디 제목</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="스터디 제목을 입력하세요"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">스터디 설명</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="스터디에 대한 설명을 입력하세요"
                    rows={5}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">장소</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="예: 2층 동방, 온라인 등"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">스터디 일정</label>
                    <Input
                      value={formData.schedule}
                      onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                      placeholder="예: 매주 화요일 19:00 - 21:00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">최대 인원</label>
                    <Input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                      min={2}
                      max={20}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">스터디 상태</label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: "RECRUITING" | "IN_PROGRESS" | "COMPLETED") => 
                      setFormData({...formData, status: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RECRUITING">모집중</SelectItem>
                      <SelectItem value="IN_PROGRESS">진행중</SelectItem>
                      <SelectItem value="COMPLETED">완료됨</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">스터디 계획서</label>
                  <div 
                    className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    {formData.document ? (
                      <div className="text-center">
                        <FileText className="mx-auto h-12 w-12 text-blue-600 mb-2" />
                        <p className="text-sm font-medium text-gray-900">{fileName}</p>
                        <p className="text-xs text-gray-500 mt-1">파일이 업로드되었습니다</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-900">스터디 계획서 업로드</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, Word, Text 파일 (최대 10MB)</p>
                      </div>
                    )}
                    {isUploading && (
                      <div className="mt-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">스터디 참가자</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="참가자 아이디를 입력하세요"
                      value={newParticipant}
                      onChange={(e) => setNewParticipant(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddParticipant}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-4 w-4" /> 추가
                    </Button>
                  </div>
                  
                  <div className="mt-3">
                    {participants.length > 0 ? (
                      <div className="border rounded-md p-3 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-600">참가자 목록 ({participants.length}명)</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {participants.map((username, index) => (
                            <div 
                              key={index} 
                              className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-300 text-sm"
                            >
                              <span>{username}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveParticipant(username)}
                                className="text-gray-500 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-3 border rounded-md border-dashed border-gray-300 bg-gray-50">
                        <p className="text-sm text-gray-500">등록된 참가자가 없습니다</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/study/${id}`)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? "저장 중..." : "저장"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyEdit;
