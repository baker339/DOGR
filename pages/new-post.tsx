import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import imageCompression from 'browser-image-compression';

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
  const [working, setWorking] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false); // Modal state
  const formRef = useRef<HTMLFormElement | null>(null); // Form ref for programmatic submission
  const router = useRouter();

  const funnyPostMessages = [
    "Expose Your Wiener",
    "Sharing Your Snack Stack",
    "Bringing the Bun Fun",
    "Revealing the Frankfurter",
    "Going Public with Your Wiener",
    "Being Frank with Everyone",
    "Dropping Hotdog Pic",
    "Showing Off the Goods"
  ]

  const handlePostChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    setWorking(true);
    const millisecondPromise = new Promise(resolve => setTimeout(resolve, 3000)); //Posts take at least 3 seconds so you can see the funny message
    e.preventDefault();

    if (newPost.hotDogsConsumed === 0 && !showWarningModal) {
      setShowWarningModal(true);
      return;
    }

    // Proceed with the form submission
    setShowWarningModal(false);
    let imageUrl = "";
    try {
      if (image) {
        console.log("Compressing...", image.size);
        const compressed = await imageCompression(image, {
          maxSizeMB: 0.5
        });
        console.log("Compressed to ", compressed.size);
        let base64Img = await getBase64(compressed);
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
      }

      await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.uid, ...newPost, imageUrl }),
      });
      await millisecondPromise;
      setWorking(false);
      router.push("/dashboard");
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

  const handleModalProceed = () => {
    setShowWarningModal(false);

    // Trigger form submission programmatically
    if (formRef.current) {
      formRef.current.requestSubmit();
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
      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              Post with 0 Hot Dogs Consumed?
            </h2>
            <p className="mb-6">
              Are you sure you want to post with 0 hot dogs consumed? You might
              get hungry later!
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowWarningModal(false)} // Close modal
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={handleModalProceed} // Proceed with form submission
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
        <form ref={formRef} onSubmit={handlePostSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newPost.title}
            onChange={handlePostChange}
            className="w-full p-2 border border-light-neutral rounded-lg focus:border-accentLight focus:outline-none"
            required
          />
          {/* Custom File Input Button */}
          <label className="flex items-center justify-center w-full cursor-pointer bg-highlight text-white py-2 rounded-lg hover:bg-accentLight transition">
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
            className="w-full p-2 border border-light-neutral rounded-lg focus:border-accentLight focus:outline-none"
          />
          <div>Hot Dogs Consumed</div>
          <input
            type="number"
            name="hotDogsConsumed"
            placeholder="Number of Hot Dogs Consumed"
            value={newPost.hotDogsConsumed}
            onChange={handlePostChange}
            className="w-full p-2 border border-light-neutral rounded-lg focus:border-accentLight focus:outline-none"
            required
          />
          <button disabled={working}
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-accentLight transition"
          >{
            working ? (
              <div>
              <svg aria-hidden="true" role="status" className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="black"></path>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="orange"></path>
              </svg>
              {funnyPostMessages[Math.floor(Math.random()*funnyPostMessages.length)]}
              </div>
            ) : 
            ("Post")
          }</button>
        </form>
      </section>
    </div>
  );
}
