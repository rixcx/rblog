"use client";

import { useEffect, useRef, useId } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
});

export default function Mermaid({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    let isMounted = true;
    const render = async () => {
      try {
        const { svg } = await mermaid.render(`mermaid-${id}`, code);
        if (ref.current && isMounted) {
          ref.current.innerHTML = svg;
        }
      } catch (error) {
        console.error("Mermaid rendering failed:", error);
      }
    };
    render();
    return () => {
      isMounted = false;
    };
  }, [code, id]);

  return <div ref={ref} className="mermaid-container" />;
}
