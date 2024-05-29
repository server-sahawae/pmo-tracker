const prjAct = require("../data/storage/projectactivities.json");
const Categories = require("../data/category.json");
const { v4 } = require("uuid");
const fs = require("fs");
const Companies = require("../data/Companies.json");
const KadinProv = require("../data/kadinprov.json");
const Kadindo = require("../data/partners.json");
const Programs = require("../data/programs.json");
const ProgramIndicators = require("../data/ProgramIndicators.json");
const moment = require("moment");

const functionProgramIndicators = (kadindoId, ProjectId) => {
  // console.log(kadindoId);
  const filteredPrograms = Programs.filter(
    (filter) => filter.PartnerId == kadindoId
  );
  const filteredProgramsIndicators = ProgramIndicators.filter((fil) => {
    for (let index = 0; index < filteredPrograms.length; index++) {
      // console.log(filteredPrograms[index].);
      if (fil.ProgramId == filteredPrograms[index].id && !fil.deletedAt) {
        return true;
      }
    }
    return false;
  });
  const numberOfIndicators = Math.ceil(
    Math.random() * filteredProgramsIndicators.length
  );

  const indicatorsTaken = [];
  for (let i = 0; i < numberOfIndicators; i++) {
    let x = Math.floor(Math.random() * filteredProgramsIndicators.length);

    if (!i) {
      indicatorsTaken.push(filteredProgramsIndicators[x]);
    } else {
      while (
        indicatorsTaken.filter(
          (fil) => fil.id == filteredProgramsIndicators[x].id
        ).length
      ) {
        x = Math.floor(Math.random() * filteredProgramsIndicators.length);
      }
      indicatorsTaken.push(filteredProgramsIndicators[x]);
    }
  }
  return indicatorsTaken.map((el) => {
    return {
      ProgramId: el.ProgramId,
      ProgramIndicatorId: el.id,
      ProjectId,
      id: v4(),
    };
  });
};

// console.log(functionProgramIndicators("cce71a56-ce05-42fc-8cb2-13e2941c2da8"));
const Projects = [];
const Activities = [];
let PartnerProject = [];
let ProjectProgramIndicator = [];

//Kadindo
// console.log(arr.length);
const PartnerProjectGenerator = (maxSynergy, arr, ProjectId, owner) => {
  const result = [];
  const numberOfLoop = Math.floor(Math.random() * (maxSynergy - 1 + 1) + 1);
  for (let i = 0; i < numberOfLoop; i++) {
    if (!i) {
      result.push({
        id: v4(),
        PartnerId: arr[Math.floor(arr.length * Math.random())].id
          ? arr[Math.floor(arr.length * Math.random())].id
          : arr[Math.floor(arr.length * Math.random())].id,
        ProjectId,
        isOwner: owner,
      });
    } else {
      let x = arr[Math.floor(arr.length * Math.random())];

      while (result.filter((fil) => fil.PartnerId == x.id).length) {
        x = arr[Math.floor(arr.length * Math.random())];
      }
      result.push({
        PartnerId: arr[Math.floor(arr.length * Math.random())].id
          ? arr[Math.floor(arr.length * Math.random())].id
          : arr[Math.floor(arr.length * Math.random())].id,
        ProjectId,
        isOwner: 0,
        id: v4(),
      });
    }
    // console.log(result);
  }
  return result;
};

prjAct.forEach((proj) => {
  const ProjectId = v4();
  const resPartnerProjectKadindo = PartnerProjectGenerator(
    5,
    Kadindo,
    ProjectId,
    1
  );
  let resPartnerProjectKadinda = [];
  if (Math.floor(Math.random() * 2))
    resPartnerProjectKadinda = PartnerProjectGenerator(
      9,
      KadinProv,
      ProjectId,
      0
    );

  let resPartnerProjectComp = [];
  if (Math.floor(Math.random() * 2))
    resPartnerProjectComp = PartnerProjectGenerator(5, Companies, ProjectId, 0);

  resPartnerProjectKadindo.forEach((element) => {
    ProjectProgramIndicator = [
      ...ProjectProgramIndicator,
      ...functionProgramIndicators(element.PartnerId, ProjectId),
    ];
  });

  PartnerProject = [
    ...PartnerProject,
    ...resPartnerProjectKadinda,
    ...resPartnerProjectKadindo,
    ...resPartnerProjectComp,
  ];
  const proStart = new Date(
    +new Date(
      moment(new Date(`2024-12-1`))
        .startOf("year")
        .format("YYYY-MM-DD HH:mm:ss")
    ) +
      Math.random() *
        (new Date(
          moment(new Date(`2024-12-1`))
            .endOf("year")
            .format("YYYY-MM-DD HH:mm:ss")
        ) -
          new Date(
            moment(new Date(`2024-12-1`))
              .startOf("year")
              .format("YYYY-MM-DD HH:mm:ss")
          ))
  );

  const proEnd = new Date(proStart);
  proEnd.setDate(proEnd.getDate() + Math.ceil(Math.random() * 5));

  Projects.push({
    id: ProjectId,
    title: proj.ProjectName,
    CategoryId: Categories[Math.floor(Categories.length * Math.random())].id,
    location: proj.venue,
    start: proStart,
    end: proEnd,
  });
  let projScore = 100;
  proj.activities.forEach((act) => {
    const ActId = v4();
    const acStart = new Date(
      +new Date(
        moment(new Date(`2024-12-1`))
          .startOf("year")
          .format("YYYY-MM-DD HH:mm:ss")
      ) +
        Math.random() *
          (new Date(
            moment(new Date(`2024-12-1`))
              .endOf("year")
              .format("YYYY-MM-DD HH:mm:ss")
          ) -
            new Date(
              moment(new Date(`2024-12-1`))
                .startOf("year")
                .format("YYYY-MM-DD HH:mm:ss")
            ))
    );

    const acEnd = new Date(acStart);
    acEnd.setDate(acEnd.getDate() + Math.ceil(Math.random() * 5));

    let actScore = 0;
    if (projScore) {
      actScore = Math.ceil(
        Math.random() * (projScore > 50 ? 40 - 1 + 1 : projScore - 1 + 1) + 1
      );

      projScore = projScore - actScore;
    } else actScore = 0;
    Activities.push({
      id: ActId,
      PartnerId:
        resPartnerProjectKadindo[
          Math.floor(Math.random() * resPartnerProjectKadindo.length)
        ].PartnerId,
      title: act.activityName,
      CategoryId: Categories[Math.floor(Categories.length * Math.random())].id,
      location: proj.venue,
      start: acStart,
      end: acEnd,
      ProjectId,
      score: actScore,
      summary:
        Math.ceil(Math.random() * 200) % 2 &&
        new Date(act.startTime).getTime() > new Date().getTime()
          ? act.summary
          : null,
    });
  });
});

console.log(
  JSON.stringify(
    new Date(
      +new Date(
        moment(new Date(`2024-12-1`))
          .startOf("year")
          .format("YYYY-MM-DD HH:mm:ss")
      ) +
        Math.random() *
          (new Date(
            moment(new Date(`2024-12-1`))
              .endOf("year")
              .format("YYYY-MM-DD HH:mm:ss")
          ) -
            new Date(
              moment(new Date(`2024-12-1`))
                .startOf("year")
                .format("YYYY-MM-DD HH:mm:ss")
            ))
    )
  )
);
fs.writeFileSync(
  "../data/projects/Projects.json",
  JSON.stringify(Projects, null, 2)
);
fs.writeFileSync(
  "../data/projects/Activities.json",
  JSON.stringify(Activities, null, 2)
);
fs.writeFileSync(
  "../data/projects/PartnerProject.json",
  JSON.stringify(PartnerProject, null, 2)
);
fs.writeFileSync(
  "../data/projects/ProjectProgramIndicator.json",
  JSON.stringify(ProjectProgramIndicator, null, 2)
);

// const Projects = [];
// const Activities = [];
// let PartnerProject = [];
// let ProjectProgramIndicator = [];
