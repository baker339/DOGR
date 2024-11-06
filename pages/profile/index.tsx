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
    <div className="flex flex-col items-center p-6 bg-background min-h-screen">
      <div className="bg-primary shadow-md rounded-lg p-6 w-full max-w-lg mb-6">
        {/* Profile Picture Placeholder */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full bg-highlight flex items-center justify-center">
            {/* Placeholder for user profile icon */}
            <span className="text-4xl text-gray-500">🌭</span>
          </div>
          <h1 className="text-2xl font-bold mt-2 text-background">
            {user.displayName}
          </h1>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <span className="font-semibold text-background">
              {posts.length}
            </span>
            <p className="text-background">Posts</p>
          </div>
          <div>
            <span className="font-semibold text-background">
              {followersCount}
            </span>
            <p className="text-background">Followers</p>
          </div>
          <div>
            <span className="font-semibold text-background">
              {followingCount}
            </span>
            <p className="text-background">Following</p>
          </div>
        </div>

        {/* Total Hot Dogs Consumed */}
        <p className="text-lg mt-4 text-center text-background">
          <span className="font-semibold">Total Hot Dogs Consumed:</span>{" "}
          {dogCount}
        </p>

        <button
          onClick={logout}
          className="bg-primary text-background border-2 border-background font-bold py-2 px-4 rounded hover:bg-red-600 w-full mt-4"
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
