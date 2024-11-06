import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import Image from "next/image";

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
    <div className="flex flex-col items-center justify-center h-screen bg-primary">
      <h1 className="text-3xl font-bold mb-6 text-background">Welcome to</h1>
      <Image
        src={"/HotDogityLogo3.png"}
        alt="HotDogity Logo"
        width={300}
        height={300}
      />
      <Image
        src={"/HotDogityDogLogoTransparent.png"}
        alt="HotDogityDogLogo"
        width={300}
        height={300}
      />
      <br />
      <p className="mb-4 text-background">
        Log in to post your favorite hot dogs!
      </p>
      <button
        onClick={signinWithGoogle}
        className="bg-highlight text-white font-bold py-2 px-4 rounded hover:bg-accentLight transition-colors duration-200"
      >
        Log in with Google
      </button>
    </div>
  );
}
