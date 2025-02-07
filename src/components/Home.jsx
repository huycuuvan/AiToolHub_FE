import { useEffect, useRef } from "react";
import Hero from "./Hero";
import Highlights from "./Highlights";
import Introdution from "./Introdution";
import { Navbar } from "./Navbar";
import gsap from "gsap";

export const Home = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const images = [
      "bg-hero-pattern",
      "bg-hero-pattern-1",
      "bg-hero-pattern-2",
    ];
    let currentIndex = 0;

    const changeBackground = () => {
      if (heroRef.current) {
        heroRef.current.classList.remove(images[currentIndex]);
        currentIndex = (currentIndex + 1) % images.length;
        heroRef.current.classList.add(images[currentIndex]);
      }
    };

    const transitionDuration = 1;
    const intervalDuration = 5;

    const interval = setInterval(() => {
      gsap.to(heroRef.current, {
        opacity: 0,
        duration: transitionDuration,
        onComplete: () => {
          changeBackground();
          gsap.to(heroRef.current, {
            opacity: 1,
            duration: transitionDuration,
          });
        },
      });
    }, intervalDuration * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-600 to-black">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Background with animation */}
        <div
          ref={heroRef}
          className="absolute inset-0 bg-hero-pattern bg-cover bg-no-repeat bg-center z-0 blur"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
          }}
        ></div>

        {/* Navbar */}
        <div className="sticky top-0 left-0 w-full z-50">
          <Navbar />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white">
          <Hero />
        </div>
      </div>

      {/* Highlights Section */}
      <div className="relative z-30 py-20 text-white">
        <Highlights />
      </div>

      {/* Introduction Section */}
      <div className="relative z-30 py-20 text-white">
        <Introdution />
      </div>
    </div>
  );
};
