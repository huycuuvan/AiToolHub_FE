import publicAPI from "../api/publicApi";

class TextToImage {
  basePath = "";

  static callTextToImage = async (model, input, style) => {
    return publicAPI.post(
      `api/tools/${model}`,
      {
        input,
        style,
      },
      { responseType: "blob" }
    );
  };
}

export default TextToImage;
