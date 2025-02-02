// components/QuillEditor.js
"use client";
import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Include Quill's styles

const QuillEditor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    const quill = new Quill(editorRef.current, {
      theme: "snow",
    });

    // Add any desired custom configuration here

    return () => {
      quill.off(); // Clean up on unmount
    };
  }, []);

  return (
    <div>
      <div ref={editorRef} style={{ height: "400px" }} />
    </div>
  );
};

export default QuillEditor;
