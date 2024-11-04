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
  following: string[];
  followers: string[];
}

export default function Profile() {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState<User>({
    userId: "",
    name: "",
    following: [],
    followers: [],
  });
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [dogCount, setDogCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const auth = useAuth();

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users`);
      const data = await response.json();
      const fetchedUser = data.filter((u: any) => u.userId === userId)[0];
      setUser(fetchedUser);
      setIsFollowing(fetchedUser.followers.includes(auth.user.uid));
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
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mb-6">
        {/* Profile Picture Placeholder */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
            {/* Placeholder for user profile icon */}
            <span className="text-4xl text-gray-500">👤</span>
          </div>
          <h1 className="text-2xl font-bold mt-2">{user?.name ?? ""}</h1>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <span className="font-semibold">{posts.length}</span>
            <p className="text-gray-500">Posts</p>
          </div>
          <div>
            <span className="font-semibold">
              {user?.followers?.length ?? 0}
            </span>
            <p className="text-gray-500">Followers</p>
          </div>
          <div>
            <span className="font-semibold">
              {user?.following?.length ?? 0}
            </span>
            <p className="text-gray-500">Following</p>
          </div>
        </div>

        {/* Total Hot Dogs Consumed */}
        <p className="text-lg text-center mb-4">
          <span className="font-semibold">Total Hot Dogs Consumed:</span>{" "}
          {dogCount}
        </p>

        <button
          onClick={handleFollowToggle}
          className={`w-full py-2 mb-4 rounded ${
            isFollowing ? "bg-red-500" : "bg-blue-500"
          } text-white font-bold hover:opacity-80`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>

      {/* User Posts Section */}
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
