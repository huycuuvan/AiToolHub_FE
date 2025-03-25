/* eslint-disable react/prop-types */

import Loader from "../Loader";

export const GeneratedImage = ({ imageRef, imageSrc, loading }) => {
  return (
    <div className="col-span-12 md:col-span-5 lg:col-span-6 flex items-center justify-center">
      <div
        ref={imageRef}
        className="bg-gray-700 p-8 lg:p-10 rounded-xl border border-gray-600 w-full max-w-[600px] h-[500px] flex items-center justify-center"
      >
        {loading ? (
          <Loader />
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt="Generated"
            className="w-full h-full object-cover rounded-xl shadow-lg"
          />
        ) : (
          <p className="text-gray-400 text-center">No image generated yet.</p>
        )}
      </div>
    </div>
  );
};
