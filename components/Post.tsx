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

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(`/api/users/${post.userId}`); // Fetch the user by userId
        const userData = await response.json();
        setPosterName(userData.name); // Set the poster's name
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserName();
  }, [post.userId]);

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
      console.log({ updatedPost });
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
      setNewComment(""); // Clear the input
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
        onDelete(post._id); // Notify parent component to remove the post from the list
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post", error);
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
        {/* Display the poster's name */}
        {posterName && (
          <p className="text-neutral text-sm mb-2">Posted by: {posterName}</p>
        )}

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
        {/* Delete Button */}
        {post.userId === user.uid && (
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white p-2 mt-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Delete Post
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
