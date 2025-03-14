/* eslint-disable react/prop-types */

export const TextToImageControls = ({
  formRef,
  models,
  styles,
  model,
  handleModelClick,
  selectedStyle,
  handleStyleClick,
  input,
  setInput,
  query,
  loading,
}) => {
  return (
    <div
      ref={formRef}
      className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
    >
      <h3 className="text-xl font-bold">Choose a Model</h3>
      <div className="grid grid-cols-1 gap-3 mt-3">
        {models.map((m) => (
          <button
            key={m.name}
            onClick={() => handleModelClick(m.api)}
            className={`p-2 rounded-lg transition-all ${
              model === m.api
                ? "bg-indigo-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>
      <h3 className="text-xl font-bold mt-6">Choose a Style</h3>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {styles.map((s) => (
          <div key={s.name} className="flex flex-col items-center">
            <img
              src={s.thumbnail}
              alt={s.name}
              onClick={() => handleStyleClick(s)}
              className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-all ${
                selectedStyle === s.name
                  ? "ring-4 ring-indigo-500 scale-105"
                  : "hover:opacity-80"
              }`}
            />
            <span className="mt-1 text-xs">{s.name}</span>
          </div>
        ))}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your prompt"
        className="w-full p-3 mt-4 bg-gray-700 text-white rounded-lg border border-gray-600"
        rows="3"
      />
      <button
        onClick={query}
        disabled={loading}
        className={`w-full mt-4 p-3 rounded-lg font-bold text-lg transition-all ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500"
        }`}
      >
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
};
