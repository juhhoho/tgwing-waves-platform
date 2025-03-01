
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { CheckCircle2, Circle } from "lucide-react";

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  name: string;
  studentId: string;
  phone: string;
}

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    username: "",
    password: "",
    name: "",
    studentId: "",
    phone: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  const handleEmailVerification = async () => {
    try {
      await axios.post("http://localhost:8080/api/register/email/send", { email: formData.email });
      toast({
        title: "인증 코드 발송",
        description: "이메일로 인증 코드가 발송되었습니다.",
      });
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "이메일 인증 코드 발송에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axios.post("http://localhost:8080/api/register/email/check", {
        email: formData.email,
        verificationCode: verificationCode,
      });
      setIsEmailVerified(true);
      toast({
        title: "인증 성공",
        description: "이메일 인증이 완료되었습니다.",
      });
      setStep(2);
    } catch (error) {
      toast({
        title: "인증 실패",
        description: "잘못된 인증 코드입니다.",
        variant: "destructive",
      });
    }
  };

  const handleUsernameCheck = async () => {
    try {
      await axios.post("http://localhost:8080/api/register/check/username", {
        username: formData.username,
      });
      setIsUsernameAvailable(true);
      toast({
        title: "사용 가능",
        description: "사용 가능한 아이디입니다.",
      });
    } catch (error) {
      toast({
        title: "사용 불가",
        description: "이미 사용중인 아이디입니다.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8080/api/register/signup", formData);
      toast({
        title: "회원가입 성공",
        description: "회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: "회원가입 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`flex items-center gap-2 ${
              index === step ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {index === step ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
            <span className="text-sm">Step {index}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">이메일 인증</h2>
            <Input
              type="email"
              placeholder="이메일"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border-gray-300 text-gray-800 placeholder:text-gray-400"
            />
            <Button 
              onClick={handleEmailVerification}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              인증 코드 발송
            </Button>
            <Input
              type="text"
              placeholder="인증 코드"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="border-gray-300 text-gray-800 placeholder:text-gray-400"
            />
            <Button 
              onClick={handleVerifyCode}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              인증 확인
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">아이디 중복 확인</h2>
            <Input
              type="text"
              placeholder="아이디"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="border-gray-300 text-gray-800 placeholder:text-gray-400"
            />
            <Button 
              onClick={handleUsernameCheck}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              중복 확인
            </Button>
            {isUsernameAvailable && (
              <Button 
                onClick={() => setStep(3)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                다음
              </Button>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">개인정보 입력</h2>
            <Input
              type="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="border-gray-300 text-gray-800 placeholder:text-gray-400"
            />
            <Input
              type="text"
              placeholder="이름"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-gray-300 text-gray-800 placeholder:text-gray-400"
            />
            <Input
              type="text"
              placeholder="학번"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="border-gray-300 text-gray-800 placeholder:text-gray-400"
            />
            <Input
              type="tel"
              placeholder="전화번호"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border-gray-300 text-gray-800 placeholder:text-gray-400"
            />
            <Button 
              onClick={() => setStep(4)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              다음
            </Button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">회원가입 완료</h2>
            <div className="space-y-2 text-gray-600">
              <p>이메일: {formData.email}</p>
              <p>아이디: {formData.username}</p>
              <p>이름: {formData.name}</p>
              <p>학번: {formData.studentId}</p>
              <p>전화번호: {formData.phone}</p>
            </div>
            <Button 
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              회원가입
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <div className="relative">
        <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
              {renderStepIndicator()}
              {renderStep()}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-64 z-0">
          <svg className="w-full h-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path 
              fill="#3b82f6" 
              fillOpacity="0.1" 
              d="M0,96L48,128C96,160,192,224,288,245.3C384,267,480,245,576,234.7C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="animate-wave"
            />
            <path 
              fill="#3b82f6" 
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

export default Register;
