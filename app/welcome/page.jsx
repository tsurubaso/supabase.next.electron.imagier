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
      
    
          if (error) {
            console.error("Error checking story:", error);
          } else {
            console.log("Existing story found:", existingStory);
          }
    
        const { error: upsertError } = await supabase.from("stories").upsert({
          id: story.id,
          title: story.title,
          link: story.link,
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
          You always have been reading wonderful stories...<br/>
          Great Authors, Great Stories, Great Adventures.<br/>
          But what good is a story<br/>
          without an illustration? <br/>
          Think about Jules Verne without Gustave Doré?
          <iframe src="https://assets.pinterest.com/ext/embed.html?id=793900240576877946" height="669" width="345" frameborder="0" ></iframe>
          Yes, you see, in your mind, and for generations, those stories had always been illustrated. <br/>
          and the art of the Editor, was to combine text and image. <br/>
          <br />
          No Jules without Gustave!
          <br />
          Here, content creators can create illustrations for already existing stories,<br/>
          and share their work. The goal is to promote and in the future remunerate creator.<br/>
          illustrators, graphists, painters, photographers, 3d modelists, it's open bar<br/>
          <br />
          In the future I will share with creator an other app that will ease the process made with Electron.<br/>
          but for now just share your work, just the link we will not host it.<br/>
          <br/>
          For Now, I invite to read the stories, see where to put
          your illustrations.
          <br />
          we will do the rest.
          <br />
          Also, this is a software hosted on git, then you can clone it.<br/>
          I will add rules later on.
        </p>
      </div>
    </div>
  );
}
