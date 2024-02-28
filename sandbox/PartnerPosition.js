const fs = require("fs");
const { v4 } = require("uuid");
const user = require("../data/NewUser.json");
const position = require("../data/position.json");
const PartnerPosition = require("../data/PartnerPosition.json");
const result = user.map((us) => {
  const newRes = PartnerPosition.filter((fil) => {
    return fil.PartnerId == us.PartnerId && fil.PositionId == us.PositionId;
  })[0];
  // console.log(newRes);
  delete us.PartnerId;
  delete us.PositionId;
  return { ...us, PartnerPositionId: newRes.id };
});

// const result = PartnerPosition.map((el) => {
//   return { ...el, id: v4() };
// });
console.log(result[0]);
// const getposition = user.map((el) => el.position);

// console.log(getposition.length);
// const distinctPos = [...new Set(getposition)].map((el) => {
//   return { id: v4(), name: el };
// });

// fs.writeFileSync("../data/NewUser.json", JSON.stringify(result));
// console.log(distinctPos);
