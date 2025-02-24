
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
            />
            <Button onClick={handleEmailVerification}>인증 코드 발송</Button>
            <Input
              type="text"
              placeholder="인증 코드"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button onClick={handleVerifyCode}>인증 확인</Button>
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
            />
            <Button onClick={handleUsernameCheck}>중복 확인</Button>
            {isUsernameAvailable && (
              <Button onClick={() => setStep(3)}>다음</Button>
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
            />
            <Input
              type="text"
              placeholder="이름"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              type="text"
              placeholder="학번"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            />
            <Input
              type="tel"
              placeholder="전화번호"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Button onClick={() => setStep(4)}>다음</Button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">회원가입 완료</h2>
            <div className="space-y-2">
              <p>이메일: {formData.email}</p>
              <p>아이디: {formData.username}</p>
              <p>이름: {formData.name}</p>
              <p>학번: {formData.studentId}</p>
              <p>전화번호: {formData.phone}</p>
            </div>
            <Button onClick={handleSubmit}>회원가입</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#1E90FF]">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg">
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`flex flex-col items-center ${
                  num === step ? "text-tgwing-600" : "text-gray-400"
                }`}
              >
                {num < step ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
                <span className="text-sm mt-1">단계 {num}</span>
              </div>
            ))}
          </div>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Register;
