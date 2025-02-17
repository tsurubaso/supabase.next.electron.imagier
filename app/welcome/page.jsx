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
          You always have been reading wonderful stories...
          <br />
          Great Authors, Great Adventures.
          <br />
          But what good is a story without an illustration? <br />
          Think about Jules Verne without Gustave Doré.<br />
          Ok...here it is Bayard, agreed!
          <iframe
            src="https://assets.pinterest.com/ext/embed.html?id=814588651359847683"
            height="1089"
            width="600"
          ></iframe>
          Yes, you see, in your mind, and for generations, those stories had
          always been illustrated. <br />
          The art of the Editor has always been to combine text and image.{" "}
          <br />
          <br />
          No Jules without Gustave!
          <br />
          Here, content creators can create illustrated stories, and share their
          work.
          <br />
          The goal is to promote and in the future remunerate creator,
          <br />
          illustrators, graphic designers, painters, photographers, 3d
          artists... it's open bar!
          <br />
          <br />
          In the future, I will share with creators an other app made with
          Electron that will simplify the process.
          <br />
          You will have more control and autonomy.
          <br />
          Later on, I will also open this space to writers, but not yet.
          <br />
          For now, just share your work—only the link, we will not host it.
          <br />
          <br />
          I invite you to read the stories, see where illustrations can fit, and
          we will take care of the rest.
          <br />
          <br />
          Also, this is a software hosted on git, then you can clone it.
          <br />
          I will add rules later on but the first one is to respect the work of
          others.
          <br />
          This imply that in the future I will need to better organize the
          public folder.
        </p>
      </div>
    </div>
  );
}
