/* eslint-disable react/prop-types */
export const GeneratedImage = ({ imageRef, imageSrc, loading }) => {
  return (
    <div
      ref={imageRef}
      className="bg-gray-700 p-6 rounded-xl border border-gray-600 w-full max-w-[500px] h-[500px] flex items-center justify-center"
    >
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : imageSrc ? (
        <img
          src={imageSrc}
          alt="Generated"
          className="w-full h-full object-cover rounded-xl shadow-lg"
        />
      ) : (
        <p className="text-gray-400">No image generated yet.</p>
      )}
    </div>
  );
};
