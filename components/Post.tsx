import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

interface PostProps {
  post: any;
  onDelete: (postId: string) => void;
}

const Post = ({ post, onDelete }: PostProps) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post?.likes?.length ?? 0);
  const [comments, setComments] = useState(post?.comments ?? []);
  const [newComment, setNewComment] = useState("");
  const [posterName, setPosterName] = useState<string | null>(null);
  const [commenterNames, setCommenterNames] = useState<{
    [key: string]: string;
  }>({});
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(`/api/users/${post.userId}`);
        const userData = await response.json();
        setPosterName(userData.name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserName();
  }, [post.userId]);

  // Fetch the names of the users who commented
  useEffect(() => {
    const fetchCommenterNames = async () => {
      const names = { ...commenterNames };

      await Promise.all(
        comments.map(async (comment: any) => {
          if (!names[comment.userId]) {
            try {
              const response = await fetch(`/api/users/${comment.userId}`);
              const userData = await response.json();
              names[comment.userId] = userData.name;
            } catch (error) {
              console.error("Error fetching commenter data:", error);
            }
          }
        })
      );

      setCommenterNames(names);
    };

    if (comments.length > 0) fetchCommenterNames();
  }, [comments, commenterNames]);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.uid }),
      });

      const updatedPost = await response.json();
      setLikes(updatedPost.likes?.length ?? 0);
    } catch (error) {
      console.error("Error liking post", error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/posts/${post._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.uid, text: newComment }),
      });

      const updatedPost = await response.json();
      setComments(updatedPost.comments);
      setNewComment("");
    } catch (error) {
      console.error("Error commenting on post", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(post._id);
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
      {/* Post Header */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50 shadow-sm">
        <div className="flex items-center">
          {posterName && (
            <p className="font-semibold text-lg text-gray-800">{posterName}</p>
          )}
        </div>
        {/* Three Dots Dropdown */}
        {post.userId === user.uid && (
          <div className="relative">
            <button
              onClick={() => setDropdownVisible(!dropdownVisible)}
              className="text-gray-500 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v.01M12 12v.01M12 18v.01"
                />
              </svg>
            </button>
            {dropdownVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="w-full h-64">
          <img
            src={post.imageUrl}
            alt="Post"
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-2">{post.caption}</p>
        <p className="text-gray-500 text-sm mb-2">
          Hot Dogs Consumed: {post.hotDogsConsumed}
        </p>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="text-bittersweet hover:text-light-green transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 inline-block mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
          {likes} Likes
        </button>

        {/* Comments Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Comments</h3>
          {comments.map((comment: any, idx: number) => (
            <div
              key={idx}
              className="bg-light-green p-2 rounded-lg mb-2 text-gray-900"
            >
              <p>
                <span className="font-semibold">
                  {commenterNames[comment.userId] || "Unknown"}:
                </span>{" "}
                {comment.text}
              </p>
            </div>
          ))}

          {/* Comment Input */}
          <form onSubmit={handleComment} className="flex mt-2 items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow bg-gray-100 border border-gray-300 rounded-l-lg p-2 text-neutral placeholder-neutral focus:outline-none focus:border-emerald"
            />
            <button
              type="submit"
              className="bg-emerald text-red p-2 rounded-r-lg hover:bg-light-green transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;
