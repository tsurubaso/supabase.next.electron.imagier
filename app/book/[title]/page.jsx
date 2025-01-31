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
    if (window.electron) {
      window.electron.readFile(`/books/${title}.md`)
        .then((content) => {
          setFileContent(content);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load book content.");
          setLoading(false);
        });
    }
  }, [title]);

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
