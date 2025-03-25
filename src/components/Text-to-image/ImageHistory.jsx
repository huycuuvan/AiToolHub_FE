/* eslint-disable react/prop-types */

export const ImageHistory = ({
  historyRef,
  history,
  setModalImage,
  handleDelete,
}) => {
  return (
    <div
      ref={historyRef}
      className="col-span-12 md:col-span-4 lg:col-span-3 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col h-[90vh]"
    >
      <h3 className="text-xl font-bold mb-3">Generated Images</h3>
      <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {history.length > 0 ? (
          history.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-700 rounded-lg p-2 shadow-md hover:shadow-lg transition"
            >
              <div className="relative group">
                <img
                  src={entry.image}
                  alt={`Generated ${entry.id}`}
                  className="w-full h-[150px] lg:h-[180px] object-cover rounded-lg cursor-pointer transition duration-300 hover:opacity-90"
                />
                <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/50 rounded-lg">
                  <button
                    onClick={() => setModalImage(entry.image)}
                    className="p-2 bg-white text-black rounded-md mx-2 hover:bg-gray-200 transition"
                  >
                    🔍 View
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 bg-red-500 text-white rounded-md mx-2 hover:bg-red-600 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-300 select-text">
                <p className="text-white">📝 {entry.prompt}</p>
                <p className="text-indigo-400">🎨 {entry.style}</p>
                <p className="text-gray-500">
                  ⏳{" "}
                  {new Date(entry.timestamp).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </p>
                {entry.generationTime && (
                  <p className="text-gray-500">
                    🕒 Generated in {entry.generationTime.toFixed(2)} seconds
                  </p>
                )}
                {entry.numInferenceSteps && (
                  <p className="text-gray-500">
                    🚀 Inference Steps: {entry.numInferenceSteps}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No history available.</p>
        )}
      </div>
    </div>
  );
};
