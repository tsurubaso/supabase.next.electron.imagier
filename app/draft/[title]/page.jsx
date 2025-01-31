"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // Allows raw HTML processing
import NavBar from "../../../components/NavBar";

const BookPage = ({ params }) => {
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unwrap params.title using React.use()
  const title = React.use(params)?.title;

  useEffect(() => {
    const fetchFileContent = async () => {
      if (!title) return; // Skip if there's no title

      try {
        const res = await fetch(`/book/${title}.md`);
        if (!res.ok) {
          throw new Error(`Failed to fetch the book: ${title}`);
        }

        const content = await res.text();
        setFileContent(content);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFileContent();
  }, [title]); // Fetch content only when the title is available

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="p-8 text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <div className="p-8 text-center text-red-600">
          <h1>Book not found</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <NavBar />
      <div className="p-8">
        <div className="markdown-content">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{fileContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default BookPage;
