
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  className,
  currentPage,
  totalPages,
  onPageChange,
  ...props
}: PaginationProps) => {
  const renderPageButtons = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            buttonVariants({ variant: currentPage === i ? "default" : "outline" }),
            "w-10 h-10",
            currentPage === i ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          )}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex justify-center gap-2", className)}
      {...props}
    >
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-10 h-10 bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
          "opacity-100",
          currentPage === 1 && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {renderPageButtons()}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-10 h-10 bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
          "opacity-100",
          currentPage === totalPages && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};

export default Pagination;
