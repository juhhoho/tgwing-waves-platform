import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Edit2, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, BookOpen, Target, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface StudyDetail {
  id: string;
  title: string;
  description: string;
  schedule: string;
  maxMembers: number;
  currentMembers: number;
  leader: {
    name: string;
    avatar: string;
  };
  curriculum: string[];
  goals: string[];
  achievements: string[];
  members: Array<{
    name: string;
    avatar: string;
    role: string;
  }>;
}

const mockStudyDetail: StudyDetail = {
  id: "1",
  title: "알고리즘 스터디",
  description: "코딩테스트 준비를 위한 알고리즘 스터디입니다. 매주 백준 골드 레벨 문제를 풀고 토론합니다.",
  schedule: "매주 화요일 19:00 - 21:00",
  maxMembers: 8,
  currentMembers: 6,
  leader: {
    name: "김철수",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  },
  curriculum: [
    "그리디 알고리즘",
    "동적 프로그래밍",
    "그래프 이론",
    "이분 탐색"
  ],
  goals: [
    "코딩테스트 합격률 향상",
    "알고리즘 문제해결 능력 향상",
    "팀워크 및 코드 리뷰 능력 향상"
  ],
  achievements: [
    "2024 교내 알고리즘 대회 단체전 우승",
    "스터디원 3명 카카오 코딩테스트 합격",
    "백준 평균 골드 티어 달성"
  ],
  members: [
    {
      name: "김철수",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      role: "스터디장"
    },
    {
      name: "이영희",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      role: "멤버"
    }
  ]
};


const StudyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: study, isLoading } = useQuery({
    queryKey: ["study", id],
    queryFn: async () => mockStudyDetail
  });

  const isLeader = study?.leader.name === localStorage.getItem("username");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 스터디를 삭제하시겠습니까?")) return;
    
    try {
      // API call here
      toast({
        title: "스터디 삭제",
        description: "스터디가 성공적으로 삭제되었습니다."
      });
      navigate("/study");
    } catch (error) {
      toast({
        title: "오류",
        description: "스터디 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!study) return <div>Study not found</div>;

  return (
    <div className="min-h-screen bg-[#111827] text-white overflow-hidden">
      <Navbar />
      <div className="relative">
        <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <Card className="mb-8 bg-white/10 backdrop-blur-md relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-3xl">{study.title}</CardTitle>
                {isLeader && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/study/edit/${study.id}`)}
                      className="text-white hover:bg-white/10"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDelete}
                      className="text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">{study.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-tgwing-600" />
                  <span>{study.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-tgwing-600" />
                  <span>{study.currentMembers} / {study.maxMembers}명</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-tgwing-600" />
                  <span>주 1회 오프라인</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  스터디 목표
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {study.goals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-tgwing-600">•</span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  커리큘럼
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {study.curriculum.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-tgwing-600">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8 bg-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                주요 성과
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {study.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-tgwing-600">•</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                스터디 멤버
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {study.members.map((member) => (
                  <div key={member.name} className="flex items-center gap-4 p-4 rounded-lg border">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

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

export default StudyDetail;