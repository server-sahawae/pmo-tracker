// THIS SCRIPT STIL NOT WORKING

const { v4 } = require("uuid");
const users = require("../data/NewUser.json");
const partners = require("../data/partners.json");
const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const isDuplicate = (array, tester) => {
  let res = false;

  const filtered = array.filter((fil) => fil.UserId + fil.PartnerId == tester);
  if (filtered.length > 1) res = true;
  return res;
};

// console.log(randomIntFromInterval(1, 5));
const result = [];
const assinments = users.forEach((el, index) => {
  const numberAssigned = randomIntFromInterval(1, 5);
  for (let index = 0; index < numberAssigned; index++) {
    let newPartner = partners[randomIntFromInterval(0, partners.length - 1)].id;
    while (isDuplicate(result, newPartner)) {
      newPartner = partners[randomIntFromInterval(0, partners.length - 1)].id;
    }
    const newAssigned = {
      id: v4(),
      UserId: el.id,
      PartnerId: newPartner,
      ProgramId: null,
      ProjectId: null,
      ActivityId: null,
      createdBy: "6dace56b-2cc7-441b-9eb0-f12a5f51d61a",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // console.log(el.id);
    result.push(newAssigned);
  }
});

console.log(JSON.stringify(result));
