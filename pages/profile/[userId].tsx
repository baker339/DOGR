// pages/profile.tsx
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso"; // You need to install react-virtuoso
import Post from "@/components/Post";
import { Post as PostModel } from "@/models/Post";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

interface User {
  userId: string;
  name: string;
}

export default function Profile() {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState<User>({ userId: "", name: "" });
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [dogCount, setDogCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const auth = useAuth();

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users`);
      const data = await response.json();
      setUser(data.filter((u: any) => u.userId === userId)[0]);
      setIsFollowing(
        data
          .filter((u: any) => u.userId === userId)[0]
          .followers.includes(auth.user.uid)
      );
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      await fetchUser();
      const response = await fetch(`/api/posts?userId=${userId}`);
      const data = await response.json();
      const userData = data.filter((p: PostModel) => p.userId === userId);
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
    fetchUserPosts();
  }, []);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await fetch("/api/unfollow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetUserId: userId,
            currentUserId: auth.user.uid,
          }),
        });
      } else {
        await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetUserId: userId,
            currentUserId: auth.user.uid,
          }),
        });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p className="text-lg mb-2">Name: {user?.name ?? ""}</p>
      <p className="text-lg mb-2">Posts: {posts.length}</p>
      <p className="text-lg mb-4">Total Hot Dogs Consumed: {dogCount}</p>
      <button onClick={handleFollowToggle}>
        {isFollowing ? "Unfollow" : "Follow"}
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
