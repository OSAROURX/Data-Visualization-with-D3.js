const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";
// const url =
//   "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

const height = 615;
const width = 1300;

let dataset;

const container = d3
  .select("body")
  .append("div")
  .attr("class", "container")
  .attr("id", "container");

const svg = d3
  .select(".container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "svg");

const setText = () => {
  svg
    .append("text")
    .attr("id", "title")
    .text("Video Game Sales")
    .attr("x", "50%")
    .attr("y", "6%")
    .attr("font-size", "1.8em")
    .attr("font-weight", "500")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .attr("id", "description")
    .text("Top 100 Most Sold Video Games Grouped by Platform")
    .attr("x", "50%")
    .attr("y", "12%")
    .attr("font-size", "1.2em")
    .attr("font-weight", "400")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .text("By LeviaThanSr")
    .attr("x", width - 180)
    .attr("y", height - 35)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2");
};

const startVisualization = () => {
  const color = d3.scaleOrdinal(d3.schemeTableau10);
  const setTreeMap = d3.treemap().size([1000, 500]).paddingInner(2);
  const hierarchy = d3
    .hierarchy(dataset, (d) => d.children)
    .sum((d) => d.value);

  setTreeMap(hierarchy);

  const gameTiles = hierarchy.leaves();

  const block = svg
    .selectAll("g")
    .data(gameTiles)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

  const tile = block
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("fill", (d) => color(d.data.category))
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0);

  const tileText = block
    .append("text")
    .text((d) => d.data.name)
    .attr("x", 5)
    .attr("y", 20);
};

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    dataset = response;
    console.log(dataset);
    setText();
    startVisualization();
  })
  .catch((err) => {
    console.error("Error:", err);
  });
