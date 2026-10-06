import React, { useEffect } from "react";
import { animate, createMotionPath, createDrawable, morphTo } from "motion";

const Animation = () => {
  useEffect(() => {
    // Animate car along the path
    animate(".car", {
      ...createMotionPath(".circuit"),
    });

    // Draw the circuit
    animate(createDrawable(".circuit"), {
      draw: "0 1",
    });

    // Morph one path into another
    animate(".circuit-a", {
      d: morphTo(".circuit-b"),
    });
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <svg viewBox="0 0 500 500" width="500" height="500">
        <path
          className="circuit"
          d="M50,250 Q250,50 450,250 T850,250"
          stroke="black"
          fill="none"
        />
        <circle className="car" r="10" fill="red" />
        <path
          className="circuit-a"
          d="M50,250 Q250,50 450,250"
          stroke="blue"
          fill="none"
        />
        <path
          className="circuit-b"
          d="M50,250 Q250,450 450,250"
          stroke="green"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default Animation;
