/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const ImageHistory = ({
  historyRef,
  history,
  setModalImage,
  handleDelete,
}) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      let revealContainers = containerRef.current.children;

      gsap.utils.toArray(revealContainers).forEach((container) => {
        let image = container.querySelector("img");
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            toggleActions: "restart none none reset",
          },
        });

        tl.set(container, { autoAlpha: 1 });
        tl.from(container, 1.5, {
          xPercent: -100,
          ease: "power2.out",
        });
        tl.from(image, 1.5, {
          xPercent: 100,
          scale: 1.3,
          delay: -1.5,
          ease: "power2.out",
        });
      });
    }
  }, [history]);

  return (
    <div
      ref={historyRef}
      className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
    >
      <h3 className="text-xl font-bold mb-3">Generated Images</h3>
      <div
        ref={containerRef}
        className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        {history.length > 0 ? (
          history.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-700 rounded-lg p-2 shadow-md hover:shadow-lg transition reveal"
            >
              {/* Image Display with Hover Buttons */}
              <div className="relative group">
                <img
                  ref={imageRef}
                  src={entry.image}
                  alt={`Generated ${entry.id}`}
                  className="w-full h-[150px] object-cover rounded-lg cursor-pointer transition duration-300 hover:opacity-90"
                  onClick={() => setModalImage(entry.image)}
                />

                {/* Hover Buttons (Appear only on Image Hover) */}
                <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/50 rounded-lg">
                  <button
                    onClick={() => setModalImage(entry.image)}
                    className="p-2 bg-white text-black rounded-md mx-2 hover:bg-gray-200 transition"
                  >
                    🔍 View
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 bg-red-500 text-white rounded-md mx-2 hover:bg-red-600 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {/* Image Info (Selectable Text) */}
              <div className="mt-2 text-xs text-gray-300 select-text">
                <p className="text-white">📝 {entry.prompt}</p>
                <p className="text-indigo-400">🎨 {entry.style}</p>
                <p className="text-gray-500">
                  ⏳{" "}
                  {new Date(entry.timestamp).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No history available.</p>
        )}
      </div>
    </div>
  );
};
