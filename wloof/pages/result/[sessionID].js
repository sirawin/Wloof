// pages/result/[sessionID].js

"use client";

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { database } from '../../lib/firebaseConfig'; // Adjust the path if necessary
import { ref, get } from "firebase/database";
import { Button } from "@/components/ui/button"; // Adjust the import path as needed

export default function ResultPage() {
  const router = useRouter();
  const { sessionID } = router.query;
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure router and query parameters are ready
    if (!router.isReady) return;

    const fetchMoodData = async () => {
      if (!sessionID) {
        setError("Invalid or missing session ID.");
        setLoading(false);
        return;
      }

      try {
        // Reference to the specific mood entry
        const moodRef = ref(database, `moods/${sessionID}`);

        // Fetch data from Firebase
        const snapshot = await get(moodRef);

        if (snapshot.exists()) {
          setMoodData(snapshot.val());
        } else {
          setError("No mood data found for this session.");
        }
      } catch (err) {
        console.error("Error fetching mood data:", err);
        setError("An error occurred while fetching your mood data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [router.isReady, sessionID, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading your mood data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground p-4">
      <Head>
        <title>Your Mood Result</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="flex flex-col items-center text-center space-y-6">
        {/* Title */}
        <h1 className="text-4xl font-bold">Your Mood Result</h1>

        {/* Display Mood Data */}
        {moodData && (
          <div className="text-xl">
            <p><strong>User:</strong> {moodData.user}</p>
            <p><strong>Mood:</strong> {moodData.mood} {getEmoji(moodData.mood)}</p>
            <p><strong>Session:</strong> {moodData.sessionID}</p>
            <p><strong>Timestamp:</strong> {new Date(moodData.timestamp).toLocaleString()}</p>
          </div>
        )}

        {/* Back to Mood Selection */}
        <Button onClick={() => router.push(`/${moodData.sessionID}?uuid=${moodData.uid}`)}>
          Back to Mood Selection
        </Button>
      </main>
    </div>
  );
}

// Helper function to map mood labels to emojis
function getEmoji(mood) {
  const moodEmojis = {
    "Nauseous": "🤢",
    "Meh": "😐",
    "Okay": "🙂",
    "Loved": "🥰",
    "Laughing": "😂",
    "Tears of Joy": "🥲",
    "Annoyed": "😑",
    "Mind Blown": "🤯",
    "Dizzy": "😵‍💫",
    "Angry": "😡",
    "Frustrated": "😤",
    "Crying": "😭",
    "Shocked": "😱",
    "Furious": "🤬",
    "Sweaty": "😰",
    "Sad": "😓",
    "Speechless": "😶‍🌫️",
  };

  return moodEmojis[mood] || "";
}