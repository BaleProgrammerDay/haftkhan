import React, { useEffect, useState } from "react";
import { API } from "../../api/api";

// Mock data similar to GetAllUsersResponse
const mockUsers = [
  {
    username: "rostam",
    total_score: 120,
    solved_questions: [
      { question_id: 1, solved_at: "2025-05-01T10:00:00Z", score: 10 },
      { question_id: 2, solved_at: "2025-01-02T10:00:00Z", score: 20 },
      { question_id: 3, solved_at: "2025-03-03T10:00:00Z", score: 90 },
    ],
  },
  {
    username: "rakhsh",
    total_score: 110,
    solved_questions: [
      { question_id: 1, solved_at: "2025-09-01T10:00:00Z", score: 10 },
      { question_id: 2, solved_at: "2025-09-02T10:00:00Z", score: 20 },
      { question_id: 3, solved_at: "2025-09-03T10:00:00Z", score: 80 },
    ],
  },
  {
    username: "bruce",
    total_score: 90,
    solved_questions: [
      { question_id: 1, solved_at: "2025-09-01T10:00:00Z", score: 10 },
      { question_id: 2, solved_at: "2025-09-02T10:00:00Z", score: 20 },
      { question_id: 3, solved_at: "2025-09-03T10:00:00Z", score: 60 },
    ],
  },
  {
    username: "amin",
    total_score: 80,
    solved_questions: [
      { question_id: 1, solved_at: "2025-09-01T10:00:00Z", score: 10 },
      { question_id: 2, solved_at: "2025-09-02T10:00:00Z", score: 20 },
      { question_id: 3, solved_at: "2025-09-13T10:00:00Z", score: 50 },
    ],
  },
  {
    username: "patrick",
    total_score: 60,
    solved_questions: [
      { question_id: 1, solved_at: "2025-09-01T10:00:00Z", score: 10 },
      { question_id: 2, solved_at: "2025-09-02T10:00:00Z", score: 20 },
      { question_id: 3, solved_at: "2025-09-03T10:00:00Z", score: 30 },
    ],
  },
];

export const Scoreboard = () => {
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    API.getUsers()
      .then((res) => {
        if (res && res.users && Array.isArray(res.users) && isMounted) {
          setUsers(res.users);
        }
      })
      .catch(() => {
        // fallback to mockUsers
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sort users by total_score ascending (lowest on top)
  const sortedUsers = [...users].sort((a, b) => a.total_score - b.total_score);

  // Sort users by the date of their latest solved question (oldest last solved on top)
  const sortedByLatestSolved = [...users].sort((a, b) => {
    const aLast =
      a.solved_questions && a.solved_questions.length
        ? new Date(
            a.solved_questions[a.solved_questions.length - 1].solved_at
          ).getTime()
        : 0;
    const bLast =
      b.solved_questions && b.solved_questions.length
        ? new Date(
            b.solved_questions[b.solved_questions.length - 1].solved_at
          ).getTime()
        : 0;
    // If no solved questions, treat as oldest
    if (!aLast && !bLast) return 0;
    if (!aLast) return -1;
    if (!bLast) return 1;
    return aLast - bLast;
  });

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
      <h2 style={{ textAlign: "center", marginBottom: 16, color: "black" }}>
        Scoreboard
      </h2>
      {loading ? (
        <div style={{ textAlign: "center", color: "black" }}>Loading...</div>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "black",
              marginBottom: 32,
            }}
          >
            <caption
              style={{
                captionSide: "top",
                color: "black",
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              By Score
            </caption>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th
                  style={{
                    padding: 8,
                    borderBottom: "1px solid #ddd",
                    color: "black",
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    padding: 8,
                    borderBottom: "1px solid #ddd",
                    color: "black",
                  }}
                >
                  Username
                </th>
                <th
                  style={{
                    padding: 8,
                    borderBottom: "1px solid #ddd",
                    color: "black",
                  }}
                >
                  Score
                </th>
                <th
                  style={{
                    padding: 8,
                    borderBottom: "1px solid #ddd",
                    color: "black",
                  }}
                >
                  Solved Questions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, idx) => (
                <tr
                  key={user.username}
                  style={{
                    background: idx % 2 ? "#fff" : "#f9fafb",
                    color: "black",
                  }}
                >
                  <td
                    style={{ padding: 8, textAlign: "center", color: "black" }}
                  >
                    {idx + 1}
                  </td>
                  <td style={{ padding: 8, color: "black" }}>
                    {user.username}
                  </td>
                  <td
                    style={{ padding: 8, textAlign: "center", color: "black" }}
                  >
                    {user.total_score}
                  </td>
                  <td
                    style={{ padding: 8, textAlign: "center", color: "black" }}
                  >
                    {user.solved_questions && user.solved_questions.length
                      ? `${user.solved_questions.length} (` +
                        user.solved_questions
                          .map((q) => `q${q.question_id}`)
                          .join(", ") +
                        ")"
                      : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "black",
            }}
          >
            <caption
              style={{
                captionSide: "top",
                color: "black",
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              By Latest Solved (Oldest on Top)
            </caption>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th
                  style={{
                    padding: 8,
                    borderBottom: "1px solid #ddd",
                    color: "black",
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    padding: 8,
                    borderBottom: "1px solid #ddd",
                    color: "black",
                  }}
                >
                  Username
                </th>
                <th
                  style={{
                    padding: 8,
                    borderBottom: "1px solid #ddd",
                    color: "black",
                  }}
                >
                  Score
                </th>
                <th
                  style={{
                    padding: 8,
                    borderBottom: "1px solid #ddd",
                    color: "black",
                  }}
                >
                  Solved Questions
                </th>
                <th
                  style={{
                    padding: 8,
                    borderBottom: "1px solid #ddd",
                    color: "black",
                  }}
                >
                  Last Solved
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedByLatestSolved.map((user, idx) => {
                let lastSolved = "-";
                if (user.solved_questions && user.solved_questions.length) {
                  // Find the solved_questions entry with the latest solved_at date
                  const latest = user.solved_questions.reduce((max, q) => {
                    return new Date(q.solved_at) > new Date(max.solved_at)
                      ? q
                      : max;
                  }, user.solved_questions[0]);
                  const now = Date.now();
                  const solvedAt = new Date(latest.solved_at).getTime();
                  const minutesAgo = Math.floor((now - solvedAt) / 60000);
                  lastSolved = `(q${latest.question_id}: ${minutesAgo} minutes ago)`;
                }
                return (
                  <tr
                    key={user.username}
                    style={{
                      background: idx % 2 ? "#fff" : "#f9fafb",
                      color: "black",
                    }}
                  >
                    <td
                      style={{
                        padding: 8,
                        textAlign: "center",
                        color: "black",
                      }}
                    >
                      {idx + 1}
                    </td>
                    <td style={{ padding: 8, color: "black" }}>
                      {user.username}
                    </td>
                    <td
                      style={{
                        padding: 8,
                        textAlign: "center",
                        color: "black",
                      }}
                    >
                      {user.total_score}
                    </td>
                    <td
                      style={{
                        padding: 8,
                        textAlign: "center",
                        color: "black",
                      }}
                    >
                      {user.solved_questions && user.solved_questions.length
                        ? `${user.solved_questions.length} (` +
                          user.solved_questions
                            .map((q) => `q${q.question_id}`)
                            .join(", ") +
                          ")"
                        : 0}
                    </td>
                    <td
                      style={{
                        padding: 8,
                        textAlign: "center",
                        color: "black",
                      }}
                    >
                      {lastSolved}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
