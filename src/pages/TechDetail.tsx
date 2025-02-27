import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Edit2, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAxiosWithAuth } from "@/hooks/useAxiosWithAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MoreVertical, MessageSquare, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TechPost {
  id: string;
  title: string;
  content: string;
  uploadAt: string;
  author: string;
}

interface Reply {
  id: string;
  content: string;
  author: string;
  uploadAt: string;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  uploadAt: string;
  replies: Reply[];
}

const TechDetail = () => {
  const { id } = useParams();
  const feedId = Number(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const axiosWithAuth = useAxiosWithAuth();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState<{ [key: string]: string }>({});
  const [editingComment, setEditingComment] = useState<{ id: string; content: string } | null>(null);
  const [showReplyInput, setShowReplyInput] = useState<{ [key: string]: boolean }>({});
  const [editingReply, setEditingReply] = useState<{ commentId: string; replyId: string; content: string } | null>(null);

  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["feedId", feedId],
    queryFn: async () => {
      const response = await axiosWithAuth.get(`/api/feeds/${feedId}`,{
        headers: {
          "Content-Type": "application/json",
        },
      });
      response.data.response.content = response.data.response.content.replace(/<p><\/p>/g, "<p>&nbsp;</p>")
      return response.data.response;
    }
  });

  const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["comments", feedId],
    queryFn: async () => {
      const response = await axiosWithAuth.get(`/api/feeds/${feedId}/comments`,{
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.response.comments;
    }
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await axiosWithAuth.post(`/api/feeds/${feedId}/comments`, { content },{
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", feedId] });
      setNewComment("");
      toast({
        title: "댓글 작성 완료",
        description: "댓글이 성공적으로 작성되었습니다."
      });
    },
    onError: () => {
      toast({
        title: "댓글 작성 실패",
        description: "댓글 작성 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const response = await axiosWithAuth.patch(`/api/feeds/${feedId}/comments/${commentId}`, { content },{
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", feedId] });
      setEditingComment(null);
      toast({
        title: "댓글 수정 완료",
        description: "댓글이 성공적으로 수정되었습니다."
      });
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await axiosWithAuth.delete(`/api/feeds/${feedId}/comments/${commentId}`,{
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", feedId] });
      toast({
        title: "댓글 삭제 완료",
        description: "댓글이 성공적으로 삭제되었습니다."
      });
    }
  });

  const createReplyMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const response = await axiosWithAuth.post(
        `/api/feeds/${feedId}/comments/${commentId}/replies`,
        { content },{
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", feedId] });
      setNewReply({});
      setShowReplyInput({});
      toast({
        title: "답글 작성 완료",
        description: "답글이 성공적으로 작성되었습니다."
      });
    }
  });

  const updateReplyMutation = useMutation({
    mutationFn: async ({ commentId, replyId, content }: { commentId: string; replyId: string; content: string }) => {
      const response = await axiosWithAuth.patch(
        `/api/feeds/${feedId}/comments/${commentId}/replies/${replyId}`,
        { content },{
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", feedId] });
      setEditingReply(null);
      toast({
        title: "답글 수정 완료",
        description: "답글이 성공적으로 수정되었습니다."
      });
    }
  });

  const deleteReplyMutation = useMutation({
    mutationFn: async ({ commentId, replyId }: { commentId: string; replyId: string }) => {
      const response = await axiosWithAuth.delete(
        `/api/feeds/${feedId}/comments/${commentId}/replies/${replyId}`,{
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", feedId] });
      toast({
        title: "답글 삭제 완료",
        description: "답글이 성공적으로 삭제되었습니다."
      });
    }
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    createCommentMutation.mutate(newComment);
  };

  const handleReplySubmit = (commentId: string) => {
    if (!newReply[commentId]?.trim()) return;
    createReplyMutation.mutate({
      commentId,
      content: newReply[commentId]
    });
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment({ id: comment.id, content: comment.content });
  };

  const handleUpdateComment = () => {
    if (!editingComment) return;
    updateCommentMutation.mutate({
      commentId: editingComment.id,
      content: editingComment.content
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
    deleteCommentMutation.mutate(commentId);
  };

  const handleEdit = () => {
    navigate(`/tech/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    setIsDeleting(true);
    try {
      await axiosWithAuth.delete(`/api/feeds/${id}`);
      toast({
        title: "게시글 삭제 완료",
        description: "게시글이 성공적으로 삭제되었습니다."
      });
      navigate("/tech");
    } catch (error) {
      toast({
        title: "게시글 삭제 실패",
        description: "게시글 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const CommentComponent = ({ comment }: { comment: Comment }) => {
    const [localEditContent, setLocalEditContent] = useState(comment.content);
    const [localReplyContent, setLocalReplyContent] = useState("");

    const isAuthor = comment.author === localStorage.getItem("username");

    return (
      <div className="mb-4">
        <div className="flex items-start gap-3 mb-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} />
            <AvatarFallback>{comment.author[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">{comment.author}</span>
                <span className="text-sm text-gray-400 ml-2">
                  {new Date(comment.uploadAt).toLocaleDateString()}
                </span>
              </div>
              {isAuthor && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditComment(comment)}>
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteComment(comment.id)}>
                      <Trash className="h-4 w-4 mr-2" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {editingComment?.id === comment.id ? (
              <div className="mt-2 flex gap-2">
                <Input
                  value={localEditContent}
                  onChange={(e) => setLocalEditContent(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button onClick={() => {
                  updateCommentMutation.mutate({
                    commentId: comment.id,
                    content: localEditContent
                  });
                }}>저장</Button>
                <Button variant="outline" onClick={() => setEditingComment(null)}>취소</Button>
              </div>
            ) : (
              <p className="mt-1 text-gray-200">{comment.content}</p>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-gray-400 hover:text-white"
              onClick={() => setShowReplyInput({ ...showReplyInput, [comment.id]: !showReplyInput[comment.id] })}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              답글
            </Button>
          </div>
        </div>

        <div className="ml-11">
          {comment.replies.map((reply) => {
            const isReplyAuthor = reply.author === localStorage.getItem("username");
            return (
              <div key={reply.id} className="flex items-start gap-3 mb-2 mt-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.author}`} />
                  <AvatarFallback>{reply.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold">{reply.author}</span>
                      <span className="text-sm text-gray-400 ml-2">
                        {new Date(reply.uploadAt).toLocaleDateString()}
                      </span>
                    </div>
                    {isReplyAuthor && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => setEditingReply({
                              commentId: comment.id,
                              replyId: reply.id,
                              content: reply.content
                            })}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              if (window.confirm("정말로 이 답글을 삭제하시겠습니까?")) {
                                deleteReplyMutation.mutate({
                                  commentId: comment.id,
                                  replyId: reply.id
                                });
                              }
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  {editingReply?.replyId === reply.id ? (
                    <div className="mt-2 flex gap-2">
                      <Input
                        value={editingReply.content}
                        onChange={(e) => setEditingReply({ ...editingReply, content: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                      <Button onClick={() => {
                        updateReplyMutation.mutate({
                          commentId: comment.id,
                          replyId: reply.id,
                          content: editingReply.content
                        });
                      }}>저장</Button>
                      <Button variant="outline" onClick={() => setEditingReply(null)}>취소</Button>
                    </div>
                  ) : (
                    <p className="mt-1 text-gray-200">{reply.content}</p>
                  )}
                </div>
              </div>
            );
          })}

          {showReplyInput[comment.id] && (
            <div className="flex gap-2 mt-2">
              <Input
                value={localReplyContent}
                onChange={(e) => setLocalReplyContent(e.target.value)}
                placeholder="답글을 입력하세요"
                className="bg-white/5 border-white/10 text-white"
              />
              <Button onClick={() => {
                createReplyMutation.mutate({
                  commentId: comment.id,
                  content: localReplyContent
                });
                setLocalReplyContent("");
              }}>답글 작성</Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const isPostAuthor = post?.author === localStorage.getItem("username");

  if (isPostLoading || isCommentsLoading) {
    return (
      <div className="min-h-screen bg-[#111827] text-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-32">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827] text-white overflow-hidden">
      <Navbar />
      <div className="relative">
        <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-300">
                    <span>{post?.author}</span>
                    <span>•</span>
                    <time>{new Date(post?.uploadAt).toLocaleDateString()}</time>
                  </div>
                </div>
                {isPostAuthor && (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={handleEdit}
                      className="bg-white/10 text-white hover:bg-white/20"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div 
                className="prose prose-invert max-w-none pt-6"
                dangerouslySetInnerHTML={{ __html: post?.content }}
              />
            </div>
            
            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">댓글</h3>
              
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <Button type="submit">작성</Button>
                </div>
              </form>

              <div className="space-y-4">
                {commentsData?.map((comment: Comment) => (
                  <CommentComponent key={comment.id} comment={comment} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-64 z-0">
          <svg className="w-full h-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path 
              fill="#0284c7" 
              fillOpacity="0.1" 
              d="M0,96L48,128C96,160,192,224,288,245.3C384,267,480,245,576,234.7C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="animate-wave"
            />
            <path 
              fill="#0284c7" 
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

export default TechDetail;
