// pages/profile.tsx

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso"; // You need to install react-virtuoso
import Post from "@/components/Post";
import { Post as PostModel } from "@/models/Post";
import { useRouter } from "next/router";

export default function Profile() {
  const router = useRouter();
  const { userId } = router.query;
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [dogCount, setDogCount] = useState(0);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = (postId: string) => {
    // Filter out the deleted post from the list
    setPosts(posts.filter((post) => post._id.toString() !== postId));
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
          <Post
            key={posts[index]._id.toString()}
            post={posts[index]}
            onDelete={handleDeletePost}
          />
        )}
      />
    </div>
  );
}
