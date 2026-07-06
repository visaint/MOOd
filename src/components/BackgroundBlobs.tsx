"use client";

import { useMemo } from "react";

type BlobPosition = {
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
};

/* ── Generate random positions spread across the viewport ── */
function randomPositions(): BlobPosition[] {
  /* Each blob gets a different zone so they don't overlap much */
  const zones = [
    { top: [-20, 5], left: [-15, 8] }, // far top-left
    { top: [-15, 3], right: [-10, 6] }, // far top-right
    { top: [30, 48], left: [15, 38] }, // center-left
    { bottom: [3, 18], right: [2, 18] }, // bottom-right
    { bottom: [-8, 12], left: [-8, 12] }, // bottom-left
  ];

  return zones.map((zone) => {
    const pos: BlobPosition = {};
    if (zone.top !== undefined) {
      const val = zone.top[0] + Math.random() * (zone.top[1] - zone.top[0]);
      pos.top = `${val.toFixed(1)}%`;
    }
    if (zone.left !== undefined) {
      const val = zone.left[0] + Math.random() * (zone.left[1] - zone.left[0]);
      pos.left = `${val.toFixed(1)}%`;
    }
    if (zone.bottom !== undefined) {
      const val =
        zone.bottom[0] + Math.random() * (zone.bottom[1] - zone.bottom[0]);
      pos.bottom = `${val.toFixed(1)}%`;
    }
    if (zone.right !== undefined) {
      const val =
        zone.right[0] + Math.random() * (zone.right[1] - zone.right[0]);
      pos.right = `${val.toFixed(1)}%`;
    }
    return pos;
  });
}

const blobClasses = ["blob-1", "blob-2", "blob-3", "blob-4", "blob-5"];

export default function BackgroundBlobs() {
  const positions = useMemo(() => randomPositions(), []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {blobClasses.map((cls, i) => (
        <div key={cls} className={`blob ${cls}`} style={positions[i]} />
      ))}
    </div>
  );
}
