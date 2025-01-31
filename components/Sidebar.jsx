"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "../supabaseClient";

const Sidebar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`transition-all ease-in-out ${
          isSidebarOpen ? "w-64" : "w-16"
        } bg-gray-800 p-4`}
        style={{ position: "relative" }}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          {isSidebarOpen ? "Close" : "Open"}
        </button>
        <div className="space-y-4 mt-12">
          <h3 className="text-white font-semibold">Stories</h3>
          <ul>
            {/* Render your stories list here */}
            <li>
              <Link href="/stories/1" className="text-white">
                Story 1
              </Link>
            </li>
            <li>
              <Link href="/stories/2" className="text-white">
                Story 2
              </Link>
            </li>
            {/* Add more stories */}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Top Nav */}
        <nav className="bg-blue-600 p-4 text-white mb-6">
          <div className="flex justify-between">
            <div>Logo or Title</div>
            <div>Profile</div>
          </div>
        </nav>

        {/* Story Content */}
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
