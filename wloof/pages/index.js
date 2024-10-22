"use client";

import Head from "next/head";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust the import path
import { cn } from "@/lib/utils"; // Utility function for conditional classes
import { database } from './firebaseConfig'; // Adjust the path based on where you placed firebase.js
import { ref, push, set, serverTimestamp } from "firebase/database";

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

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
  
    try {
      // Reference to the 'moods' collection in Realtime Database
      const moodsRef = ref(database, "moods");
  
      // Create a new unique key under 'moods'
      const newMoodRef = push(moodsRef);
  
      // Set data for the new mood entry
      await set(newMoodRef, {
        user: profile || "Guest",
        mood: mood.label,
        emoji: mood.emoji,
        timestamp: serverTimestamp(), // Adds server timestamp
      });
  
      // Optional: Provide feedback to the user, e.g., show a success message or reset the selected mood
    } catch (err) {
      console.error("Error writing to Realtime Database: ", err);
    } finally {

    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground">
      <Head>
        <title>LIFF App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="flex flex-col items-center text-center space-y-6">
        {/* Greeting */}
        <h1 className="text-4xl font-bold">Hi, {profile || "Guest"}</h1>

        {/* LIFF status */}
        {liff && <p>LIFF init succeeded.</p>}
        {liffError && (
          <div>
            <p>LIFF init failed.</p>
            <p>
              <code>{liffError}</code>
            </p>
          </div>
        )}

        {/* Subtitle */}
        <p className="text-xl">How are you feeling today?</p>

        {/* Mood Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {moods.map((mood, index) => (
            <Button
              key={index}
              variant={selectedMood?.emoji === mood.emoji ? "default" : "ghost"}
              size="icon"
              onClick={() => handleMoodSelect(mood)}
              className={cn(
                "text-4xl",
                selectedMood?.emoji === mood.emoji && "ring-2 ring-ring"
              )}
            >
              {mood.emoji}
            </Button>
          ))}
        </div>

        {/* Selected Mood */}
        {selectedMood && (
          <p className="mt-4 text-xl">
            You selected: <strong>{selectedMood.label}</strong>
          </p>
        )}

        {/* LIFF Documentation Link */}
        <a
          href="https://developers.line.biz/ja/docs/liff/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 text-primary underline"
        >
          LIFF Documentation
        </a>
      </main>
    </div>
  );
}