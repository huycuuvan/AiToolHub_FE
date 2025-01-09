import React, { useState, useEffect } from "react";

export const TextToImage = () => {
  const [input, setInput] = useState(""); // User input
  const [imageSrc, setImageSrc] = useState(""); // Generated image
  const [loading, setLoading] = useState(false); // Loading state
  const [size, setSize] = useState("512x512"); // Default size
  const [selectedStyle, setSelectedStyle] = useState("Default"); // Selected style
  const [apiEndpoint, setApiEndpoint] = useState(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
  ); // Default model API endpoint

  // Define available models
  const models = [
    {
      name: "Stable Diffusion 1.0",//20s~
      api: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    },
    {
      name: "Stable Diffusion 3.5",//42s~
      api: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
    },
    {
      name: "FLUX",//2.1m~
      api: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    },
    {
      name: "FLUX-RealismLora",//2.1m-3m
      api: "https://api-inference.huggingface.co/models/XLabs-AI/flux-RealismLora",
    },
  ];

  // Define styles with their images and descriptions
  const styles = [
    {
      name: "Default",
      description: "Create an image from a text input using AI models.",
      thumbnail: "assets/images/blue.jpg",
    },
    {
      name: "Cartoon",
      description: "Generate images with a fun and cartoonish style.",
      thumbnail: "assets/images/cartoon.jpg",
    },
    {
      name: "Realistic",
      description: "Produce high-quality realistic images.",
      thumbnail: "assets/images/realistic.png",
    },
    {
      name: "Fantasy",
      description: "Bring your fantasy worlds to life with vivid imagery.",
      thumbnail: "assets/images/fantasy.jpg",
    },
    {
      name: "Cyberpunk",
      description: "Generate an image in cyberpunk style.",
      thumbnail: "assets/images/cyberpunk.png",
    },
    {
      name: "Abstract",
      description: "Create abstract art with unique shapes and colors.",
      thumbnail: "assets/images/abstract.jpg",
    },
  ];

  const token = "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"; // Hugging Face API token

  const query = async () => {
    setLoading(true);
    setImageSrc(""); // Clear the image before generating

    try {
      // Add the style description to the input
      const styleDescription = styles.find((style) => style.name === selectedStyle)?.description || "";
      const fullInput = `${styleDescription} ${input}`; // Append style to input

      const response = await fetch(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: fullInput,
          options: { size }, // Pass size if supported
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Error generating image");
      }

      const result = await response.blob();
      const objectURL = URL.createObjectURL(result); // Create object URL for the image
      setImageSrc(objectURL);
    } catch (err) {
      console.error("Error generating image:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!input.trim()) {
      alert("Please enter a prompt.");
      return;
    }
    query();
  };

  return (
    
    <div
      style={{
        backgroundColor: "#1a1a2e",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "90%",
          maxWidth: "1200px",
          backgroundColor: "#2b2b3d",
          borderRadius: "16px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
        }}
      >
        {/* Left Section */}
<div
  style={{
    flex: "1",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  }}
>
  {/* Model Selection */}
  <h3>Choose a Model</h3>
  <div style={{ display: "flex", gap: "10px" }}>
    {models.map((model) => (
      <button
        key={model.name}
        onClick={() => setApiEndpoint(model.api)}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: apiEndpoint === model.api ? "2px solid #6c63ff" : "1px solid #555",
          backgroundColor: apiEndpoint === model.api ? "#6c63ff" : "#333",
          color: "#fff",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        {model.name}
      </button>
    ))}
  </div>

  {/* Style Selection */}
  <h3>Choose a Style</h3>
  <div style={{ display: "flex", gap: "10px" }}>
    {styles.map((styleOption) => (
      <button
        key={styleOption.name}
        onClick={() => setSelectedStyle(styleOption.name)}
        style={{
          padding: "0",
          border:
            selectedStyle === styleOption.name
              ? "2px solid #6c63ff"
              : "2px solid transparent",
          backgroundColor: "transparent",
          borderRadius: "12px",
          cursor: "pointer",
          transition: "0.3s ease",
        }}
      >
        <img
          src={styleOption.thumbnail}
          alt={styleOption.name}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      </button>
    ))}
  </div>

  {/* Dynamic Title and Description */}
  <h1 style={{ textAlign: "left", color: "#fff" }}>
    {selectedStyle} Image Generator
  </h1>
  <p style={{ textAlign: "left", color: "#bbb", marginTop: "10px" }}>
    {styles.find((style) => style.name === selectedStyle)?.description || "Choose a style to see its description."}
  </p>

  {/* Text Input */}
  <textarea
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Enter your prompt"
    rows="5"
    style={{
      padding: "15px",
      width: "100%",
      border: "1px solid #555",
      borderRadius: "8px",
      backgroundColor: "#333",
      color: "#fff",
      fontSize: "16px",
      resize: "vertical",
    }}
  ></textarea>

  {/* Generate Button */}
  <button
    onClick={handleGenerate}
    disabled={loading}
    style={{
      padding: "15px 30px",
      backgroundColor: loading ? "#555" : "#6c63ff",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: loading ? "not-allowed" : "pointer",
      fontSize: "16px",
    }}
  >
    {loading ? "Generating..." : "Generate"}
  </button>
</div>


        {/* Right Section */}
<div
  style={{
    flex: "1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
  }}
>
  {loading ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "6px solid rgba(255, 255, 255, 0.3)",
          borderTop: "6px solid #fff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <p style={{ marginTop: "10px", color: "#fff" }}>Generating image...</p>
    </div>
  ) : imageSrc ? (
    <img
      src={imageSrc}
      alt="Generated"
      style={{
        maxWidth: "100%",
        maxHeight: "400px",
        borderRadius: "8px",
        border: "1px solid #555",
      }}
    />
  ) : (
    <div
      style={{
        width: "100%",
        height: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#333",
        borderRadius: "8px",
        border: "1px solid #555",
        color: "#888",
      }}
    >
      <p>No image generated yet. Enter a prompt to start.</p>
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default TextToImage;
