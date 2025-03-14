/* eslint-disable react/prop-types */

export const ImageModal = ({ modalImage, setModalImage }) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center"
      onClick={() => setModalImage(null)}
    >
      <div
        className="relative bg-gray-800 p-4 rounded-xl max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setModalImage(null)}
          className="absolute top-2 right-2 text-white"
        >
          ✕
        </button>
        <img
          src={modalImage}
          alt="Enlarged"
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
};
