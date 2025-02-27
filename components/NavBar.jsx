"use client";
import { useRouter } from "next/navigation";
import supabase from "../supabaseClient";

const NavBar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // Redirect to login page after logout
  };



  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Navigation Links */}
        <div className="flex space-x-6">
          <button
            onClick={() => router.push("/welcome")}
            className="hover:text-gray-300"
          >
            Home
          </button>
          <button
            onClick={() => router.push("/contact")}
            className="hover:text-gray-300"
          >
            Contact
          </button>
          <button
            onClick={() => router.push("/book")}
            className="hover:text-gray-300"
          >
            Stories
          </button>
          <button
            onClick={() => router.push("/draft")}
            className="hover:text-gray-300"
          >
            Drafts
          </button>
          <button
            onClick={() => router.push("/fragment")}
            className="hover:text-gray-300"
          >
            Fragments
          </button>
          <button
            onClick={() => router.push("/timeline")}
            className="hover:text-gray-300"
          >
            Timeline
          </button>
          <button
            onClick={() => router.push("/tech")}
            className="hover:text-gray-300"
          >
            Technologie
          </button>
        </div>

        {/* Right Logout Button */}
        <div>
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
