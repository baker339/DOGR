import Post from "@/components/Post";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Post {
  _id: string;
  imageUrl: string;
  caption: string;
  location: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  const [newPost, setNewPost] = useState({
    imageUrl: "",
    caption: "",
    location: "",
  });

  const handlePostChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.uid, ...newPost }),
      });
      fetchPosts(); // Refresh posts after adding a new one
      setNewPost({ imageUrl: "", caption: "", location: "" }); // Reset form
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  // Fetch posts when user is logged in
  useEffect(() => {
    if (!loading && user) {
      fetchPosts();
    }
  }, [user, loading]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or message while auth is loading
  }

  if (!user) return null; // If the user is not logged in and not loading, prevent rendering

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Main content */}
      <main className="pt-20 px-4 md:px-8 lg:px-16 flex flex-col items-center">
        {/* New Post Form */}

        {/* Recent Posts */}
        <section className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
