import gsap from "gsap";
import { useEffect, useState } from "react";
import { heroVideo, smallHeroVideo } from "../utils";

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
    // Gắn hiệu ứng chữ xuất hiện sau 2 giây
    gsap.fromTo(
      "#hero-text",
      { opacity: 0, y: 50 }, // Bắt đầu từ mờ và lệch xuống dưới
      { opacity: 1, y: 0, duration: 1, delay: 2 } // Xuất hiện rõ ràng sau 2 giây
    );
  }, []);

  return (
    <section className="w-full h-screen bg-black relative">
      {/* Phần chữ */}
      <div
        id="hero-text"
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white text-4xl md:text-6xl font-bold text-center"
      >
        AI that changes everything.
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
