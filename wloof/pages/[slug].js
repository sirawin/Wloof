"use client";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Adjust the import path
import { cn } from "@/lib/utils"; // Utility function for conditional classes
import { database } from '../lib/firebaseConfig'; // Adjust the path based on where you placed firebase.js
import { ref, set, serverTimestamp, get } from "firebase/database";
import { useRouter } from 'next/router';

export default function Home({ liff, liffError, profile, uid }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const router = useRouter();
  const [slug, setSlug] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    if (!router.isReady) return;

    const { slug } = router.query;

    if (uid && slug) {
      setSlug(slug);
      const uidSessionID = `${uid}_${slug}`;
      const moodRef = ref(database, `moods/${uidSessionID}`);

      get(moodRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            router.replace(`/result/` + slug);
          }
        })
        .catch((err) => {
          console.error("Error querying Realtime Database:", err);
          setError("An error occurred while checking your mood. Please try again.");
        });
    } else {
      setError("Invalid or missing UUID or slug." + slug + uid);
    }
  }, [router.isReady, router.query, uid]);

  // The main categories
  const moodCategories = [
    { label: "High Energy - Unpleasant", color: "bg-red-500" },
    { label: "High Energy - Pleasant", color: "bg-yellow-400" },
    { label: "Low Energy - Unpleasant", color: "bg-blue-500" },
    { label: "Low Energy - Pleasant", color: "bg-green-500" }
  ];

  // Moods within each category
  const moodGrids = {
    "High Energy - Unpleasant": [
      "Enraged", "Panicked", "Stressed", "Jittery", "Shocked", "Livid", "Furious", "Frustrated", "Tense", "Stunned",
      "Fuming", "Frightened", "Angry", "Nervous", "Restless", "Anxious", "Apprehensive", "Worried", "Irritated", "Annoyed",
      "Repulsed", "Troubled", "Concerned", "Uneasy", "Peeved"
    ],
    "High Energy - Pleasant": [
      "Surprised", "Upbeat", "Festive", "Exhilarated", "Ecstatic", "Hyper", "Cheerful", "Motivated", "Inspired", "Elated",
      "Energized", "Lively", "Excited", "Optimistic", "Enthusiastic", "Pleased", "Focused", "Happy", "Proud", "Thrilled",
      "Pleasant", "Joyful", "Hopeful", "Playful", "Blissful"
    ],
    "Low Energy - Unpleasant": [
      "Disgusted", "Glum", "Disappointed", "Down", "Apathetic", "Pessimistic", "Morose", "Discouraged", "Sad", "Bored",
      "Alienated", "Miserable", "Lonely", "Disheartened", "Tired", "Despondent", "Depressed", "Sullen", "Exhausted", "Fatigued",
      "Despairing", "Hopeless", "Desolate", "Spent", "Drained"
    ],
    "Low Energy - Pleasant": [
      "At Ease", "Easygoing", "Content", "Loving", "Fulfilled", "Calm", "Secure", "Satisfied", "Grateful", "Touched",
      "Relaxed", "Chill", "Restful", "Blessed", "Balanced", "Mellow", "Thoughtful", "Peaceful", "Comfortable", "Carefree",
      "Sleepy", "Complacent", "Tranquil", "Cozy", "Serene"
    ]
  };

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

    const uidSessionID = `${uid}_${slug}`;

    try {
      const moodRef = ref(database, `moods/${uidSessionID}`);
      await set(moodRef, {
        user: profile || "Guest",
        uid: uid,
        sessionID: slug,
        mood: mood,
        timestamp: serverTimestamp(),
      });

      setSuccess(true);
      setSelectedMood(null);
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
        {!selectedCategory ? (
          <div className="grid grid-cols-2 gap-4">
            {moodCategories.map((category) => (
              <Button
                key={category.label}
                onClick={() => handleCategorySelect(category.label)}
                className={`h-24 w-48 text-center border rounded-lg text-white ${category.color}`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        ) : (
          // Show the detailed grid for the selected category with the same color for the whole group
          <div className="flex flex-col items-center">
            <Button
              className="mb-4 bg-gray-300"
              onClick={() => setSelectedCategory(null)}
            >
              Back to Categories
            </Button>

            <div className={`grid grid-cols-5 gap-2 w-full max-w-screen-lg ${moodCategories.find(cat => cat.label === selectedCategory).color}`}>
              {moodGrids[selectedCategory].map((mood, index) => (
                <Button
                  key={index}
                  className="py-4 px-8 text-base text-center border rounded-lg"
                  onClick={() => handleMoodSelect(mood)}
                >
                  {mood}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {success && (
          <p className="mt-2 text-green-500">Your mood has been saved!</p>
        )}

        {error && <p className="text-red-500">{error}</p>}
      </main>
    </div>
  );
}