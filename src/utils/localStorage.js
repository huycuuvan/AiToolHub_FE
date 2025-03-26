export const saveToHistory = (text, voice, blob, audioUrl) => {
  const history = getHistory();
  const newEntry = {
    text,
    voice,
    timestamp: new Date().toISOString(),
  };
  history.unshift(newEntry);
  localStorage.setItem("speechHistory", JSON.stringify(history));
};

export const getHistory = () => {
  const history = localStorage.getItem("speechHistory");
  return history ? JSON.parse(history) : [];
};
