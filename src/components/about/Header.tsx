
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <section className="text-center mb-16">
      <div className="flex justify-center mb-6">
        <img src="/waves.png" alt="TGWing Logo" className="w-24 h-24" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">TGWing</h1>
      <p className="text-xl text-white mb-6">"Technology Geeks With Wings"</p>
      <div className="flex justify-center gap-4 flex-wrap">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white">
          2022년 창립
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white">
          웹/앱 개발 & AI 연구
        </div>
      </div>
    </section>
  );
};

export default Header;
