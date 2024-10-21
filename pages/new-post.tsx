import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function NewPost() {
  const { user, loading } = useAuth();
  const [newPost, setNewPost] = useState({
    title: "",
    imageUrl: "",
    caption: "",
    location: "",
    hotDogsConsumed: 0,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const handlePostChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = "";
    try {
      if (image) {
        let base64Img = await getBase64(image);
        if (typeof base64Img === "string") {
          base64Img = base64Img.replace(/^data:.+base64,/, "");
        }
        const response = await fetch("/api/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64Img }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response from API:", errorData);
          throw new Error("Failed to upload image.");
        }

        const data = await response.json();
        imageUrl = data.data.link;

        await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.uid, ...newPost, imageUrl }),
        });
        router.push("/dashboard");
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const getBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file); // Ensure to read the file here
    } else {
      setImage(null);
      setImagePreview(null);
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
          {/* Custom File Input Button */}
          <label className="flex items-center justify-center w-full cursor-pointer bg-primary text-white py-2 rounded-lg hover:bg-secondary transition">
            {!imagePreview ? "Upload Hot Dog Image" : "Choose different Image"}
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </label>
          {imagePreview && (
            <div
              className="mt-4 cursor-pointer"
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>('input[type="file"]')
                  ?.click()
              }
            >
              <img
                src={imagePreview}
                alt="Selected preview"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
          <textarea
            name="caption"
            placeholder="Caption"
            value={newPost.caption}
            onChange={handlePostChange}
            className="w-full p-2 border border-light-neutral rounded-lg focus:border-emerald focus:outline-none"
            required
          />
          <div>Hot Dogs Consumed</div>
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
