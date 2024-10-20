// pages/leaderboard.tsx

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { FaMedal, FaTrophy } from "react-icons/fa"; // Importing icons

interface User {
  _id: string;
  userId: string;
  name: string;
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
  const [filterType, setFilterType] = useState<FilterType>(
    FilterType.YEAR_TO_DATE
  );

  // Fetch users and posts when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userResponse = await fetch("/api/users"); // Adjust this endpoint if necessary
        const usersData = await userResponse.json();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const postResponse = await fetch("/api/posts"); // Fetch the posts data
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

  // Update leaderboard when users and posts are fetched
  useEffect(() => {
    if (users.length > 0 && posts.length > 0) {
      let filteredPosts: Post[];
      switch (filterType) {
        case FilterType.YEAR_TO_DATE:
          filteredPosts = posts.filter((post) => {
            return (
              new Date(post.createdAt).getFullYear() ===
              new Date().getFullYear()
            );
          });
          break;
        case FilterType.MONTH_TO_DATE:
          filteredPosts = posts.filter(
            (post) =>
              new Date(post.createdAt).getFullYear() ===
                new Date().getFullYear() &&
              new Date(post.createdAt).getMonth() === new Date().getMonth()
          );
          break;
        default:
          filteredPosts = posts;
          break;
      }
      const leaderboardData = users.map((user) => {
        const hotDogsConsumed = filteredPosts
          .filter((post) => post.userId === user.userId)
          .reduce(
            (sum: number, post) =>
              parseInt(sum.toString()) +
              parseInt(post.hotDogsConsumed.toString()),
            0
          );
        return { user, hotDogsConsumed };
      });

      // Sort the leaderboard by hotDogsConsumed in descending order
      const sortedLeaderboard = leaderboardData.sort(
        (a, b) => b.hotDogsConsumed - a.hotDogsConsumed
      );
      setLeaderboard(sortedLeaderboard);
    }
  }, [users, posts, filterType]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or message while auth is loading
  }

  if (!user) return null; // If the user is not logged in and not loading, prevent rendering

  return (
    <div className="flex flex-col min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      {/* Filter Selection */}
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
              <td className="p-2">{entry.hotDogsConsumed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
