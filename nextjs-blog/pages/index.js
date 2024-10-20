// pages/index.js

import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [selectedMood, setSelectedMood] = useState(null);

  const moods = [
    { emoji: '😀', label: 'Happy' },
    { emoji: '😭', label: 'Sad' },
    { emoji: '😡', label: 'Angry' },
    { emoji: '🤗', label: 'Excited' },
    { emoji: '😱', label: 'Shocked' },
    { emoji: '😞', label: 'Disappointed' },
    { emoji: '🥳', label: 'Celebrating' },
    { emoji: '🤒', label: 'Sick' },
    { emoji: '🥺', label: 'Pleading' },
    { emoji: '😵', label: 'Dizzy' },
    { emoji: '🤬', label: 'Furious' },
    { emoji: '😓', label: 'Sweaty' },
    { emoji: '😨', label: 'Scared' },
    { emoji: '🥴', label: 'Woozy' },
    { emoji: '🤯', label: 'Mind-blown' },
    { emoji: '🤢', label: 'Nauseous' },
    { emoji: '😤', label: 'Frustrated' },
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    // Optionally, handle the mood selection (e.g., send to backend)
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Mood Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Hello, Tong</h1>
        <p className={styles.description}>How are you feeling today?</p>

        <div className={styles.moodGrid}>
          {moods.map((mood, index) => (
            <button
              key={index}
              className={`${styles.moodButton} ${
                selectedMood?.emoji === mood.emoji ? styles.selected : ''
              }`}
              onClick={() => handleMoodSelect(mood)}
            >
              {mood.emoji}
            </button>
          ))}
        </div>

        {selectedMood && (
          <p className={styles.selectedMood}>
            You selected: <strong>{selectedMood.label}</strong>
          </p>
        )}
      </main>
    </div>
  );
}