
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Study {
  id: string;
  title: string;
  description: string;
  members: number;
  leader: string;
}

const mockStudies: Record<string, Study[]> = {
  "2024-1": [
    {
      id: "1",
      title: "알고리즘 스터디",
      description: "코딩테스트 준비를 위한 알고리즘 스터디입니다.",
      members: 6,
      leader: "김철수"
    },
    {
      id: "2",
      title: "웹 개발 스터디",
      description: "React와 TypeScript를 활용한 웹 개발 스터디입니다.",
      members: 8,
      leader: "이영희"
    }
  ],
  "2023-2": [
    {
      id: "3",
      title: "CS 스터디",
      description: "기술 면접 준비를 위한 CS 스터디입니다.",
      members: 5,
      leader: "박지민"
    }
  ]
};

const Study = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedSemester, setSelectedSemester] = useState("1");
  const period = `${selectedYear}-${selectedSemester}`;

  const { data: studies = [] } = useQuery({
    queryKey: ["studies", period],
    queryFn: async () => mockStudies[period] || []
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#1E90FF]">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex gap-4 mb-8">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="년도" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024년</SelectItem>
              <SelectItem value="2023">2023년</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="학기" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1학기</SelectItem>
              <SelectItem value="2">2학기</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studies.map((study) => (
            <Card 
              key={study.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/study/${study.id}`)}
            >
              <CardHeader>
                <CardTitle>{study.title}</CardTitle>
                <CardDescription>스터디장: {study.leader}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{study.description}</p>
                <p className="mt-2 text-sm text-gray-500">참여 인원: {study.members}명</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Study;
