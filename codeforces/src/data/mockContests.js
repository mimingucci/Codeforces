export const upcomingContests = [
  {
    id: 1,
    name: "Codeforces Round #888 (Div. 2)",
    type: "ICPC",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    durationHours: 2.5,
    participantCount: 0,
    description: "Regular ICPC-style contest for Div. 2",
    registered: false
  },
  {
    id: 2,
    name: "Educational Codeforces Round 159",
    type: "ICPC",
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    durationHours: 2,
    participantCount: 0,
    description: "Educational round with problems on specific topics",
    registered: true
  },
  {
    id: 3,
    name: "IOI Training Contest #45",
    type: "IOI",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    durationHours: 5,
    participantCount: 0,
    description: "IOI-style contest with subtasks",
    registered: false
  },
  {
    id: 4,
    name: "Custom Programming Contest",
    type: "CUSTOM",
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    durationHours: 3,
    participantCount: 0,
    description: "Custom format contest with special rules",
    registered: false
  },
  {
    id: 5,
    name: "Codeforces Round #889 (Div. 2)",
    type: "SYSTEM",
    startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    durationHours: 2,
    participantCount: 0,
    description: "Regular rated contest for Div. 2",
    registered: false
  },
  {
    id: 6,
    name: "Codeforces Round #890 (Div. 1)",
    type: "SYSTEM",
    startTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    durationHours: 2.5,
    participantCount: 0,
    description: "Regular rated contest for Div. 1",
    registered: false
  }
];

export const pastContests = [
  {
    id: 101,
    name: "Codeforces Round #887 (Div. 2)",
    type: "ICPC",
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    durationHours: 2,
    participantCount: 12543,
    winner: "tourist"
  },
  // Add more past contests...
];

export const mockContestDetail = {
  id: 1,
  name: "Codeforces Round #888 (Div. 2)",
  type: "SYSTEM",
  startTime: "2025-04-28T13:00:00Z",
  endTime: "2025-04-28T15:00:00Z",
  durationHours: 2,
  problems: [
    {
      id: "A",
      name: "Make it Zero",
      tags: ["math", "implementation"],
      solvedBy: 5432
    },
    {
      id: "B",
      name: "Array Cancellation",
      tags: ["greedy", "implementation"],
      solvedBy: 4321
    },
    {
      id: "C",
      name: "Good Subarrays",
      tags: ["dp", "math"],
      solvedBy: 3210
    },
    // Add more problems...
  ],
  participants: [
    // Add participant data for leaderboard...
  ]
};