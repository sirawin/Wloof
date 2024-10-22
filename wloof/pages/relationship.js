// pages/relationship.js

"use client";

import { useState } from "react";
import Head from "next/head";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Mock-up data representing 36 friends
const friendsList = [
  { id: 1, name: "Alice Johnson", color: "bg-red-500" },
  { id: 2, name: "Bob Smith", color: "bg-green-500" },
  { id: 3, name: "Charlie Williams", color: "bg-blue-500" },
  { id: 4, name: "Diana Prince", color: "bg-yellow-500" },
  { id: 5, name: "Ethan Hunt", color: "bg-purple-500" },
  { id: 6, name: "Fiona Gallagher", color: "bg-pink-500" },
  { id: 7, name: "George Miller", color: "bg-indigo-500" },
  { id: 8, name: "Hannah Baker", color: "bg-teal-500" },
  { id: 9, name: "Ian Somerhalder", color: "bg-orange-500" },
  { id: 10, name: "Jessica Jones", color: "bg-lime-500" },
  { id: 11, name: "Kevin Hart", color: "bg-cyan-500" },
  { id: 12, name: "Laura Palmer", color: "bg-amber-500" },
  { id: 13, name: "Michael Scott", color: "bg-emerald-500" },
  { id: 14, name: "Natalie Portman", color: "bg-fuchsia-500" },
  { id: 15, name: "Oscar Wilde", color: "bg-rose-500" },
  { id: 16, name: "Penelope Cruz", color: "bg-sky-500" },
  { id: 17, name: "Quentin Tarantino", color: "bg-violet-500" },
  { id: 18, name: "Rachel Green", color: "bg-gray-500" },
  { id: 19, name: "Steve Rogers", color: "bg-red-700" },
  { id: 20, name: "Tina Fey", color: "bg-green-700" },
  { id: 21, name: "Uma Thurman", color: "bg-blue-700" },
  { id: 22, name: "Victor Hugo", color: "bg-yellow-700" },
  { id: 23, name: "Wanda Maximoff", color: "bg-purple-700" },
  { id: 24, name: "Xander Cage", color: "bg-pink-700" },
  { id: 25, name: "Yvonne Strahovski", color: "bg-indigo-700" },
  { id: 26, name: "Zachary Levi", color: "bg-teal-700" },
  { id: 27, name: "Andrew Garfield", color: "bg-orange-700" },
  { id: 28, name: "Bruce Wayne", color: "bg-lime-700" },
  { id: 29, name: "Clark Kent", color: "bg-cyan-700" },
  { id: 30, name: "Diana Ross", color: "bg-amber-700" },
  { id: 31, name: "Elliot Alderson", color: "bg-emerald-700" },
  { id: 32, name: "Frodo Baggins", color: "bg-fuchsia-700" },
  { id: 33, name: "Gandalf Grey", color: "bg-rose-700" },
  { id: 34, name: "Hermione Granger", color: "bg-sky-700" },
  { id: 35, name: "Indiana Jones", color: "bg-violet-700" },
  { id: 36, name: "James Bond", color: "bg-gray-700" },
];

export default function Relationship() {
  const [selectedFriends, setSelectedFriends] = useState([]);

  const handleSelectFriend = (friendId) => {
    setSelectedFriends((prevSelected) => {
      if (prevSelected.includes(friendId)) {
        return prevSelected.filter((id) => id !== friendId);
      } else {
        return [...prevSelected, friendId];
      }
    });
  };

  const handleSubmit = () => {
    // Handle the submission of selected friends
    console.log("Selected Friends:", selectedFriends);
    // You can send this data to your backend or process it as needed
  };

  // Function to get the first name
  const getFirstName = (fullName) => {
    return fullName.split(" ")[0];
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8">
      <Head>
        <title>Select Close Friends</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="w-full max-w-4xl px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Select Your Close Friends
        </h1>

        <div className="grid grid-cols-6 sm:grid-cols-8 gap-4">
          {friendsList.map((friend) => (
            <div
              key={friend.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleSelectFriend(friend.id)}
            >
              <div
                className={cn(
                  "relative",
                  selectedFriends.includes(friend.id)
                    ? "ring-4 ring-primary rounded-full"
                    : ""
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-bold",
                    friend.color
                  )}
                >
                  {/* Display initials or icons if needed */}
                </div>
                {selectedFriends.includes(friend.id) && (
                  <div className="absolute bottom-0 right-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 5.707 8.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {/* First name label */}
              <span className="mt-1 text-xs text-center">
                {getFirstName(friend.name)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button onClick={handleSubmit}>Confirm Selection</Button>
        </div>
      </main>
    </div>
  );
}