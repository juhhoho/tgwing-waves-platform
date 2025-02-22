
import { Button } from "@/components/ui/button";
import { Activity, Waves } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center space-x-2 text-tgwing-600 hover:text-tgwing-700 transition-colors">
            <Waves className="w-6 h-6" />
            <span className="text-xl font-semibold">TGWing</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/operation" className="text-gray-600 hover:text-tgwing-600 transition-colors">운영 소식</a>
            <a href="/tech" className="text-gray-600 hover:text-tgwing-600 transition-colors">기술 블로그</a>
            <a href="/study" className="text-gray-600 hover:text-tgwing-600 transition-colors flex items-center gap-1">
              <Activity className="w-4 h-4" />
              스터디
            </a>
            <a href="/about" className="text-gray-600 hover:text-tgwing-600 transition-colors">소개</a>
            <a href="/members" className="text-gray-600 hover:text-tgwing-600 transition-colors">구성원</a>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600 hover:text-tgwing-600">로그인</Button>
            <Button className="bg-tgwing-600 hover:bg-tgwing-700 text-white">회원가입</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
