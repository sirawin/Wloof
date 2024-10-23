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
            router.replace(`/result/`+slug);
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

  const moodsGrid = [
    // Row 1 (Top-left to Top-right)
    { label: "Enraged", color: "bg-red-500" }, { label: "Panicked", color: "bg-red-500" },
    { label: "Stressed", color: "bg-red-500" }, { label: "Jittery", color: "bg-red-500" },
    { label: "Shocked", color: "bg-red-500" }, { label: "Surprised", color: "bg-yellow-400" },
    { label: "Upbeat", color: "bg-yellow-400" }, { label: "Festive", color: "bg-yellow-400" },
    { label: "Exhilarated", color: "bg-yellow-400" }, { label: "Ecstatic", color: "bg-yellow-400" },
  
    // Row 2
    { label: "Livid", color: "bg-red-500" }, { label: "Furious", color: "bg-red-500" },
    { label: "Frustrated", color: "bg-red-500" }, { label: "Tense", color: "bg-red-500" },
    { label: "Stunned", color: "bg-red-500" }, { label: "Hyper", color: "bg-yellow-400" },
    { label: "Cheerful", color: "bg-yellow-400" }, { label: "Motivated", color: "bg-yellow-400" },
    { label: "Inspired", color: "bg-yellow-400" }, { label: "Elated", color: "bg-yellow-400" },
  
    // Row 3
    { label: "Fuming", color: "bg-red-500" }, { label: "Frightened", color: "bg-red-500" },
    { label: "Angry", color: "bg-red-500" }, { label: "Nervous", color: "bg-red-500" },
    { label: "Restless", color: "bg-red-500" }, { label: "Energized", color: "bg-yellow-400" },
    { label: "Lively", color: "bg-yellow-400" }, { label: "Excited", color: "bg-yellow-400" },
    { label: "Optimistic", color: "bg-yellow-400" }, { label: "Enthusiastic", color: "bg-yellow-400" },
  
    // Row 4
    { label: "Anxious", color: "bg-red-500" }, { label: "Apprehensive", color: "bg-red-500" },
    { label: "Worried", color: "bg-red-500" }, { label: "Irritated", color: "bg-red-500" },
    { label: "Annoyed", color: "bg-red-500" }, { label: "Pleased", color: "bg-yellow-400" },
    { label: "Focused", color: "bg-yellow-400" }, { label: "Happy", color: "bg-yellow-400" },
    { label: "Proud", color: "bg-yellow-400" }, { label: "Thrilled", color: "bg-yellow-400" },
  
    // Row 5
    { label: "Repulsed", color: "bg-red-500" }, { label: "Troubled", color: "bg-red-500" },
    { label: "Concerned", color: "bg-red-500" }, { label: "Uneasy", color: "bg-red-500" },
    { label: "Peeved", color: "bg-red-500" }, { label: "Pleasant", color: "bg-yellow-400" },
    { label: "Joyful", color: "bg-yellow-400" }, { label: "Hopeful", color: "bg-yellow-400" },
    { label: "Playful", color: "bg-yellow-400" }, { label: "Blissful", color: "bg-yellow-400" },
  
    // Row 6
    { label: "Disgusted", color: "bg-blue-500" }, { label: "Glum", color: "bg-blue-500" },
    { label: "Disappointed", color: "bg-blue-500" }, { label: "Down", color: "bg-blue-500" },
    { label: "Apathetic", color: "bg-blue-500" }, { label: "At Ease", color: "bg-green-500" },
    { label: "Easygoing", color: "bg-green-500" }, { label: "Content", color: "bg-green-500" },
    { label: "Loving", color: "bg-green-500" }, { label: "Fulfilled", color: "bg-green-500" },
  
    // Row 7
    { label: "Pessimistic", color: "bg-blue-500" }, { label: "Morose", color: "bg-blue-500" },
    { label: "Discouraged", color: "bg-blue-500" }, { label: "Sad", color: "bg-blue-500" },
    { label: "Bored", color: "bg-blue-500" }, { label: "Calm", color: "bg-green-500" },
    { label: "Secure", color: "bg-green-500" }, { label: "Satisfied", color: "bg-green-500" },
    { label: "Grateful", color: "bg-green-500" }, { label: "Touched", color: "bg-green-500" },
  
    // Row 8
    { label: "Alienated", color: "bg-blue-500" }, { label: "Miserable", color: "bg-blue-500" },
    { label: "Lonely", color: "bg-blue-500" }, { label: "Disheartened", color: "bg-blue-500" },
    { label: "Tired", color: "bg-blue-500" }, { label: "Relaxed", color: "bg-green-500" },
    { label: "Chill", color: "bg-green-500" }, { label: "Restful", color: "bg-green-500" },
    { label: "Blessed", color: "bg-green-500" }, { label: "Balanced", color: "bg-green-500" },
  
    // Row 9
    { label: "Despondent", color: "bg-blue-500" }, { label: "Depressed", color: "bg-blue-500" },
    { label: "Sullen", color: "bg-blue-500" }, { label: "Exhausted", color: "bg-blue-500" },
    { label: "Fatigued", color: "bg-blue-500" }, { label: "Mellow", color: "bg-green-500" },
    { label: "Thoughtful", color: "bg-green-500" }, { label: "Peaceful", color: "bg-green-500" },
    { label: "Comfortable", color: "bg-green-500" }, { label: "Carefree", color: "bg-green-500" },
  
    // Row 10
    { label: "Despairing", color: "bg-blue-500" }, { label: "Hopeless", color: "bg-blue-500" },
    { label: "Desolate", color: "bg-blue-500" }, { label: "Spent", color: "bg-blue-500" },
    { label: "Drained", color: "bg-blue-500" }, { label: "Sleepy", color: "bg-green-500" },
    { label: "Complacent", color: "bg-green-500" }, { label: "Tranquil", color: "bg-green-500" },
    { label: "Cozy", color: "bg-green-500" }, { label: "Serene", color: "bg-green-500" }
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-gray-800">
      <Head>
        <title>Mood Grid</title>
      </Head>

      <main className="flex flex-col items-center text-center space-y-6">
        <h1 className="text-4xl font-bold">How are you feeling?</h1>

        {/* Mood Grid UI */}
        <div className="grid grid-cols-10 gap-1 w-full max-w-screen-lg">
          {moodsGrid.map((mood, index) => (
            <Button
              key={index}
              variant={selectedMood?.label === mood.label ? "default" : "ghost"}
              onClick={() => handleMoodSelect(mood)}
              className={`h-10 w-20 text-sm text-center border rounded-lg ${
                selectedMood?.label === mood.label
                  ? "border-black ring-2 ring-black"
                  : mood.color
              }`}
            >
              {mood.label}
            </Button>
          ))}
        </div>

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

      </main>
    </div>
  );
}