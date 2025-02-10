// app/welcome/page.jsx

"use client";
import NavBar from "../../components/NavBar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../supabaseClient";

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    const checkSessionandsyncStoriesWithSupabase = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // If no session, redirect to login
        console.error("User not authenticated");
        router.push("/login");
      }

      const localStories = await window.electron.getBooks(); // Get all local stories
    
      for (const story of localStories) {
        const { data: existingStory, error } = await supabase
          .from("stories")
          .select("id")
          .eq("id", story.id)
          .single(); // Check if the story exists
    
        if (error && error.code !== "PGRST116") { // Ignore "not found" errors
          console.error("Error checking story:", error);
          continue;
        }
    
        const { error: upsertError } = await supabase.from("stories").upsert({
          id: story.id,
          title: story.title,
          link: story.title,
          description: story.description,
          type: story.type,
          lecture: story.lecture,
          status: story.status,
          illu_author: story.illu_author,
          text_author: story.text_author,
          
        });
    
        if (upsertError) {
          console.error("Error upserting story:", upsertError);
        } else {
          console.log(`Story ${story.id} synced successfully.`);
        }
      }
    
    
    
    
    
    };
    checkSessionandsyncStoriesWithSupabase();
  }, [router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/login");
    } else {
      console.error("Error logging out:", error.message);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <NavBar />

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Welcome to the Imagier!
        </h1>
        <p className="text-lg text-gray-700 mt-4">
          You always have been reading wonderful stories... But what good is a
          story without an illustration? Think about Jules Verne without Gustave
          Doré?
          <br />
          No Jules without Gustave!
          <br />
          Here, content creators can create illustrations for already existing
          stories and share their work. The goal is to promote and remunerate
          illustrators.
          <br />
          You get the point. Now, I invite to read the stories, see where to put
          your illustration, and share with us your illustration links.
          <br />
          we do the rest.
        </p>
      </div>
    </div>
  );
}
