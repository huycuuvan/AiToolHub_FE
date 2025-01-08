import gsap from "gsap";
import { useEffect, useState } from "react";
import { heroVideo, smallHeroVideo } from "../utils";
import { Link } from "react-router";

const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(
    window.innerWidth < 760 ? smallHeroVideo : heroVideo
  );

  const handleVideoSrcSet = () => {
    if (window.innerWidth < 760) {
      setVideoSrc(smallHeroVideo);
    } else {
      setVideoSrc(heroVideo);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleVideoSrcSet);

    return () => {
      window.removeEventListener("resize", handleVideoSrcSet);
    };
  }, []);

  useEffect(() => {
    // Hiệu ứng chữ xuất hiện
    gsap.fromTo(
      "#hero-text",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 2 }
    );

    // Hiệu ứng nút xuất hiện sau chữ
    gsap.fromTo(
      "#hero-button",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 3,
        ease: "elastic.out(1, 0.5)",
      }
    );
  }, []);

  return (
    <section className="w-full h-screen bg-transparent overflow-auto relative">
      {/* Phần chữ */}
      <div
        id="hero-text"
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white text-4xl md:text-6xl font-bold text-center"
      >
        AI that changes everything.
      </div>
      {/* Nút "Try it" */}
      <div
        id="hero-button"
        className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <Link
          to="/text-assistance"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-600 transition"
        >
          Try it
        </Link>
      </div>
      {/* Video nền */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 p-2"
        autoPlay
        muted
        playsInline
        key={videoSrc}
        loop
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </section>
  );
};

export default Hero;
