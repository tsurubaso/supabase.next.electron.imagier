'use client'; // Make sure this is treated as a client-side component


//Not in use


import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Holder from 'holderjs';

const ClientSideMarkdown = ({ content }) => {

  return (
    <div className="markdown-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default ClientSideMarkdown;