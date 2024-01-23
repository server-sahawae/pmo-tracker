const pengurus = require("../data/PengurusKadindo.json");
const partners = require("../data/partners.json");
const fs = require("fs");
const { v4 } = require("uuid");
const number = 1;
// console.log(pengurus[number]);
// const newPengurus = pengurus.map((el) => {
//   const bidangId = partners.filter(
//     (fil) => fil.name.toLowerCase() == el.bidang?.toLowerCase()
//   );
//   el.PartnerId = bidangId[0]?.id;
//   return el;
// });

fs.writeFileSync(
  "../data/NewPengurusKadindo.json",
  JSON.stringify(
    pengurus.map((el) => {
      return {
        id: v4(),
        PartnerId: el.PartnerId,
        name: el.nama_lengkap,
        kta: el.no_kta,
        position: el.jabatan_lengkap,
        UserLevelId: "7b302a9a-91ed-4e98-b449-501c558d8b00",
      };
    })
  )
);
// console.log(
//   pengurus.map((el) => {
//     return {
//       id: v4(),
//       PartnerId: el.PartnerId,
//       name: el.nama_lengkap,
//       kta: el.no_kta,
//       position: el.jabatan_lengkap,
//       UserLevelId: "7b302a9a-91ed-4e98-b449-501c558d8b00",
//     };
//   }).length
// );

// const newPengurus = pengurus.filter(
//   (el) => !el.PartnerId && el.bidang != "Komite Bilateral"
// );
// fs.writeFileSync("../data/Kadindo.json", JSON.stringify(newPengurus));
