import React, { ReactNode } from "react";
import { useRouter } from "next/router"; // Importing useRouter from Next.js
import { FaHome, FaPlusCircle, FaUser } from "react-icons/fa"; // Importing icons from react-icons
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/login";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter(); // Initialize useRouter
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-light-green">
      {/* Top Bar */}
      <header className="fixed top-0 w-full bg-primary text-white p-4 shadow-lg z-50">
        <div
          className="text-center font-bold text-2xl cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          DOGR
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-16 pb-20">{children}</main>

      {/* Bottom Navigation Bar */}
      {user && (
        <nav className="fixed bottom-0 w-full bg-white border-t border-gray-300 text-gray-700">
          <div className="flex justify-around py-3">
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              <FaHome className="w-6 h-6" />
            </div>

            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => router.push("/new-post")}
            >
              <FaPlusCircle className="w-6 h-6" />
            </div>

            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <FaUser className="w-6 h-6" />
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
