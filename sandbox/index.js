const { v4 } = require("uuid");

const user = [
  { email: "sabiq@kadin.id" },
  { email: "ayu.kemalasari@kadin.id" },
  { email: "hauralia.rahmadanti@kadin.id" },
  { email: "doni.priambodo@kadin.id" },
  { email: "nabil.ghazi@kadin.id" },
  { email: "monica.balqis@kadin.id" },
  { email: "christian.pareira@kadin.id" },
  { email: "kevin.daniel@kadin.id" },
  { email: "dio.mahendra@kadin.id" },
  { email: "kreshna.wiryatama@kadin.id" },
  { email: "samuelkharish@kadin.id" },
];

const result = user.map((el) => {
  return {
    id: v4(),
    ...el,
    PartnerId: "0f43f3b4-7d73-4264-9db6-102d870a445c",
    UserLevelId: "72372ccb-a973-4413-8d8f-2ffda25b78580",
  };
});

console.log(result);
