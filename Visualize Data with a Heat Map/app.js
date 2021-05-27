const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const height = 550;
const width = 950;
const padding = 60;

let xScale;
let yScale;
let dataset;

const container = d3
  .select("body")
  .append("div")
  .attr("class", "container")
  .style("position", "relative");

const svg = d3
  .select(".container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "svg");

const tooltip = d3
  .select(".container")
  .append("div")
  .attr("id", "tooltip")
  .style("visibility", "hidden");

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    dataset = response;
    console.log(dataset);
  });
