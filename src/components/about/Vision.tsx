
import { Card } from "@/components/ui/card";
import { Target, Users, MessageSquare } from "lucide-react";

const Vision = () => {
  return (
    <section className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">우리의 비전</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center p-6 bg-white/10 backdrop-blur-md">
          <Target className="w-12 h-12 mx-auto mb-4 text-tgwing-600" />
          <h3 className="font-semibold mb-2 text-white">혁신적인 프로젝트</h3>
          <p className="text-gray-300">최신 기술을 활용한 창의적인 프로젝트 개발</p>
        </Card>
        <Card className="text-center p-6 bg-white/10 backdrop-blur-md">
          <Users className="w-12 h-12 mx-auto mb-4 text-tgwing-600" />
          <h3 className="font-semibold mb-2 text-white">팀워크 & 성장</h3>
          <p className="text-gray-300">함께 배우고 성장하는 협력적 환경 조성</p>
        </Card>
        <Card className="text-center p-6 bg-white/10 backdrop-blur-md">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-tgwing-600" />
          <h3 className="font-semibold mb-2 text-white">지식 공유</h3>
          <p className="text-gray-300">스터디와 세미나를 통한 기술 교류</p>
        </Card>
      </div>
    </section>
  );
};

export default Vision;
