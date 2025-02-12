"use client";
import NavBar from '../../components/NavBar';

import { useEffect, useState } from "react";
import Link from "next/link";
import supabase from "../../supabaseClient";

import { useRouter } from "next/navigation";



const StoriesList = () => {
  const [stories, setStories] = useState([]);
  const router = useRouter();
  

  useEffect(() => {
    const fetchStories = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // If no session, redirect to login page
      if (!session) {
        router.push("/login");
        return; // Prevent fetching stories if not logged in
      }

      const data = await window.electron.getBooks(); // Récupère toutes les entrées
      setStories(data.filter(story => story.status === "fragment")); // Filtre en front-end

    };

    fetchStories();
  }, [router]);

  return (
    <div>
      <div className="min-h-screen bg-gray-50 p-4">
        <NavBar />
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Stories List
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {stories.map((story) => (
            <Link key={story.id} href={`/draft/${story.link}`} passHref>
              <div className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900">
                  {story.title}
                </h3>
                <p className="text-gray-700 mt-2">{story.description}</p>
                <p className="text-sm text-gray-500 mt-2">{story.type}</p>
                <p className="text-sm text-gray-500 mt-2">Nombre de lectures: {story.lecture}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoriesList;
