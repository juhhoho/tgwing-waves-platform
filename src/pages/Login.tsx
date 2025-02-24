
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
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      }, {
        withCredentials: true // 쿠키를 위해 필요
      });
      
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      
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
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#1E90FF]">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              로그인
            </Button>
            <div className="text-center">
              <Button
                variant="link"
                className="text-gray-600"
                onClick={() => navigate("/register")}
              >
                회원가입
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
