const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const height = 550;
const width = 950;
const padding = 60;

let xScale;
let yScale;
let dataset;
let xAxisScale;
let yAxisScale;

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

const setScales = () => {
  xScale = d3
    .scaleLinear()
    .domain([0, dataset.length - 1])
    .range([padding, width - padding]);

  yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d.Seconds)])
    .range([0, height - 2 * padding]);
};

const setAxis = () => {
  xAxisScale = d3
    .scaleLinear()
    .domain([d3.min(dataset, (d) => d.Year), d3.max(dataset, (d) => d.Year)])
    .range([padding, width - padding]);

  yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d.Seconds)])
    .range([height - padding, padding]);

  const xAxis = d3.axisBottom(xAxisScale);
  const yAxis = d3.axisLeft(yAxisScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .style("font-size", "0.75em")
    .style("shape-rendering", "crispEdges")
    .attr("transform", `translate(0, ${height - padding})`);

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .style("font-size", "0.75em")
    .style("shape-rendering", "crispEdges")
    .attr("transform", `translate(${padding}, 0)`);
};

const setText = () => {
  svg
    .append("text")
    .attr("id", "title")
    .text("Doping in Professional Bicycle Racing")
    .attr("x", "50%")
    .attr("y", "8%")
    .attr("font-size", "2em")
    .attr("font-weight", "300")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");
  svg
    .append("text")
    .attr("id", "title")
    .text("35 Fastest times up Alpe d'Huez")
    .attr("x", "50%")
    .attr("y", "14%")
    .attr("font-size", "1.3em")
    .attr("font-weight", "200")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");
};

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    dataset = response;
    console.log(dataset);
    setText();
    setAxis();
  });
