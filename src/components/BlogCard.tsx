
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogCardProps {
  title: string;
  description: string;
  date: string;
  author: string;
  type: "operation" | "tech";
}

const BlogCard = ({ title, description, date, author, type }: BlogCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <CardHeader className={`
        ${type === "operation" ? "bg-tgwing-50" : "bg-tgwing-100"}
        transition-colors duration-300
      `}>
        <div className="text-sm text-tgwing-600 mb-2">{date}</div>
        <CardTitle className="text-xl font-semibold group-hover:text-tgwing-600 transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600">
          작성자: {author}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-gray-600 line-clamp-3">{description}</p>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
