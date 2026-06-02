"use client";

import { useEffect, useRef, useState } from "react";

const TypeWriterPara = () => {
  const text =
    "स्वास्थ्य र गुणस्तरको पहिलो रोजाइ Western Poultry Breeding Farm Pvt. Ltd.";

  const ref = useRef(null);
  const [displayedText, setDisplayedText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let i = 0;

    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;

      if (i === text.length) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [hasStarted]);

  return (
    <p ref={ref} style={{ minHeight: "40px" }} className="cursor">
      {displayedText}
    </p>
  );
};

export default TypeWriterPara;