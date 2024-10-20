"use client"; // Ensures client-side rendering

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    // Define the async function inside useEffect
    const fetchProfile = async () => {
      const liff = (await import("@line/liff")).default;
      await liff.ready;
      const profile = await liff.getProfile();
      setProfile(profile);
      
    };

    fetchProfile();
    console.log(profile)
  }, []); // Empty dependency array to run effect only once

  const [selectedMood, setSelectedMood] = useState(null);

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
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <main className="flex flex-col items-center text-center">
        {/* Greeting */}
        <h1 className="text-4xl font-bold mb-2">
          Hello, {profile.displayName}
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