
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HistoryItem {
  year: string;
  events: string[];
}

interface Member {
  name: string;
  role: string;
  avatar: string;
  description: string;
}

const mockHistory: HistoryItem[] = [
  {
    year: "2024",
    events: [
      "제 10회 SW 경진대회 대상 수상",
      "신입부원 30명 영입"
    ]
  },
  {
    year: "2023",
    events: [
      "동아리방 확장 이전",
      "교내 프로그래밍 대회 주최"
    ]
  },
  {
    year: "2022",
    events: [
      "TGWing 동아리 설립",
      "첫 정기총회 개최"
    ]
  }
];

const mockMembers: Member[] = [
  {
    name: "김철수",
    role: "회장",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    description: "4학년 재학중, 웹 개발 전문"
  },
  {
    name: "이영희",
    role: "부회장",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    description: "3학년 재학중, AI/ML 전문"
  }
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#1E90FF]">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 연혁 섹션 */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">동아리 연혁</h2>
            <div className="space-y-6">
              {mockHistory.map((item) => (
                <Card key={item.year}>
                  <CardHeader>
                    <CardTitle>{item.year}년</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-4 space-y-2">
                      {item.events.map((event, index) => (
                        <li key={index}>{event}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 구성원 소개 섹션 */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">구성원 소개</h2>
            <div className="space-y-6">
              {mockMembers.map((member) => (
                <Card key={member.name}>
                  <CardContent className="flex items-center space-x-4 p

-6">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-20 h-20 rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{member.name}</h3>
                      <p className="text-gray-600">{member.role}</p>
                      <p className="text-gray-500 mt-2">{member.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
