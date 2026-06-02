"use client";

import { useEffect, useRef, useState } from "react";

export default function Typewriter({
  text = "",
  as: Tag = "p",
  speed = 90,
  repeat = 3,
  cycleDelay = 5000,
  className = "hero__title",
}) {
  const ref = useRef(null);

  const [displayed, setDisplayed] = useState("");
  const [start, setStart] = useState(false);
  const [runCount, setRunCount] = useState(0);

  // 1. Observe viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  // 2. Typewriter logic with repeat + 5s cycle
  useEffect(() => {
    if (!start) return;
    if (runCount >= repeat) return;

    let i = 0;

    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;

      if (i === text.length) {
        clearInterval(interval);

        // wait 5 seconds then restart
        setTimeout(() => {
          setDisplayed("");
          setRunCount((prev) => prev + 1);
        }, cycleDelay);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [start, runCount, text, speed, repeat, cycleDelay]);

  return (
    <Tag ref={ref} className={className}>
      {displayed}
    </Tag>
  );
}

// usage 
//         <Typewriter
//   as="h1"
//   text="Welcome to Our Farm"
//   className="hero__title"
// />