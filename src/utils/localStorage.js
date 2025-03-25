export const saveToHistory = (text, voice) => {
  const history = JSON.parse(localStorage.getItem("ttsHistory") || "[]");
  history.unshift({ text, voice, timestamp: new Date().toISOString() });
  localStorage.setItem("ttsHistory", JSON.stringify(history.slice(0, 20))); // Keep last 20 items
};

export const getHistory = () => {
  return JSON.parse(localStorage.getItem("ttsHistory") || "[]");
};
