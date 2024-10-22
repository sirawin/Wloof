// pages/result/[sessionID].js

"use client";

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { database } from '../../lib/firebaseConfig'; // Adjust the path if necessary
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { Button } from "@/components/ui/button"; // Adjust the import path as needed

export default function ResultPage() {
  const router = useRouter();
  const { sessionID } = router.query;
  const [moodEntries, setMoodEntries] = useState([]);
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
        // Reference to the 'moods' collection
        const moodsRef = ref(database, "moods");

        // Create a query to find all entries with the given sessionID
        const sessionQuery = query(
          moodsRef,
          orderByChild("sessionID"),
          equalTo(sessionID)
        );

        // Execute the query
        const snapshot = await get(sessionQuery);

        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convert the data object into an array of entries
          const entriesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setMoodEntries(entriesArray);
        } else {
          setError("No mood data found for this session.");
        }
      } catch (err) {
        console.error("Error fetching mood data:", err);
        setError("An error occurred while fetching mood data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [router.isReady, sessionID, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading mood data...</p>
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
        <title>Mood Results for {sessionID}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="w-full max-w-4xl flex flex-col items-center text-center space-y-6">
        {/* Title */}
        <h1 className="text-4xl font-bold">Mood Results for "{sessionID}"</h1>

        {/* Display Mood Entries */}
        {moodEntries.length > 0 ? (
          <div className="w-full space-y-4">
            {moodEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 border rounded-md shadow-md flex items-center space-x-4"
              >
                <div className="text-3xl">{getEmoji(entry.mood)}</div>
                <div className="flex flex-col">
                  <span className="font-semibold">{entry.user}</span>
                  <span className="text-gray-600">{entry.mood}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No mood entries found for this session.</p>
        )}

        {/* Back Button */}
        <Button
          onClick={() => router.push(`/${sessionID}?uuid=${getUUIDFromSessionID(sessionID)}`)}
        >
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

  return moodEmojis[mood] || "🤔";
}

// Placeholder function to extract UUID from sessionID
// You'll need to implement this based on how you structure your sessionID
function getUUIDFromSessionID(sessionID) {
  // Example: If sessionID is 'uid1_session1', extract 'uid1'
  const parts = sessionID.split("_");
  return parts[0] || "";
}