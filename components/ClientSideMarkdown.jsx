'use client'; // Make sure this is treated as a client-side component


//Not in use



import ReactMarkdown from 'react-markdown';


const ClientSideMarkdown = ({ content }) => {

  return (
    <div className="markdown-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default ClientSideMarkdown;