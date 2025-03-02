
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { useAxiosWithAuth } from "@/hooks/useAxiosWithAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Users, MapPin, Clock, Edit2, Trash2, Download, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface StudyParticipant {
  username: string;
}

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
  studyParticipants: StudyParticipant[];
  planFile?: string;
}

interface StudyResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  response: StudyDetail;
}

const StudyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const axiosWithAuth = useAxiosWithAuth();
  const queryClient = useQueryClient();
  const currentUsername = localStorage.getItem('username');

  // Fetch study details
  const { data: studyData, isLoading } = useQuery({
    queryKey: ["study", id],
    queryFn: async () => {
      const response = await axiosWithAuth.get<StudyResponse>(`/api/studies/${id}`);
      return response.data.response;
    }
  });

  // Join study mutation
  const joinStudyMutation = useMutation({
    mutationFn: async () => {
      return await axiosWithAuth.post(`/api/studies/${id}/join`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study", id] });
      toast({
        title: "참여 완료",
        description: "스터디에 성공적으로 참여했습니다."
      });
    },
    onError: () => {
      toast({
        title: "참여 실패",
        description: "스터디 참여에 실패했습니다.",
        variant: "destructive"
      });
    }
  });

  // Leave study mutation
  const leaveStudyMutation = useMutation({
    mutationFn: async () => {
      return await axiosWithAuth.post(`/api/studies/${id}/leave`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study", id] });
      toast({
        title: "탈퇴 완료",
        description: "스터디에서 성공적으로 탈퇴했습니다."
      });
    },
    onError: () => {
      toast({
        title: "탈퇴 실패",
        description: "스터디 탈퇴에 실패했습니다.",
        variant: "destructive"
      });
    }
  });

  // Delete study mutation
  const deleteStudyMutation = useMutation({
    mutationFn: async () => {
      return await axiosWithAuth.delete(`/api/studies/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "삭제 완료",
        description: "스터디가 성공적으로 삭제되었습니다."
      });
      navigate("/study");
    },
    onError: () => {
      toast({
        title: "삭제 실패",
        description: "스터디 삭제에 실패했습니다.",
        variant: "destructive"
      });
    }
  });

  const handleJoinStudy = () => {
    joinStudyMutation.mutate();
  };

  const handleLeaveStudy = () => {
    if (window.confirm("정말로 스터디를 탈퇴하시겠습니까?")) {
      leaveStudyMutation.mutate();
    }
  };

  const handleDeleteStudy = () => {
    if (window.confirm("정말로 스터디를 삭제하시겠습니까?")) {
      deleteStudyMutation.mutate();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RECRUITING":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">모집중</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">진행중</Badge>;
      case "COMPLETED":
        return <Badge className="bg-gray-500 hover:bg-gray-600 text-white">완료됨</Badge>;
      default:
        return null;
    }
  };

  const handleDownloadPlan = () => {
    if (studyData?.planFile) {
      window.open(studyData.planFile, '_blank');
      toast({
        title: "다운로드 시작",
        description: "스터디 계획서 다운로드가 시작되었습니다."
      });
    } else {
      toast({
        title: "파일 없음",
        description: "다운로드할 스터디 계획서가 없습니다.",
        variant: "destructive"
      });
    }
  };

  const getFileNameFromUrl = (url: string) => {
    if (!url) return "스터디 계획서";
    const parts = url.split('/');
    const fileNameWithId = parts[parts.length - 1];
    const fileNameParts = fileNameWithId.split('-');
    // Remove the UUID part
    return fileNameParts.slice(1).join('-');
  };

  const isParticipant = studyData?.studyParticipants?.some(
    (p: StudyParticipant) => p.username === currentUsername
  );
  
  const isOrganizer = studyData?.organizer === currentUsername;

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
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 shadow-sm border border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800">{studyData?.title}</CardTitle>
                  <CardDescription className="text-gray-500 mt-1">
                    개설자: {studyData?.organizer}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(studyData?.status)}
                  {isOrganizer && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/study/edit/${id}`)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDeleteStudy}
                        className="border-red-300 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    {studyData?.joinYear}년 {studyData?.joinSemester}학기
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    {studyData?.currentParticipants}/{studyData?.capacity} 명
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    {studyData?.location || "온라인"}
                  </span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">스터디 소개</h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {studyData?.description}
                </div>
              </div>
              
              {studyData?.planFile && (
                <>
                  <Separator className="my-6" />
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">스터디 계획서</h4>
                          <p className="text-sm text-gray-500">{getFileNameFromUrl(studyData.planFile)}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleDownloadPlan}
                        className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Download className="h-4 w-4" />
                        다운로드
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-end pt-4">
              {!isParticipant && studyData?.status === "RECRUITING" && (
                <Button 
                  onClick={handleJoinStudy}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  참여하기
                </Button>
              )}
              {isParticipant && !isOrganizer && (
                <Button 
                  variant="outline"
                  onClick={handleLeaveStudy}
                  className="border-red-300 text-red-500 hover:bg-red-50"
                >
                  탈퇴하기
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card className="shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">참여자 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {studyData?.studyParticipants?.map((participant: StudyParticipant) => (
                  <div key={participant.username} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.username}`}
                        alt={participant.username}
                      />
                      <AvatarFallback>{participant.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{participant.username}</p>
                    </div>
                    {participant.username === studyData?.organizer && (
                      <Badge className="ml-auto bg-blue-100 text-blue-800 hover:bg-blue-200">개설자</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyDetail;
