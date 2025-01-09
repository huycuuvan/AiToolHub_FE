import gsap from "gsap";
import { blackImg, blueImg, chipImg, heroImg } from "../utils";
import { useRef, useEffect } from "react";

const ImageRandom = () => {
  const imgs = useRef([]); // Start with an empty array

  useEffect(() => {
    function randomFade() {
      imgs.current.forEach((img, index) => {
        if (Math.random() < 0.5) {
          // Some images fade out
          gsap.to(img, { opacity: 0, scale: 0, transformOrigin: "50% 50%" });
        } else {
          // Some images fade in
          gsap.to(img, {
            ease: "sine.inOut",
            opacity: 1,
            scale: 1,
            transformOrigin: "50% 50%",
          });
        }
      });
      gsap.delayedCall(1.8, randomFade); // Adjusted delay timing
    }

    randomFade(); // Start the animation

    return () => {
      gsap.globalTimeline.clear(); // Clean up the timeline on unmount
    };
  }, []); // Empty dependency array to run once on mount

  const handleClick = () => {
    gsap.globalTimeline.paused(!gsap.globalTimeline.paused());
  };

  return (
    <div className="flex flex-row gap-5 justify-around">
      <img
        ref={(el) => (imgs.current[0] = el)} // Assigning each image to imgs.current
        src={chipImg}
        alt=""
        width={50}
        height={50}
        className="object-contain"
      />
      <img
        ref={(el) => (imgs.current[1] = el)}
        src={heroImg}
        alt=""
        width={50}
        height={50}
        className="object-contain"
      />
      <img
        ref={(el) => (imgs.current[2] = el)}
        src={blueImg}
        alt=""
        width={50}
        height={50}
        className="object-contain"
      />
      <img
        ref={(el) => (imgs.current[3] = el)}
        src={blackImg}
        alt=""
        width={50}
        height={50}
        className="object-contain"
      />
      <button onClick={handleClick}>Pause/Resume</button>
    </div>
  );
};

export default ImageRandom;
