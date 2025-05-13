const sortThis = [
  {
    title: "b",
    start: "2025-02-21T15:14",
    end: "2025-02-22T15:14",
  },
  {
    title: "a",
    start: "2025-02-22T15:13",
    end: "2025-02-22T15:15",
  },
  {
    title: "c",
    start: "2025-02-24T15:14",
    end: "2025-03-07T15:14",
  },
  {
    title: "Z",
    start: "2025-05-11T15:32",
    end: "2025-05-11T15:36",
  },

  {
    title: "2",
  },
  {
    title: "0",
  },
  {
    title: "a",
  },
  {
    title: "1",
  },
  {
    title: "3",
  },
  {
    title: "3",
  },
  {
    title: "1",
    start: "2025-01-09T15:42",
  },
];

// const sortThis = ["a", "c", "b"];
console.log(
  sortThis
    .sort((a, b) => {
      if (!a.start && b.start) {
        return -1;
      } else if (a.start || !b.start) {
        return 1;
      }
      // a must be equal to b
      return 0;
    })
    .sort((a, b) => {
      if (!a.start && !b.start) {
        if (a.title < b.title) {
          return -1;
        } else if (a.title > b.title) {
          return 1;
        }
      } else {
        if (a.start < b.start) {
          return -1;
        } else if (a.start > b.start) {
          return 1;
        }
      }
    })
);
