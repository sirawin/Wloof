"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Adjust the import path
import { cn } from "@/lib/utils"; // Utility function for conditional classes
import { database } from '../lib/firebaseConfig'; // Adjust the path based on where you placed firebase.js
import { ref, push, set, serverTimestamp, get } from "firebase/database";
import { useRouter } from 'next/router'

export default function Home({ liff, liffError, profile, uid }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const router = useRouter();
  const [slug, setSlug] = useState(null); // State to store slug (text)
  const [loading, setLoading] = useState(false); // Optional: For handling loading states
  const [error, setError] = useState(null); // Optional: For handling errors
  const [success, setSuccess] = useState(false); // Optional: For handling success messages

  useEffect(() => {
    if (!router.isReady) return; // Wait until router is ready
  
    const { slug } = router.query;
  
    if (uid && slug) {
      setSlug(slug);
  
      // Create the composite key
      const uidSessionID = `${uid}_${slug}`;
  
      // Reference to the specific mood entry
      const moodRef = ref(database, `moods/${uidSessionID}`);
  
      // Check if the mood entry exists
      get(moodRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // Mood already recorded, redirect to results page
            router.replace(`/relationship`);
          }
          // Else, do nothing and allow mood selection
        })
        .catch((err) => {
          console.error("Error querying Realtime Database:", err);
          setError("An error occurred while checking your mood. Please try again.");
        });
    } else {
      setError("Invalid or missing UUID or slug."+slug+uid);
    }
  }, [router.isReady, router.query, uid]);

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
    if (!uid || !slug) {
      console.error("UUID or slug is missing.");
      setError("An error occurred. Please try again.");
      return;
    }
  
    setSelectedMood(mood);
    setLoading(true);
    setError(null);
    setSuccess(false);
  
    // Create the composite key
    const uidSessionID = `${uid}_${slug}`;
  
    try {
      // Reference to the specific path using composite key
      const moodRef = ref(database, `moods/${uidSessionID}`);
  
      // Set data for the mood entry (overwrites if exists)
      await set(moodRef, {
        user: profile || "Guest",
        uid: uid, // Store the UUID
        sessionID: slug, // Store the slug (text)
        mood: mood.label,
        timestamp: serverTimestamp(), // Adds server timestamp
      });
  
      // Provide feedback to the user
      setSuccess(true);
      setSelectedMood(null); // Optionally reset the selected mood
    } catch (err) {
      console.error("Error writing to Realtime Database:", err);
      setError("Failed to save your mood. Please try again.");
    } finally {
      setLoading(false);
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

        {/* Display slug text */}
        {slug && <p className="text-xl">Text: {slug}</p>}

        {/* LIFF status */}
        {uid}  
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
              disabled={loading} // Disable buttons while loading
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

        {/* Success Message */}
        {success && (
          <p className="mt-2 text-green-500">Your mood has been saved!</p>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

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