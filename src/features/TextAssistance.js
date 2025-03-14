import publicAPI from "../api/publicApi";

class TextAssistance {
  basePath = "/api/tools/chatbot";

  static callChatbot = async (text) => {
    return publicAPI.post(`${TextAssistance.basePath}/chatbot`, {
      text,
    });
  };
}

export default TextAssistance;
