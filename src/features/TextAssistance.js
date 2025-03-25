import publicAPI from "../api/publicApi";

class TextAssistanceService {
  static callChatbot = async (messages) => {
    return publicAPI.post("/api/tools/chatbot", {
      messages,
    });
  };
}

export default TextAssistanceService;
