// pages/new-post.tsx

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function NewPost() {
  const { user, loading } = useAuth();
  const [newPost, setNewPost] = useState({
    title: "",
    // imageUrl: "", // Commented out for now
    caption: "",
    location: "",
    hotDogsConsumed: 0, // New field for hot dogs consumed
  });
  const router = useRouter();

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
      router.push("/dashboard"); // Redirect back to dashboard after post
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  const handleGetLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // Example reverse geocoding using a public API
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
        );
        const data = await response.json();

        // Check if there are results and set the location
        if (data.results.length > 0) {
          const location = data.results[0].formatted_address;
          setNewPost((prev) => ({ ...prev, location }));
        } else {
          alert("Unable to retrieve location");
        }
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) return null;

  return (
    <div>
      <section className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newPost.title}
            onChange={handlePostChange}
            className="w-full p-2 border border-light-neutral rounded-lg focus:border-emerald focus:outline-none"
            required
          />
          {/* <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={newPost.imageUrl}
            onChange={handlePostChange}
            className="w-full p-2 border border-light-neutral rounded-lg focus:border-emerald focus:outline-none"
            required
          /> */}
          <textarea
            name="caption"
            placeholder="Caption"
            value={newPost.caption}
            onChange={handlePostChange}
            className="w-full p-2 border border-light-neutral rounded-lg focus:border-emerald focus:outline-none"
            required
          />
          {/* <button
            type="button"
            onClick={handleGetLocation}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition"
          >
            {newPost.location || "Get Current Location"}
          </button> */}
          <input
            type="number"
            name="hotDogsConsumed"
            placeholder="Number of Hot Dogs Consumed"
            value={newPost.hotDogsConsumed}
            onChange={handlePostChange}
            className="w-full p-2 border border-light-neutral rounded-lg focus:border-emerald focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition"
          >
            Post
          </button>
        </form>
      </section>
    </div>
  );
}
