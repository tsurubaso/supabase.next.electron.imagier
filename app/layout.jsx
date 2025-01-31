"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../supabaseClient";
import "./globals.css";

export default function RootLayout({ children }) {
  const router = useRouter();

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Imagier</title>
        <meta name="author" content="Imagier" />
        <meta
          name="description"
          content="What good is a story without a bit of illustration?"
        />
      </head>
      <body
        className="bg-gray-100 text-gray-900 font-sans antialiased "
        style={{ minHeight: "100vh" }}
      >
        {children}
      </body>
    </html>
  );
}
