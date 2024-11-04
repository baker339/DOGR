// pages/leaderboard.tsx

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { FaMedal, FaTrophy } from "react-icons/fa";

interface User {
  _id: string;
  userId: string;
  name: string;
  following?: string[]; // Include following users
}

interface Post {
  userId: string;
  hotDogsConsumed: number;
  createdAt: Date;
}

enum FilterType {
  MONTH_TO_DATE = "month",
  YEAR_TO_DATE = "year",
  ALL_TIME = "all-time",
}

export default function Leaderboard() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [leaderboard, setLeaderboard] = useState<
    { user: User; hotDogsConsumed: number }[]
  >([]);
  const [followedLeaderboard, setFollowedLeaderboard] = useState<
    { user: User; hotDogsConsumed: number }[]
  >([]);
  const [filterType, setFilterType] = useState<FilterType>(
    FilterType.YEAR_TO_DATE
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userResponse = await fetch("/api/users");
        const usersData = await userResponse.json();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const postResponse = await fetch("/api/posts");
        const postsData = await postResponse.json();
        setPosts(postsData);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };

    if (!loading && user) {
      fetchUsers();
      fetchPosts();
    }
  }, [user, loading]);

  useEffect(() => {
    if (users.length > 0 && posts.length > 0) {
      const filteredPosts = posts.filter((post) => {
        switch (filterType) {
          case FilterType.YEAR_TO_DATE:
            return (
              new Date(post.createdAt).getFullYear() ===
              new Date().getFullYear()
            );
          case FilterType.MONTH_TO_DATE:
            const now = new Date();
            return (
              new Date(post.createdAt).getFullYear() === now.getFullYear() &&
              new Date(post.createdAt).getMonth() === now.getMonth()
            );
          default:
            return true;
        }
      });

      const leaderboardData = users.map((user) => {
        const hotDogsConsumed = filteredPosts
          .filter((post) => post.userId === user.userId)
          .reduce((sum, post) => sum + post.hotDogsConsumed, 0);
        return { user, hotDogsConsumed };
      });

      const sortedLeaderboard = leaderboardData.sort(
        (a, b) => b.hotDogsConsumed - a.hotDogsConsumed
      );

      // Include the current user and followed users in the followed leaderboard
      const followedUsersIds =
        users?.filter((u) => u.userId === user.uid)[0].following || [];
      const followedUsersSet = new Set(followedUsersIds);

      const followedLeaderboardData = sortedLeaderboard.filter((entry) => {
        return (
          entry.user.userId === user.uid ||
          followedUsersSet.has(entry.user.userId)
        );
      });

      setLeaderboard(sortedLeaderboard);
      setFollowedLeaderboard(followedLeaderboardData);
    }
  }, [users, posts, filterType, user?.following]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <div className="mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          className="p-2 bg-white border border-gray-300 rounded"
        >
          <option value={FilterType.MONTH_TO_DATE}>Month to Date</option>
          <option value={FilterType.YEAR_TO_DATE}>Year to Date</option>
          <option value={FilterType.ALL_TIME}>All Time</option>
        </select>
      </div>

      {/* Followed Users Leaderboard */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Your Circle</h2>
        <table className="w-full table-auto mb-4">
          <thead>
            <tr className="text-left bg-gray-200">
              <th className="p-2">Rank</th>
              <th className="p-2">User</th>
              <th className="p-2">Hotdogs Eaten</th>
            </tr>
          </thead>
          <tbody>
            {followedLeaderboard.map((entry, index) => (
              <tr key={entry.user._id} className="border-b">
                <td className="p-2">
                  {index === 0 && (
                    <FaTrophy className="inline mr-1 text-yellow-500" />
                  )}
                  {index === 1 && (
                    <FaMedal className="inline mr-1 text-gray-500" />
                  )}
                  {index === 2 && (
                    <FaMedal className="inline mr-1 text-gray-400" />
                  )}
                  {index + 1}
                </td>
                <td className="p-2">{entry.user.name}</td>
                <td className="p-2">
                  {parseInt(entry.hotDogsConsumed.toString())}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Global Leaderboard */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Global Leaderboard</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-200">
              <th className="p-2">Rank</th>
              <th className="p-2">User</th>
              <th className="p-2">Hotdogs Eaten</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.user._id} className="border-b">
                <td className="p-2">
                  {index === 0 && (
                    <FaTrophy className="inline mr-1 text-yellow-500" />
                  )}
                  {index === 1 && (
                    <FaMedal className="inline mr-1 text-gray-500" />
                  )}
                  {index === 2 && (
                    <FaMedal className="inline mr-1 text-gray-400" />
                  )}
                  {index + 1}
                </td>
                <td className="p-2">{entry.user.name}</td>
                <td className="p-2">
                  {parseInt(entry.hotDogsConsumed.toString())}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
