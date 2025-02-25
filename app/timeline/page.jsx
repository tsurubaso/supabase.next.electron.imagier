// pages/index.js
"use client";
import React, { useState, useEffect } from 'react';
import TimelineComponent from '../../components/Timeline';
import NavBar from '../../components/NavBar';
import supabase from "../../supabaseClient";






//{ id: 4, content: 'Item 4', start: '2025-04-16', end: '2025-04-19', className: 'custom-class' , group: 1, type: 'range', style: 'background-color: blue; color: white;'}


export default function HomePage() {

  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
      .from("stories") // Ensure you have a 'stories' table
        .select('id, timelineStart, timelineEnd, description'); // Fetch relevant columns

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const timelineItems = data.map((item) => ({
        id: item.id,
        content: item.description,
        start: new Date(item.timelineStart).toISOString(),
        end: item.timelineEnd ? new Date(item.timelineEnd).toISOString() : undefined,
        // Add other properties if necessary
      }));

      setItems(timelineItems);
    };

    fetchData();
  }, []);



  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <NavBar />
      <div className="max-w-8xl mx-auto"> {/* Increased max-width */}
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Timeline
        </h1>
        <div className="h-800 w-full"> {/* Apply desired height and width */}
          <TimelineComponent items={items} />
        </div>
      </div>
    </div>
  );
}
