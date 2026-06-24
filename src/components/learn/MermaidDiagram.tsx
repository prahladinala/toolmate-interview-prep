"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "var(--font-geist-sans)",
    });

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render(`mermaid-${Math.random().toString(36).substring(7)}`, chart);
        setSvgContent(svg);
      } catch (error) {
        console.error("Failed to render mermaid diagram", error);
        setSvgContent("<div class='p-4 text-destructive border-2 border-destructive'>Failed to render diagram</div>");
      }
    };

    if (chart) {
      renderDiagram();
    }
  }, [chart]);

  return (
    <div 
      ref={containerRef} 
      className="p-4 bg-muted/30 rounded-xl overflow-x-auto flex justify-center items-center border-2 border-border retro-shadow-sm min-h-[200px]"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
