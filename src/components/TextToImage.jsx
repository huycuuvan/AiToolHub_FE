import React, { useState } from "react";

export const TextToImage = () => {
  const [input, setInput] = useState(""); // State for the user input
  const [imageSrc, setImageSrc] = useState(""); // State for the generated image
  const [loading, setLoading] = useState(false); // Loading state
  const [size, setSize] = useState("512x512"); // Default size
  const [selectedStyle, setSelectedStyle] = useState("Default"); // Selected style
  const [apiEndpoint, setApiEndpoint] = useState(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large"
  ); // Default model API endpoint

  // Define available models
  const models = [
    {
      name: "Stable Diffusion",
      api: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
    },
    {
      name: "FLUX",
      api: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    },
  ];

  // Define styles with their images and descriptions
  const styles = [
    {
      name: "Default",
      apiValue: "default_style",
      description: "Create an image from a text input using AI models.",
      thumbnail: "assets/images/blue.jpg",
    },
    {
      name: "Cartoon",
      apiValue: "cartoon_style",
      description: "Generate images with a fun and cartoonish style.",
      thumbnail: "assets/images/cartoon.jpg",
    },
    {
      name: "Realistic",
      apiValue: "realistic_style",
      description: "Produce high-quality realistic images.",
      thumbnail: "assets/images/realistic.png",
    },
    {
      name: "Fantasy",
      apiValue: "fantasy_style",
      description: "Bring your fantasy worlds to life with vivid imagery.",
      thumbnail: "assets/images/fantasy.jpg",
    },
    {
      name: "Cyberpunk",
      apiValue: "cyberpunk_style",
      description: "Generate an image in cyberpunk style.",
      thumbnail: "assets/images/cyberpunk.png",
    },
    {
      name: "Abstract",
      apiValue: "abstract_style",
      description: "Create abstract art with unique shapes and colors.",
      thumbnail: "assets/images/abstract.jpg",
    },
  ];

  const token = "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"; // Hugging Face API token

  const query = async () => {
    setLoading(true);
    setImageSrc(""); // Clear the image before generating

    try {
      const styleToSend = styles.find((style) => style.name === selectedStyle)?.apiValue;

      const response = await fetch(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: input,
          options: { size, style: styleToSend },
        }),
      });

      if (!response.ok) {
        alert("The selected style or model is not supported. Please try again.");
        setLoading(false);
        return;
      }

      const result = await response.blob();
      const objectURL = URL.createObjectURL(result); // Create object URL for the generated image
      setImageSrc(objectURL); // Set the generated image URL to the imageSrc state
    } catch (err) {
      console.error("Error generating image:", err);
      alert("An error occurred while generating the image. Please try again.");
      setImageSrc(""); // Reset image in case of error
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!input.trim()) return; // Do nothing if input is empty
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
      {/* Content Wrapper */}
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
          <div>
            <h3 style={{ marginBottom: "10px", textAlign: "left" }}>Choose a Model</h3>
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
          </div>

          {/* Dynamic Title and Description */}
          <h1 style={{ textAlign: "left" }}>{selectedStyle} Image Generator</h1>
          <p style={{ textAlign: "left" }}>
            {styles.find((style) => style.name === selectedStyle)?.description}
          </p>

          {/* Textarea Input */}
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

          {/* Style Options */}
          <div>
            <h3 style={{ marginBottom: "10px", textAlign: "left" }}>Choose a Style</h3>
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
                    boxShadow:
                      selectedStyle === styleOption.name
                        ? "0px 0px 15px 5px #6c63ff"
                        : "none",
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
          </div>

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
          {imageSrc ? (
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
              <p>No image generated yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToImage;
