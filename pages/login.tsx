import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";

export default function Login() {
  const { signinWithGoogle, user } = useAuth();
  const router = useRouter();

  // Function to check and create a user in the database
  const checkAndCreateUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        // User does not exist, create a new user record
        await fetch(`/api/users/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }), // Add any additional user data as needed
        });
      }
    } catch (error) {
      console.error("Error checking/creating user:", error);
    }
  };

  useEffect(() => {
    // Redirect to the dashboard if the user is already logged in
    if (user) {
      checkAndCreateUser(user.uid); // Check and create user if not exists
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <h1 className="text-3xl font-bold mb-6 text-primary">Welcome to DOGR</h1>
      <p className="mb-4 text-neutral">
        Log in to post your favorite hot dogs!
      </p>
      <button
        onClick={signinWithGoogle}
        className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-secondary transition-colors duration-200"
      >
        Log in with Google
      </button>
    </div>
  );
}
