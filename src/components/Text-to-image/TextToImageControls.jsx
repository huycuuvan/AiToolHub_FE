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
  numInferenceSteps,
  setNumInferenceSteps,
}) => {
  return (
    <div
      ref={formRef}
      className="col-span-12 md:col-span-4 lg:col-span-3 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between"
    >
      <h3 className="text-xl font-bold">Choose a Model</h3>
      <div className="grid grid-cols-1 gap-3 mt-3">
        {models.map((modelOption) => (
          <button
            key={modelOption.name}
            onClick={() => handleModelClick(modelOption)}
            className={`p-2 rounded-lg transition-all ${
              model === modelOption.api
                ? "bg-indigo-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {modelOption.name}
          </button>
        ))}
      </div>

      <div className="flex-grow mt-6 min-h-[300px] flex flex-col">
        <h3 className="text-xl font-bold">Choose a Style</h3>
        <div className="mt-3 p-2 border border-gray-700 rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 max-h-[250px]">
          <div className="grid grid-cols-3 gap-3">
            {styles.map((style) => (
              <div key={style.name} className="flex flex-col items-center">
                <img
                  src={style.thumbnail}
                  alt={style.name}
                  onClick={() => handleStyleClick(style)}
                  className={`w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg cursor-pointer transition-all ${
                    selectedStyle === style.name
                      ? "ring-4 ring-indigo-500 scale-105"
                      : "hover:opacity-80"
                  }`}
                />
                <span className="mt-1 text-xs">{style.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold">Inference Steps</h3>
        <div className="mt-2">
          <input
            type="range"
            min="1"
            max="50"
            value={numInferenceSteps}
            onChange={(e) => setNumInferenceSteps(Number(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="text-center text-white mt-2">
            Selected: {numInferenceSteps} steps
          </div>
        </div>
      </div>

      <div className="mt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt"
          className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none"
          rows="2"
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
    </div>
  );
};
