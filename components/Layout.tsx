// Layout.tsx

import React, { ReactNode } from "react";
import { useRouter } from "next/router"; // Importing useRouter from Next.js
import { FaHome, FaPlusCircle, FaUser, FaMedal } from "react-icons/fa"; // Importing icons from react-icons
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
        <div className="flex justify-between items-center">
          {/* Empty First Column */}
          <div className="w-1/3"></div>

          {/* Centered DOGR */}
          <div
            className="w-1/3 text-center font-bold text-2xl cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            DOGR
          </div>

          {/* Right-Aligned Profile Icon */}
          <div className="w-1/3 flex justify-end items-center">
            <div
              className="cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <FaUser className="w-6 h-6" />
            </div>
          </div>
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
              onClick={() => router.push("/leaderboard")}
            >
              <FaMedal className="w-6 h-6" />
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
