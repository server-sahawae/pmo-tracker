const { v4 } = require("uuid");
const categories = [
  "Seminar",
  "Training",
  "Rapat",
  "Forum",
  "Expo",
  "Undangan",
  "Festival",
  "FGD",
];

const result = categories.map((el) => {
  return { id: v4(), name: el };
});

console.log(result);
