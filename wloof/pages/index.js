"use client"; // Ensures client-side rendering

import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function Home({ liff, liffError, profile }) {
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
      <Head>
        <title>LIFF App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`flex flex-col items-center text-center ${styles.main}`}>
        {/* Greeting */}
        <h1 className="text-4xl font-bold mb-2">
          Hi, {profile || "Guest"}
        </h1>

        {/* LIFF status */}
        {liff && <p>LIFF init succeeded.</p>}
        {liffError && (
          <>
            <p>LIFF init failed.</p>
            <p>
              <code>{liffError}</code>
            </p>
          </>
        )}

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

        {/* LIFF Documentation Link */}
        <a
          href="https://developers.line.biz/ja/docs/liff/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 text-blue-500 underline"
        >
          LIFF Documentation
        </a>
      </main>
    </div>
  );
}