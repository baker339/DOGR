import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface PostProps {
  post: any;
}

const Post = ({ post }: PostProps) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post?.likes?.length ?? 0);
  const [comments, setComments] = useState(post?.comments ?? []);
  const [newComment, setNewComment] = useState("");

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
      setLikes(updatedPost.likes.length);
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
      setNewComment(""); // Clear the input
    } catch (error) {
      console.error("Error commenting on post", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
      {/* Post Image */}
      {/* <div className="w-full h-64 bg-gray-200">
        <img
          src={post.imageUrl}
          alt="Post"
          className="object-cover w-full h-full"
        />
      </div> */}

      {/* Post Content */}
      <div className="p-4">
        {/* New Title Field */}
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <p className="text-neutral text-lg mb-2">{post.caption}</p>
        <p className="text-neutral text-sm mb-2">
          Hot Dogs Consumed: {post.hotDogsConsumed}
        </p>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex items-center text-bittersweet hover:text-light-green transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
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
          <h3 className="text-lg font-semibold text-neutral mb-2">Comments</h3>

          {comments.map((comment: any, idx: number) => (
            <div
              key={idx}
              className="bg-light-green p-2 rounded-lg mb-2 text-gray-900"
            >
              <p>{comment.text}</p>
            </div>
          ))}

          {/* Comment Input */}
          <form onSubmit={handleComment} className="flex mt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow bg-gray-100 border border-gray-300 rounded-l-lg p-2 text-neutral placeholder-neutral focus:outline-none focus:border-emerald"
            />
            <button
              type="submit"
              className="bg-emerald text-white p-2 rounded-r-lg hover:bg-light-green transition-colors duration-200"
            >
              Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;
