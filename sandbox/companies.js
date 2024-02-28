// const companies = require("../data/comps.json");
const { v4 } = require("uuid");
const fs = require("fs");
const kadinProv = [
  { name: "Kadin Aceh", chief: "Ir. H. Muhammad Iqbal" },
  { name: "Kadin Sumatera Utara", chief: "Firsal Ferial Mutyara" },
  { name: "Kadin Sumatera Barat", chief: "Ir. H. Buchari Bachter, MT" },
  { name: "Kadin Riau", chief: "Masuri" },
  { name: "Kadin Kepulauan Riau", chief: "Akhmad Ma’ruf Maulana" },
  { name: "Kadin Jambi", chief: "H. Usman Sulaiman" },
  { name: "Kadin Bengkulu", chief: "Ahmad Irfansyah" },
  { name: "Kadin Sumatera Selatan", chief: "H. Affandi Udji, SE, MM" },
  { name: "Kadin Bangka-Belitung", chief: "Ir. Thomas Jusman, MM" },
  { name: "Kadin Lampung", chief: "Dr. H. Muhammad Kadafi, SH, MH" },
  { name: "Kadin Banten ", chief: "H. Mochamad Azzari Jayabaya" },
  { name: "Kadin DKI Jakarta ", chief: "Diana Dew" },
  { name: "Kadin Jawa Barat", chief: "Drs. H. Cucu Sutara, MM" },
  { name: "Kadin Jawa Tengah", chief: "Harry Nuryanto Soediro, SE, MM" },
  { name: "Kadin DI Yogyakarta", chief: "GKR. Mangkubumi" },
  { name: "Kadin Jawa Timur", chief: "Adik Dwi Putranto, SH" },
  { name: "Kadin Bali", chief: "I Made Ariandi" },
  { name: "Kadin Kalimantan Barat", chief: "Arya Rizqi Darsono" },
  { name: "Kadin Kalimantan Tengah", chief: "Rahmat Nasution Hamka" },
  { name: "Kadin Kalimantan Selatan", chief: "Shinta Laksmi Dewi, SE" },
  { name: "Kadin Kalimantan Timur", chief: "Dayang Donna Faroek" },
  { name: "Kadin Kalimantan Utara", chief: "Kilit Laing" },
  { name: "Kadin Sulawesi Barat", chief: "H. Muh. Taslim Tammauni" },
  { name: "Kadin Sulawesi Tengah", chief: "H. M. Nur DG. Rahmatu, SE" },
  {
    name: "Kadin Sulawesi Selatan",
    chief: "H. Andi Iwan Darmawan Aras,SE,M.Si",
  },
  { name: "Kadin Sulawesi Tenggara", chief: "Anton Timbang" },
  { name: "Kadin Gorontalo", chief: "Muhalim Djafar Litty" },
  { name: "Kadin Sulawesi Utara", chief: "Rio Dondokambey" },
  { name: "Kadin Nusa Tenggara Barat", chief: "H. Faurani, SE, MBA" },
  { name: "Kadin Nusa Tenggara Timur", chief: "Bobby Lianto" },
  { name: "Kadin Maluku", chief: "Muhammad Armin Syarif Latuconsina" },
  { name: "Kadin Maluku Utara", chief: "Adam Marsaoly" },
  { name: "Kadin Papua", chief: "Ronald Antonio, S.Sos" },
  { name: "Kadin Papua Barat", chief: "Michael Wattimena" },
];
// console.log(companies.length);
// const newComp = [...new Set(companies)].map((el) => {
//   return {
//     id: v4(),
//     name: el,
//   };
// });
// console.log(newComp.length);
// fs.writeFileSync("../data/Companies.json", JSON.stringify(newComp));

const newKadinProv = kadinProv.map((el) => {
  return { id: v4(), ...el };
});
console.log(newKadinProv[0]);
fs.writeFileSync("../data/kadinprov.json", JSON.stringify(newKadinProv));
