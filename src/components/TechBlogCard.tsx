
import { Card } from "@/components/ui/card";

interface TechPost {
  id: string;
  title: string;
  thumbnail: string;
  uploadAt: string;
  author: string
}

interface TechBlogCardProps {
  post: TechPost;
}

const TechBlogCard = ({ post }: TechBlogCardProps) => {
  return (
    <Card className="flex p-4 hover:shadow-lg transition-shadow cursor-pointer">
      <img
        src={post.thumbnail}
        alt={post.title}
        className="w-48 h-32 object-cover rounded-md mr-6"
      />
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">{post.author}</span>
          </div>
        </div>
        <time className="text-sm text-gray-500">
          {new Date(post.uploadAt).toLocaleDateString()}
        </time>
      </div>
    </Card>
  );
};

export default TechBlogCard;
