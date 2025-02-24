
import { Card } from "@/components/ui/card";

const FAQ = () => {
  return (
    <section className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">자주 묻는 질문</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2 text-white">Q. 초보자도 가입할 수 있나요?</h3>
          <p className="text-gray-300">네! 열정만 있다면 누구나 환영합니다. 멘토링 프로그램을 통해 차근차근 배워나갈 수 있습니다.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-white">Q. 어떤 혜택이 있나요?</h3>
          <p className="text-gray-300">기술 세미나, 프로젝트 경험, 네트워킹 기회, 취업 정보 등 다양한 혜택을 제공합니다.</p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
