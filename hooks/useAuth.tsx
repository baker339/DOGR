import { useEffect, useState, useContext, createContext } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase"; // Assuming this is where your Firebase app is initialized

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkAndCreateUser = async (userId: string, name: string) => {
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
          body: JSON.stringify({ userId, name }), // Add any additional user data as needed
        });
      }
    } catch (error) {
      console.error("Error checking/creating user:", error);
    }
  };

  const signinWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then((response) => {
        setUser(response.user);
        setLoading(false);
        return response.user;
      })
      .catch((error) => {
        setLoading(false);
        throw error;
      });
  };

  const logout = () => {
    return signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error("Failed to logout:", error);
      });
  };

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        checkAndCreateUser(user.uid, user.displayName || "Anonymous");
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signinWithGoogle,
    logout,
  };
}
