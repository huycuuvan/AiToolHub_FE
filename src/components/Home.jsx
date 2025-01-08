import Hero from "./Hero";
import Highlights from "./Highlights";
import Model from "./Model";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Footer from "./Footer";

export const Home = () => {
  return (
    <div className="overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      <Hero />
      <Highlights />
    </div>
  );
};
