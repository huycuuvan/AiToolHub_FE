import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";

import TextToImage from "../features/TextToImage";

export const useTextToImage = (defaultModel) => {
  const [input, setInput] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("Default");
  const [model, setModel] = useState(defaultModel);
  const [history, setHistory] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  const formRef = useRef(null);
  const imageRef = useRef(null);
  const historyRef = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(
      localStorage.getItem("imageHistory") || "[]"
    );
    if (Array.isArray(savedHistory)) setHistory(savedHistory);
  }, []);

  useEffect(() => {
    if (formRef.current && historyRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1 }
      );
      gsap.fromTo(
        historyRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 1 }
      );
    }
  }, []);

  const handleModelClick = (modelName) => {
    setModel(modelName);
    toast.info(`Switched to ${modelName}`);
  };

  const handleStyleClick = (style) => setSelectedStyle(style.name);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      const updatedHistory = history.filter((entry) => entry.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem("imageHistory", JSON.stringify(updatedHistory));
      toast.info("Image deleted successfully!");
    }
  };

  const query = async () => {
    if (!input.trim()) {
      toast.warn("⚠️ Please enter a prompt!");
      return;
    }

    setLoading(true);
    setImageSrc("");

    try {
      const response = await TextToImage.callTextToImage(
        model,
        input,
        selectedStyle
      );
      console.log(response);
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onloadend = () => {
        const newImage = reader.result;
        const historyEntry = {
          id: Date.now(),
          image: newImage,
          prompt: input,
          style: selectedStyle,
          timestamp: new Date().toISOString(),
        };
        const updatedHistory = [historyEntry, ...history];
        setHistory(updatedHistory);
        localStorage.setItem("imageHistory", JSON.stringify(updatedHistory));
        setImageSrc(newImage);
        toast.success("Image generated successfully!");
      };
    } catch (err) {
      console.error("Error generating image:", err);
      toast.error(err.response?.data?.error || "Error generating image");
    } finally {
      setLoading(false);
    }
  };

  return {
    input,
    setInput,
    imageSrc,
    loading,
    selectedStyle,
    model,
    history,
    modalImage,
    setModalImage,
    handleModelClick,
    handleStyleClick,
    handleDelete,
    query,
    formRef,
    imageRef,
    historyRef,
  };
};
