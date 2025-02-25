
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface StudyFormProps {
  onSubmit: (study: any) => void;
}

const StudyForm = ({ onSubmit }: StudyFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [leader, setLeader] = useState('');
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !leader) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      title,
      description,
      leader,
      members: 1,
    });

    setTitle('');
    setDescription('');
    setLeader('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-tgwing-600 hover:bg-tgwing-700">
          새 스터디 개설
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1F2937] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">새로운 스터디 개설</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="스터디 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <Textarea
              placeholder="스터디 설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <Input
              placeholder="스터디장 이름"
              value={leader}
              onChange={(e) => setLeader(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="text-white border-white/20 hover:bg-white/10"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="bg-tgwing-600 hover:bg-tgwing-700"
            >
              생성
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudyForm;
