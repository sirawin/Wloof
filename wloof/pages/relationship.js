// pages/relationship.js

"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

export default function Relationship() {
  const [profiles, setProfiles] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { roomId } = router.query; // Assuming roomId is passed as a query parameter

  const mockFriendsList = [
    { id: 1, name: "Alice Johnson", color: "bg-red-500" },
    { id: 2, name: "Bob Smith", color: "bg-green-500" },
    { id: 3, name: "Charlie Williams", color: "bg-blue-500" },
    { id: 4, name: "Diana Prince", color: "bg-yellow-500" },
    { id: 5, name: "Ethan Hunt", color: "bg-purple-500" },
    // Add more mock friends as needed
  ];

  useEffect(() => {
    if (!roomId) {
      // If no roomId is available, use mock-up data
      setProfiles(
        mockFriendsList.map((friend) => ({
          userId: friend.id.toString(),
          displayName: friend.name,
          color: friend.color,
        }))
      );
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch member IDs
        const resMembers = await fetch(`/api/getGroupMembers?roomId=${roomId}`);
        const dataMembers = await resMembers.json();

        if (dataMembers.error) {
          throw new Error(dataMembers.error);
        }

        const { memberIds } = dataMembers;

        // Fetch member profiles
        const resProfiles = await fetch("/api/getMemberProfiles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId, userIds: memberIds }),
        });

        const dataProfiles = await resProfiles.json();

        if (dataProfiles.error) {
          throw new Error(dataProfiles.error);
        }

        setProfiles(dataProfiles.profiles);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Use mock-up data as fallback
        setProfiles(
          mockFriendsList.map((friend) => ({
            userId: friend.id.toString(),
            displayName: friend.name,
            color: friend.color,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId]);

  const handleSelectFriend = (userId) => {
    setSelectedFriends((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleSubmit = () => {
    // Handle the submission of selected friends
    console.log("Selected Friends:", selectedFriends);
    // You can send this data to your backend or process it as needed
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8">
      <Head>
        <title>Select Close Friends</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="w-full max-w-2xl px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Select Your Close Friends
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profiles.map((profile) => (
            <div
              key={profile.userId}
              className={cn(
                "flex items-center p-4 border rounded-md cursor-pointer",
                selectedFriends.includes(profile.userId)
                  ? "border-primary bg-primary/10"
                  : "border-border"
              )}
              onClick={() => handleSelectFriend(profile.userId)}
            >
              <Checkbox
                checked={selectedFriends.includes(profile.userId)}
                onCheckedChange={() => handleSelectFriend(profile.userId)}
                id={`friend-${profile.userId}`}
                className="mr-4"
              />
              <label
                htmlFor={`friend-${profile.userId}`}
                className="flex items-center cursor-pointer w-full"
              >
                {profile.pictureUrl ? (
                  <img
                    src={profile.pictureUrl}
                    alt={profile.displayName}
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                ) : (
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full mr-4",
                      profile.color || "bg-gray-300"
                    )}
                  />
                )}
                <span className="text-lg font-medium">{profile.displayName}</span>
              </label>
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