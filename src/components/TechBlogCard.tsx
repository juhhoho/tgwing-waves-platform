
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface TechPost {
  id: string;
  title: string;
  thumbnail: string;
  uploadAt: string;
  author: string;
}

interface TechBlogCardProps {
  post: TechPost;
}

const TechBlogCard = ({ post }: TechBlogCardProps) => {
  const navigate = useNavigate();
  
  // Format date to display in a more readable format
  const formattedDate = new Date(post.uploadAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return (
    <Card 
      className="flex p-4 hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200 rounded-lg"
      onClick={() => navigate(`/tech/${post.id}`)}
    >
      <img
        src={post.thumbnail}
        alt={post.title}
        className="w-24 h-24 object-cover rounded-md mr-6"
      />
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-semibold mb-1 text-gray-900">{post.title}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm">{post.author}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <time className="text-xs text-gray-500">
            {formattedDate}
          </time>
          <div className="flex space-x-2">
            <span className="text-xs text-gray-500">댓글 0</span>
            <span className="text-xs text-gray-500">조회 0</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TechBlogCard;
