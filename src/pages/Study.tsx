import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import StudyForm from "@/components/study/StudyForm";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const [studies, setStudies] = useState(mockStudies[period] || []);

  const handleAddStudy = (newStudy: any) => {
    const studyWithId = {
      ...newStudy,
      id: crypto.randomUUID(),
    };
    
    setStudies([...studies, studyWithId]);
    toast({
      title: "스터디 생성 완료",
      description: "새로운 스터디가 생성되었습니다.",
    });
  };

  const handleDeleteStudy = (studyId: string) => {
    if (window.confirm("정말로 이 스터디를 삭제하시겠습니까?")) {
      setStudies(studies.filter(study => study.id !== studyId));
      toast({
        title: "스터디 삭제 완료",
        description: "스터디가 삭제되었습니다.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white overflow-hidden">
      <Navbar />
      <div className="relative">
        <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-4">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="년도" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024년</SelectItem>
                  <SelectItem value="2023">2023년</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="학기" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1학기</SelectItem>
                  <SelectItem value="2">2학기</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <StudyForm onSubmit={handleAddStudy} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studies.map((study) => (
              <Card 
                key={study.id}
                className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur-md relative group"
                onClick={() => navigate(`/study/${study.id}`)}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteStudy(study.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white">{study.title}</h3>
                  <p className="text-gray-300 mt-2">{study.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-400">스터디장: {study.leader}</p>
                    <p className="text-sm text-gray-400">참여 인원: {study.members}명</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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

export default Study;
