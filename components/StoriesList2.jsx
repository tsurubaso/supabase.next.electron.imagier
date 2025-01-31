'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import supabase from '../supabaseClient';
import { useRouter } from 'next/navigation';

const StoriesList2 = () => {
  const [stories, setStories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchStories = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // If no session, redirect to login page
      if (!session) {
        router.push("/login");
        return; // Prevent fetching stories if not logged in
      }

      const { data, error } = await supabase
        .from('stories') // Ensure you have a 'stories' table
        .select('*');

      if (error) {
        console.error(error);
      } else {
        setStories(data);
      }
    };

    fetchStories();
  }, [router]);

  return (
    <div>
      <h3 className="text-xl font-semibold">Stories</h3>
      <ul>
        {stories.map((story) => (
          <li key={story.id}>
            <Link href={`/stories/${story.id}`} className="text-black">
              {story.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoriesList2;
