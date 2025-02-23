
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Users, BookOpen, Target, Award } from "lucide-react";

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

  if (isLoading) return <div>Loading...</div>;
  if (!study) return <div>Study not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#1E90FF]">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* 스터디 기본 정보 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">{study.title}</CardTitle>
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

        {/* 스터디 목표 & 커리큘럼 */}
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

        {/* 스터디 성과 */}
        <Card className="mb-8">
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

        {/* 스터디 멤버 */}
        <Card>
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
    </div>
  );
};

export default StudyDetail;
