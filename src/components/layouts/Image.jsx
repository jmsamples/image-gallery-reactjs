import React, { useState } from "react";
import Spinner from "./Spinner"; // Import your spinner component here

const Image = ({ isDragging, src, alt }) => {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false); // Set loading to false once the image is loaded
  };

  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spinner /> {/* Replace Spinner with your spinner component */}
        </div>
      )}
      <picture>
        <img
          className={`object-cover w-full h-full bg-white ${
            // when the image is dragging the image will be invisible only the border will be  visible
            isDragging ? "invisible" : "visible"
          } 
            }`}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad} // Call handleLoad once the image is loaded
        />
      </picture>
    </div>
  );
};

export default Image;
