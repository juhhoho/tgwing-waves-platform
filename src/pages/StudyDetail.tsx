
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { useAxiosWithAuth } from "@/hooks/useAxiosWithAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Users, Clock, BookOpen, CheckCircle, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Assuming these interfaces are defined in your actual code
interface StudyDetail {
  id: string;
  title: string;
  description: string;
  capacity: number;
  currentParticipants: number;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  status: "RECRUITING" | "IN_PROGRESS" | "COMPLETED";
  topics: string[];
  participants: Participant[];
}

interface Participant {
  username: string;
  name: string;
  role: "ORGANIZER" | "PARTICIPANT";
}

const StudyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const axiosWithAuth = useAxiosWithAuth();
  const queryClient = useQueryClient();
  const currentUsername = localStorage.getItem('username');

  const { data: study, isLoading } = useQuery({
    queryKey: ["study", id],
    queryFn: async () => {
      const response = await axiosWithAuth.get(`/api/studies/${id}`);
      return response.data.response;
    }
  });

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
        return <Badge className="bg-green-500 hover:bg-green-600">모집중</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500 hover:bg-blue-600">진행중</Badge>;
      case "COMPLETED":
        return <Badge className="bg-gray-500 hover:bg-gray-600">완료됨</Badge>;
      default:
        return null;
    }
  };

  const isParticipant = study?.participants?.some(
    (p: Participant) => p.username === currentUsername
  );
  
  const isOrganizer = study?.organizer === currentUsername;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 pt-32">
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
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">{study?.title}</CardTitle>
                  <CardDescription className="text-gray-500 mt-1">
                    개설자: {study?.organizer}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(study?.status)}
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
              <div className="flex flex-wrap gap-2 mb-4">
                {study?.topics?.map((topic, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {topic}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    {study?.startDate && format(new Date(study.startDate), 'yyyy.MM.dd')} - 
                    {study?.endDate && format(new Date(study.endDate), 'yyyy.MM.dd')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    {study?.currentParticipants}/{study?.capacity} 명
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    주 2회, 2시간씩
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    {study?.location || "온라인"}
                  </span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">스터디 소개</h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {study?.description}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end pt-4">
              {!isParticipant && study?.status === "RECRUITING" && (
                <Button 
                  onClick={handleJoinStudy}
                  className="bg-blue-600 hover:bg-blue-700"
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
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">참여자 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {study?.participants?.map((participant: Participant) => (
                  <div key={participant.username} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.username}`}
                        alt={participant.name}
                      />
                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{participant.name}</p>
                      <p className="text-sm text-gray-500">@{participant.username}</p>
                    </div>
                    {participant.role === "ORGANIZER" && (
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
