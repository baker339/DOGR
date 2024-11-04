import Post from "@/components/Post";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

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
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 10; // Number of posts per batch

  // Fetch posts when user is logged in
  useEffect(() => {
    if (!loading && user) {
      fetchPosts();
    }
  }, [user, loading]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `/api/posts?userId=${user.uid}&limit=${limit}&skip=${page * limit}`
      );
      const newPosts = await res.json();

      // Filter out duplicates
      setPosts((prevPosts) => {
        const postIds = new Set(prevPosts.map((post) => post._id));
        const uniqueNewPosts = newPosts.filter(
          (post: any) => !postIds.has(post._id)
        );
        return [...prevPosts, ...uniqueNewPosts];
      });

      // Update hasMore based on response length
      if (newPosts.length < limit) setHasMore(false);

      // Increment page for the next fetch
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    }
  };

  const handleDeletePost = (postId: string) => {
    // Filter out the deleted post from the list
    setPosts(posts.filter((post) => post._id !== postId));
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
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchPosts} // Function to call for more data
            hasMore={hasMore} // Check if more data is available
            loader={<h4>Loading...</h4>} // Loader while fetching
            endMessage={<p>You've reached the end!</p>} // Message when all posts are loaded
          >
            {posts.map((post) => (
              <Post key={post._id} post={post} onDelete={handleDeletePost} />
            ))}
          </InfiniteScroll>
        </section>
      </main>
    </div>
  );
}
