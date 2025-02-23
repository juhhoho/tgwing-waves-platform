
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Phone, Mail, Instagram, Facebook, Github, Calendar, Users, Target, MessageSquare } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#1E90FF]">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* 헤더 섹션 */}
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

        {/* 비전 & 목표 섹션 */}
        <section className="bg-white rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">우리의 비전</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <Target className="w-12 h-12 mx-auto mb-4 text-tgwing-600" />
              <h3 className="font-semibold mb-2">혁신적인 프로젝트</h3>
              <p className="text-gray-600">최신 기술을 활용한 창의적인 프로젝트 개발</p>
            </Card>
            <Card className="text-center p-6">
              <Users className="w-12 h-12 mx-auto mb-4 text-tgwing-600" />
              <h3 className="font-semibold mb-2">팀워크 & 성장</h3>
              <p className="text-gray-600">함께 배우고 성장하는 협력적 환경 조성</p>
            </Card>
            <Card className="text-center p-6">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-tgwing-600" />
              <h3 className="font-semibold mb-2">지식 공유</h3>
              <p className="text-gray-600">스터디와 세미나를 통한 기술 교류</p>
            </Card>
          </div>
        </section>

        {/* 활동 내용 섹션 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">주요 활동</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-tgwing-600" />
                정기 모임
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 매주 화요일 7PM - 기술 세미나</li>
                <li>• 매주 목요일 8PM - 프로젝트 회의</li>
                <li>• 매월 마지막 주 금요일 - 네트워킹 데이</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">주요 프로젝트</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 캠퍼스 AI 챗봇 개발</li>
                <li>• 학교 커뮤니티 플랫폼 구축</li>
                <li>• 교내 프로그래밍 대회 운영</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* 활동 사진 갤러리 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">활동 갤러리</h2>
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {[1, 2, 3].map((idx) => (
                <CarouselItem key={idx}>
                  <Card>
                    <CardContent className="p-0">
                      <img
                        src={`https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800`}
                        alt={`Activity ${idx}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* FAQ 섹션 */}
        <section className="bg-white rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">자주 묻는 질문</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Q. 초보자도 가입할 수 있나요?</h3>
              <p className="text-gray-600">네! 열정만 있다면 누구나 환영합니다. 멘토링 프로그램을 통해 차근차근 배워나갈 수 있습니다.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Q. 어떤 혜택이 있나요?</h3>
              <p className="text-gray-600">기술 세미나, 프로젝트 경험, 네트워킹 기회, 취업 정보 등 다양한 혜택을 제공합니다.</p>
            </div>
          </div>
        </section>

        {/* CTA & 연락처 섹션 */}
        <section className="text-center">
          <Button className="bg-tgwing-600 hover:bg-tgwing-700 text-white text-lg px-8 py-6 rounded-full mb-8">
            지금 가입하기
          </Button>
          <div className="flex justify-center gap-4 text-white">
            <a href="mailto:contact@tgwing.com" className="hover:text-tgwing-200">
              <Mail className="w-6 h-6" />
            </a>
            <a href="tel:010-1234-5678" className="hover:text-tgwing-200">
              <Phone className="w-6 h-6" />
            </a>
            <a href="https://instagram.com/tgwing" className="hover:text-tgwing-200">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="https://facebook.com/tgwing" className="hover:text-tgwing-200">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="https://github.com/tgwing" className="hover:text-tgwing-200">
              <Github className="w-6 h-6" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
