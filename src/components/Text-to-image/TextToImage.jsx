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
    handleModelClick,
    handleStyleClick,
    handleDelete,
    query,
    formRef,
    imageRef,
    historyRef,
  } = useTextToImage(models[0].api);

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen text-white flex flex-col">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-3 p-10 m-auto w-full mt-20 gap-10">
        {/* Sidebar Controls */}
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
        />

        {/* Display Generated Image */}
        <GeneratedImage
          imageRef={imageRef}
          imageSrc={imageSrc}
          loading={loading}
        />

        {/* Image History Section */}
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
