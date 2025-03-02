
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useAxiosWithAuth } from "@/hooks/useAxiosWithAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StudyFormProps {
  onSubmit: (study: any) => void;
}

const StudyFormMultistep = ({ onSubmit }: StudyFormProps) => {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const axiosWithAuth = useAxiosWithAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    maxMembers: 4,
    schedule: '',
    status: 'RECRUITING',
    planFile: ''
  });
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    if (step === 3 && !formData.planFile) {
      toast({
        title: "파일 필요",
        description: "스터디 계획서를 업로드해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(formData);
    setIsOpen(false);
    setStep(1);
    setFormData({
      title: '',
      description: '',
      location: '',
      maxMembers: 4,
      schedule: '',
      status: 'RECRUITING',
      planFile: ''
    });
    setFileName('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    try {
      setIsUploading(true);
      const fileId = `${uuidv4()}-${file.name}`;
      setFileName(file.name);
      
      const response = await axiosWithAuth.get("/api/image/presignedUrl/upload", {
        params: { imageName: fileId },
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      const presignedUrl = response.data.response.presignedUrl;
      
      await axiosWithAuth.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type
        }
      });
      
      const fileUrl = `https://demo-bucket-605134439665.s3.ap-northeast-2.amazonaws.com/${fileId}`;
      setFormData({...formData, planFile: fileUrl});
      
      toast({
        title: "업로드 성공",
        description: "스터디 계획서가 성공적으로 업로드되었습니다."
      });
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      toast({
        title: "업로드 실패",
        description: "파일 업로드 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">스터디 제목</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="mt-1"
                placeholder="스터디 제목을 입력하세요"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">스터디 설명</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1"
                placeholder="스터디에 대한 설명을 입력하세요"
                rows={4}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">장소</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="mt-1"
                placeholder="예: 2층 동방, 온라인 등"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">스터디 일정</label>
              <Input
                value={formData.schedule}
                onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                className="mt-1"
                placeholder="예: 매주 화요일 19:00 - 21:00"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">최대 인원</label>
              <Input
                type="number"
                value={formData.maxMembers}
                onChange={(e) => setFormData({...formData, maxMembers: parseInt(e.target.value)})}
                className="mt-1"
                min={2}
                max={20}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">스터디 상태</label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RECRUITING">모집중</SelectItem>
                  <SelectItem value="IN_PROGRESS">진행중</SelectItem>
                  <SelectItem value="COMPLETED">완료됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">스터디 계획서</label>
              <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                />
                {formData.planFile ? (
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-blue-600 mb-2" />
                    <p className="text-sm font-medium text-gray-900">{fileName}</p>
                    <p className="text-xs text-gray-500 mt-1">파일이 업로드되었습니다</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-900">스터디 계획서 업로드</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, Word, Text 파일 (최대 10MB)</p>
                  </div>
                )}
                {isUploading && (
                  <div className="mt-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          새 스터디 개설
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            새로운 스터디 개설
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <Badge
                  key={s}
                  variant={s === step ? "default" : "outline"}
                  className={s === step ? "bg-blue-600" : "bg-transparent"}
                >
                  {s}단계
                </Badge>
              ))}
            </div>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderStep()}
          <div className="flex justify-end space-x-2 pt-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                이전
              </Button>
            )}
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {step === 3 ? "완료" : "다음"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudyFormMultistep;
