
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const Activities = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-white">주요 활동</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/10 backdrop-blur-md">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5 text-tgwing-600" />
            정기 모임
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>• 매주 화요일 7PM - 기술 세미나</li>
            <li>• 매주 목요일 8PM - 프로젝트 회의</li>
            <li>• 매월 마지막 주 금요일 - 네트워킹 데이</li>
          </ul>
        </Card>
        <Card className="p-6 bg-white/10 backdrop-blur-md">
          <h3 className="text-xl font-semibold mb-4 text-white">주요 프로젝트</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• 캠퍼스 AI 챗봇 개발</li>
            <li>• 학교 커뮤니티 플랫폼 구축</li>
            <li>• 교내 프로그래밍 대회 운영</li>
          </ul>
        </Card>
      </div>
    </section>
  );
};

export default Activities;
