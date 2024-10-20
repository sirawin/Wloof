import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState("");
  const [error, setError] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID
      })
      .then(() => {
        setMessage("LIFF init succeeded.");
      })
      .catch((e) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
      }
    );
  });


  const moods = [
    { emoji: "🤢", label: "Nauseous" },
    { emoji: "😐", label: "Meh" },
    { emoji: "🙂", label: "Okay" },
    { emoji: "🥰", label: "Loved" },
    { emoji: "😂", label: "Laughing" },
    { emoji: "🥲", label: "Tears of Joy" },
    { emoji: "😑", label: "Annoyed" },
    { emoji: "🤯", label: "Mind Blown" },
    { emoji: "😵‍💫", label: "Dizzy" },
    { emoji: "😡", label: "Angry" },
    { emoji: "😤", label: "Frustrated" },
    { emoji: "😭", label: "Crying" },
    { emoji: "😱", label: "Shocked" },
    { emoji: "🤬", label: "Furious" },
    { emoji: "😰", label: "Sweaty" },
    { emoji: "😓", label: "Sad" },
    { emoji: "😶‍🌫️", label: "Speechless" },
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);

    // Optionally, send a message using LIFF
    if (liffObject) {
      liffObject
        .sendMessages([
          {
            type: "text",
            text: `You selected: ${mood.label} ${mood.emoji}`,
          },
        ])
        .then(() => {
          console.log("Message sent");
        })
        .catch((err) => {
          console.error("Error sending message:", err);
        });
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <main className="flex flex-col items-center text-center">
        {/* Greeting */}
        <h1 className="text-4xl font-bold mb-2">
          Hello, "Guest"
        </h1>

        {/* Subtitle */}
        <p className="text-xl mb-6">How are you feeling today?</p>

        {/* Mood Grid */}
        <div className="relative grid grid-cols-3 sm:grid-cols-5 gap-4 max-w-md mx-auto">
          {moods.map((mood, index) => (
            <button
              key={index}
              className={`text-4xl hover:scale-110 transform transition-all ${
                selectedMood?.emoji === mood.emoji
                  ? "ring-4 ring-white rounded-full"
                  : ""
              }`}
              onClick={() => handleMoodSelect(mood)}
            >
              {mood.emoji}
            </button>
          ))}
        </div>

        {/* Selected Mood */}
        {selectedMood && (
          <p className="mt-6 text-xl">
            You selected: <strong>{selectedMood.label}</strong>
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
