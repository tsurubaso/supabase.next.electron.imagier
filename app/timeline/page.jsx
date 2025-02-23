// pages/index.js
"use client";
import TimelineComponent from '../../components/Timeline';
import NavBar from '../../components/NavBar';

const items = [
  { id: 1, content: 'Item 1', start: '2025-04-20' },
  { id: 2, content: 'Item 2', start: '2025-04-14' },
  { id: 3, content: 'Item 3', start: '2025-04-18' },
  { id: 4, content: 'Item 4', start: '2025-04-16', end: '2025-04-19' },
  { id: 5, content: 'Item 5', start: '2025-04-25' },
  { id: 6, content: 'Item 6', start: '2025-04-27' }
];

//{ id: 4, content: 'Item 4', start: '2025-04-16', end: '2025-04-19', className: 'custom-class' , group: 1, type: 'range', style: 'background-color: blue; color: white;'}


export default function HomePage() {
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
