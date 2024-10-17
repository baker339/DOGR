import Post from "@/components/Post";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";

interface Post {
  _id: string;
  imageUrl: string;
  caption: string;
  location: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

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
      <main className="pt-5 px-4 md:px-8 lg:px-16 flex flex-col items-center">
        {/* Recent Posts */}
        <section className="w-full max-w-4xl">
          <Virtuoso
            style={{ height: "calc(100vh - 200px)" }} // Adjust height based on your layout
            totalCount={posts.length}
            itemContent={(index) => {
              const post = posts[index];
              return <Post key={post._id} post={post} />;
            }}
          />
        </section>
      </main>
    </div>
  );
}
