import { useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

interface FavoriteFriendButtonProps {
  friendId: string;
  isFavoriteByDefault: boolean;
}

const FavoriteFriendButton = ({
  friendId,
  isFavoriteByDefault,
}: FavoriteFriendButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(isFavoriteByDefault);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/friends/favorite", {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      });

      if (!response.ok) {
        throw new Error("Không thể cập nhật danh sách yêu thích");
      }

      setIsFavorite((prev) => !prev);
      toast.success(isFavorite ? "Đã bỏ khỏi yêu thích" : "Đã thêm vào yêu thích");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className="rounded-md border border-amber-200 p-2 text-amber-500 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={isFavorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
      title={isFavorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
    >
      <Star className={`h-5 w-5 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
    </button>
  );
};

export default FavoriteFriendButton;
