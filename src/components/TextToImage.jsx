import React, { useState } from "react";

export const TextToImage = () => {
  const [input, setInput] = useState(""); // State for the user input
  const [imageSrc, setImageSrc] = useState(""); // State for the generated image
  const [loading, setLoading] = useState(false); // Loading state

  const token = "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"; // Hugging Face API token

  const query = async () => {
    setLoading(true);
    setImageSrc("/public/assets/videos/loading.gif"); // Path to your loading GIF

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: input }), // Sending user input
        }
      );

      const result = await response.blob();
      const objectURL = URL.createObjectURL(result); // Create object URL for the generated image
      setImageSrc(objectURL); // Set the generated image URL to the imageSrc state
    } catch (err) {
      console.error("Error generating image:", err);
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
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Text to Image</h1>
      <label htmlFor="input">Create an image from a text prompt:</label>
      <br />
      <input
        type="text"
        id="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your prompt"
        style={{
          padding: "10px",
          margin: "10px",
          width: "80%",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <br />
      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "gray" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate"}
      </button>
      <div style={{ marginTop: "20px" }}>
        {imageSrc && (
          <img
            id="image"
            src={imageSrc}
            alt="Generated"
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              border: "1px solid #ccc",
              marginTop: "10px",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TextToImage;
