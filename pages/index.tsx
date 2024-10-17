// pages/index.tsx
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log({ user });
    if (!user) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }, [user, router]);

  return null;
}
