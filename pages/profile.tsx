// pages/profile.tsx

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso"; // You need to install react-virtuoso
import Post from "@/components/Post";
import { Post as PostModel } from "@/models/Post";

export default function Profile() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [dogCount, setDogCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/posts?userId=${user.uid}`);
      const data = await response.json();
      setPosts(data.filter((p: PostModel) => p.userId === user.uid));

      // Calculate the number of dogs consumed from the posts
      const totalDogs = data.reduce(
        (acc: number, post: PostModel) => acc + post.hotDogsConsumed,
        0
      );
      setDogCount(totalDogs);
    } catch (error) {
      console.error("Failed to fetch user posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p className="text-lg mb-2">Name: {user.displayName}</p>
      <p className="text-lg mb-2">Posts: {posts.length}</p>
      <p className="text-lg mb-4">Total Hot Dogs Consumed: {dogCount}</p>
      <button
        onClick={logout}
        className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 mb-4"
      >
        Logout
      </button>

      <h2 className="text-xl font-semibold mb-2">My Posts</h2>
      <Virtuoso
        style={{ height: "400px", width: "100%" }}
        totalCount={posts.length}
        itemContent={(index) => (
          <Post key={posts[index]._id.toString()} post={posts[index]} />
        )}
      />
    </div>
  );
}
