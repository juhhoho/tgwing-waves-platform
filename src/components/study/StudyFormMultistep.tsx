
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

interface StudyFormProps {
  onSubmit: (study: any) => void;
}

const StudyFormMultistep = ({ onSubmit }: StudyFormProps) => {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    maxMembers: 4,
    schedule: '',
    curriculum: [''],
    goals: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
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
      curriculum: [''],
      goals: ['']
    });
  };

  const handleArrayInput = (
    field: 'curriculum' | 'goals',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: 'curriculum' | 'goals') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'curriculum' | 'goals', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index)
    }));
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
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">커리큘럼</label>
              {formData.curriculum.map((item, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={item}
                    onChange={(e) => handleArrayInput('curriculum', index, e.target.value)}
                    placeholder="커리큘럼 항목을 입력하세요"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem('curriculum', index)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('curriculum')}
                className="mt-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                + 커리큘럼 추가
              </Button>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">목표</label>
              {formData.goals.map((item, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={item}
                    onChange={(e) => handleArrayInput('goals', index, e.target.value)}
                    placeholder="스터디 목표를 입력하세요"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem('goals', index)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('goals')}
                className="mt-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                + 목표 추가
              </Button>
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
