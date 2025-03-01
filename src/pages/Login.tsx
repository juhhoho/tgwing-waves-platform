
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import axios from "axios";

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
    
      if (!accessToken) {
        throw new Error("Access Token이 응답 헤더에 없음");
      }
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
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="relative">
        <main className="container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-md mx-auto bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="아이디"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-gray-300 rounded-md text-gray-800 placeholder:text-gray-400"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-gray-300 rounded-md text-gray-800 placeholder:text-gray-400"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 rounded-md">
                로그인
              </Button>
              <div className="text-center">
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => navigate("/register")}
                >
                  회원가입
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
