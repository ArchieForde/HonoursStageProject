const questions = [
  {
    id: 1,
    question: "Which platform do you primarily play games on?",
    type: "single",
    options: [
      "PC",
      "PlayStation",
      "Xbox",
      "Nintendo Switch",
      "Mobile"
    ],
    key: "platform"
  },
  {
    id: 2,
    question: "Which game genres do you enjoy the most?",
    type: "multiple",
    maxSelections: 3,
    options: [
      "Action",
      "Adventure",
      "RPG",
      "Shooter",
      "Strategy",
      "Simulation",
      "Sports",
      "Indie",
      "Horror"
    ],
    key: "genres"
  },
  {
    id: 3,
    question: "What type of gameplay pace do you prefer?",
    type: "single",
    options: [
      "Fast-paced and intense",
      "Balanced",
      "Slow and strategic"
    ],
    key: "pace"
  },
  {
    id: 4,
    question: "How challenging do you like your games to be?",
    type: "scale",
    scale: [1, 2, 3, 4, 5],
    labels: {
      1: "Very casual",
      5: "Very difficult"
    },
    key: "difficulty"
  },
  {
    id: 5,
    question: "How open are you to trying new genres?",
    type: "scale",
    scale: [1, 2, 3, 4, 5],
    labels: {
      1: "Not open",
      5: "Very open"
    },
    key: "exploration"
  }
];

export default questions;
