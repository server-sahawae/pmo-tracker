const id = "202012132274733";
const arr = id.split("");
arr.splice(5, 0, "-");
const result = arr;
console.log(result.join(""));
