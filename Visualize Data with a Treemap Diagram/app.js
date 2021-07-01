const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const height = 550;
const width = 1050;

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
  const setTreeMap = d3.treemap().size([400, 900]).paddingInner(1);

  const hierarchy = d3
    .hierarchy(dataset, (d) => d.children)
    .sum((d) => d.value)
    .sort((d1, d2) => d1.value - d2.value);

  setTreeMap(hierarchy);

  console.log(hierarchy.leaves());
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
