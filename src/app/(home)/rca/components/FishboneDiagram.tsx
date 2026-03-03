"use client";

import React from "react";

/** 6M category and its causes for display */
export interface FishboneCategoryData {
  category: string;
  causes: string[];
}

interface FishboneDiagramProps {
  problemLabel: string;
  categories: FishboneCategoryData[];
  className?: string;
}

/**
 * Simple SVG fishbone (Ishikawa) diagram. No external deps.
 * Layout: problem on the right, spine horizontal, 3 branches above and 3 below.
 */
export function FishboneDiagram({
  problemLabel,
  categories,
  className = "",
}: FishboneDiagramProps) {
  const width = 900;
  const height = 420;
  const spineY = height / 2;
  const spineLeft = 80;
  const spineRight = width - 180;
  const problemWidth = 120;
  const problemHeight = 44;
  const branchLength = 140;
  const topCategories = categories.slice(0, 3);
  const bottomCategories = categories.slice(3, 6);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full h-full min-h-[320px] ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Spine (horizontal line to problem) */}
      <line
        x1={spineLeft}
        y1={spineY}
        x2={spineRight}
        y2={spineY}
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Problem box (head of fish) */}
      <rect
        x={spineRight}
        y={spineY - problemHeight / 2}
        width={problemWidth}
        height={problemHeight}
        rx="6"
        fill="#f1f5f9"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      <text
        x={spineRight + problemWidth / 2}
        y={spineY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm font-medium fill-gray-800"
        style={{ fontSize: "13px" }}
      >
        {problemLabel.length > 18 ? problemLabel.slice(0, 18) + "…" : problemLabel}
      </text>

      {/* Top branches (3 categories) */}
      {topCategories.map((cat, i) => {
        const startX = spineLeft + 60 + i * 220;
        const startY = spineY;
        const endX = startX - branchLength * 0.7;
        const endY = 50 + i * 45;
        return (
          <g key={cat.category}>
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <text
              x={endX - 4}
              y={endY - 8}
              textAnchor="end"
              className="text-xs font-semibold fill-gray-700"
              style={{ fontSize: "11px" }}
            >
              {cat.category}
            </text>
            {cat.causes.map((cause, j) => (
              <text
                key={j}
                x={endX - 4}
                y={endY + 8 + j * 14}
                textAnchor="end"
                className="text-xs fill-gray-600"
                style={{ fontSize: "10px" }}
              >
                {cause.length > 24 ? cause.slice(0, 24) + "…" : cause}
              </text>
            ))}
          </g>
        );
      })}

      {/* Bottom branches (3 categories) */}
      {bottomCategories.map((cat, i) => {
        const startX = spineLeft + 60 + i * 220;
        const startY = spineY;
        const endX = startX - branchLength * 0.7;
        const endY = height - 50 - i * 45;
        return (
          <g key={cat.category}>
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <text
              x={endX - 4}
              y={endY + 8}
              textAnchor="end"
              className="text-xs font-semibold fill-gray-700"
              style={{ fontSize: "11px" }}
            >
              {cat.category}
            </text>
            {cat.causes.map((cause, j) => (
              <text
                key={j}
                x={endX - 4}
                y={endY + 20 + j * 14}
                textAnchor="end"
                className="text-xs fill-gray-600"
                style={{ fontSize: "10px" }}
              >
                {cause.length > 24 ? cause.slice(0, 24) + "…" : cause}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
