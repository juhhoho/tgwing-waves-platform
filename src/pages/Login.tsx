
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { access } from "fs";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        username,
        password,
      }, {
        withCredentials: true // 쿠키를 위해 필요
      });

      const accessToken = response.headers["access"];
      console.log(accessToken);
      console.log(response.data.response.username);
    
      if (!accessToken) {
        throw new Error("Access Token이 응답 헤더에 없음");
      }
      console.log(accessToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('username', response.data.response.username);
      
      toast({
        title: "로그인 성공",
        description: "메인 페이지로 이동합니다.",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "로그인 실패",
        description: "아이디 또는 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white overflow-hidden">
      <Navbar />
      <div className="relative">
        <main className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="아이디"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
              <Button type="submit" className="w-full bg-tgwing-600 hover:bg-tgwing-700">
                로그인
              </Button>
              <div className="text-center">
                <Button
                  variant="link"
                  className="text-gray-300 hover:text-white"
                  onClick={() => navigate("/register")}
                >
                  회원가입
                </Button>
              </div>
            </form>
          </div>
        </main>

        {/* Decorative waves */}
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

export default Login;
