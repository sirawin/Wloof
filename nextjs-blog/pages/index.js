// pages/index.js

import Head from 'next/head';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [selectedMood, setSelectedMood] = useState(null);

  const moods = [
    { name: 'Happy', color: '#FFD700' },
    { name: 'Sad', color: '#1E90FF' },
    { name: 'Angry', color: '#FF4500' },
    { name: 'Excited', color: '#32CD32' },
    { name: 'Anxious', color: '#8A2BE2' },
    // Add more moods as needed
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    // Optionally, handle the mood selection (e.g., send to backend)
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Wloof - Mood Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Welcome to Wloof!</h1>

        <p className={styles.description}>How are you feeling today?</p>

        <div className={styles.moodContainer}>
          {moods.map((mood, index) => (
            <button
              key={index}
              className={`${styles.moodButton} ${
                selectedMood?.name === mood.name ? styles.selected : ''
              }`}
              style={{ backgroundColor: mood.color }}
              onClick={() => handleMoodSelect(mood)}
            >
              {mood.name}
            </button>
          ))}
        </div>

        {selectedMood && (
          <p className={styles.selectedMood}>
            You are feeling: <strong>{selectedMood.name}</strong>
          </p>
        )}

        <div className={styles.grid}>
          {/* Existing grid content can remain or be removed */}
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
