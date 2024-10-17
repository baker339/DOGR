import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";

export default function Login() {
  const { signinWithGoogle, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard if the user is already logged in
    if (user) {
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
