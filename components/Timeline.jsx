// components/Timeline.js
"use client";
import React, { useRef, useEffect } from 'react';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

const TimelineComponent = ({ items }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const dataset = new DataSet(items);
    const options = {};
    new Timeline(container, dataset, options);
  }, [items]);

  return (
    <div className="timeline-container" ref={containerRef} />
  );
};

export default TimelineComponent;
