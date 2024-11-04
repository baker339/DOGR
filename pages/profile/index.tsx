// pages/profile.tsx

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Post from "@/components/Post";
import { Post as PostModel } from "@/models/Post";
import { useRouter } from "next/router";

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [dogCount, setDogCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${user.uid}`);
      const data = await response.json();
      setFollowersCount(data.followers ? data.followers.length : 0);
      setFollowingCount(data.following ? data.following.length : 0);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/posts?userId=${user.uid}`);
      const data = await response.json();
      const userData = data.filter((p: PostModel) => p.userId === user.uid);
      setPosts(userData);

      // Calculate the number of dogs consumed from the posts
      const totalDogs = userData.reduce(
        (acc: number, post: PostModel) =>
          parseInt(acc.toString()) + parseInt(post.hotDogsConsumed.toString()),
        0
      );
      setDogCount(totalDogs);
    } catch (error) {
      console.error("Failed to fetch user posts", error);
    }
  };

  const handleDeletePost = (postId: string) => {
    // Filter out the deleted post from the list
    setPosts(posts.filter((post) => post._id.toString() !== postId));
  };

  useEffect(() => {
    if (user) {
      fetchUserData(); // Fetch followers and following count
      fetchUserPosts(); // Fetch user posts
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mb-6">
        {/* Profile Picture Placeholder */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
            {/* Placeholder for user profile icon */}
            <span className="text-4xl text-gray-500">👤</span>
          </div>
          <h1 className="text-2xl font-bold mt-2">{user.displayName}</h1>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="font-semibold">{posts.length}</span>
            <p className="text-gray-500">Posts</p>
          </div>
          <div>
            <span className="font-semibold">{followersCount}</span>
            <p className="text-gray-500">Followers</p>
          </div>
          <div>
            <span className="font-semibold">{followingCount}</span>
            <p className="text-gray-500">Following</p>
          </div>
        </div>

        {/* Total Hot Dogs Consumed */}
        <p className="text-lg mt-4 text-center">
          <span className="font-semibold">Total Hot Dogs Consumed:</span>{" "}
          {dogCount}
        </p>

        <button
          onClick={logout}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 w-full mt-4"
        >
          Logout
        </button>
      </div>

      {/* User Posts Section */}
      <h2 className="text-xl font-semibold mb-2">My Posts</h2>
      <div style={{ width: "100%" }}>
        {posts.map((post) => {
          return (
            <Post
              key={post._id.toString()}
              post={post}
              onDelete={handleDeletePost}
            />
          );
        })}
      </div>
    </div>
  );
}
