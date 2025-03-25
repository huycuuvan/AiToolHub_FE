import { Navbar } from "../Navbar";
import { useTextToImage } from "../../hooks/useTextToImage";
import { models, styles } from "../../constants";
import { TextToImageControls } from "./TextToImageControls";
import { GeneratedImage } from "./GeneratedImage";
import { ImageHistory } from "./ImageHistory";
import { ImageModal } from "./ImageModal";

export const TextToImage = () => {
  const {
    input,
    setInput,
    imageSrc,
    loading,
    selectedStyle,
    model,
    history,
    modalImage,
    setModalImage,
    numInferenceSteps,
    setNumInferenceSteps,
    handleModelClick,
    handleStyleClick,
    handleDelete,
    query,
    formRef,
    imageRef,
    historyRef,
  } = useTextToImage(models[0].api);

  return (
    <div className="bg-gradient-to-br from-black via-gray-700 to-black min-h-screen text-white flex flex-col">
      <Navbar />
      <div className="grid grid-cols-12 gap-6 p-6 pt-10 mt-6 max-w-[1800px] xl:max-w-[95%] mx-auto w-full">
        {/* Left Sidebar Controls */}
        <TextToImageControls
          formRef={formRef}
          models={models}
          styles={styles}
          model={model}
          handleModelClick={handleModelClick}
          selectedStyle={selectedStyle}
          handleStyleClick={handleStyleClick}
          input={input}
          setInput={setInput}
          query={query}
          loading={loading}
          numInferenceSteps={numInferenceSteps}
          setNumInferenceSteps={setNumInferenceSteps}
        />

        {/* Center - Generated Image */}
        <GeneratedImage
          imageRef={imageRef}
          imageSrc={imageSrc}
          loading={loading}
        />

        {/* Right Sidebar - History */}
        <ImageHistory
          historyRef={historyRef}
          history={history}
          setModalImage={setModalImage}
          handleDelete={handleDelete}
        />
      </div>

      {/* Modal for Viewing Images */}
      {modalImage && (
        <ImageModal modalImage={modalImage} setModalImage={setModalImage} />
      )}
    </div>
  );
};

export default TextToImage;
