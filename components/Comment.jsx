"use client";

import { useState, useEffect } from "react";
import supabase from "../supabaseClient";

export default function Comment() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false); // Toggle for anonymous comments
  const [session, setSession] = useState(null); // Store session state

  useEffect(() => {
    // Fetch the session when the component mounts
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError("Failed to fetch comments.");
    } else {
      setComments(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      const user = isAnonymous
        ? "Anonymous"
        : session?.user?.email || "Anonymous";

      const { error } = await supabase
        .from("comments")
        .insert([{ comment, user }]);

      if (error) throw error;

      setComment("");
      setError(null);
      fetchComments();
    } catch (error) {
      setError("Error posting comment.");
    }
  };

  // Handle deletion of a comment
  const handleDelete = async (commentId, commentUser) => {
    if (!session?.user?.email || session.user.email !== commentUser) {
      setError("You cannot delete this comment.");
      return;
    }

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user", session.user.email);

      if (error) throw error;

      fetchComments();
    } catch (error) {
      setError("Error deleting comment.");
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">Leave a Message</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your message here..."
          className="w-full p-3 rounded-md border border-gray-300"
        ></textarea>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="anonymous-toggle"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="anonymous-toggle" className="text-gray-700">
            Post anonymously
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      <div className="mt-6">
        <h4 className="text-lg font-bold">All Messages:</h4>
        {loading ? (
          <p>Loading comments...</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {comments.map((c) => (
              <li key={c.id} className="p-3 bg-white rounded-md shadow-sm">
                <p className="font-medium text-gray-700">
                  {c.user?.includes("@")
                    ? c.user.split("@")[0]
                    : c.user || "Anonymous"}
                </p>
                <p className="text-gray-500 text-sm">
                  {new Date(c.created_at).toLocaleString()}
                </p>
                <p className="text-gray-800">{c.comment}</p>

                {/* Render delete button if the comment belongs to the current user */}
                {session?.user?.email === c.user && (
                  <button
                    onClick={() => handleDelete(c.id, c.user)}
                    className="delete-btn mt-2"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
