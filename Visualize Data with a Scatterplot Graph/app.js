const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
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

const setScale = () => {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, (d) => d.Year) - 1,
      d3.max(dataset, (d) => d.Year) + 1,
    ])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (d) => new Date(d.Seconds * 1000)),
      d3.max(dataset, (d) => new Date(d.Seconds * 1000)),
    ])
    .range([padding, height - padding]);
};

const setAxes = () => {
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .style("font-size", "0.75em")
    .style("font-family", "Roboto Mono")
    .style("shape-rendering", "crispEdges")
    .attr("transform", `translate(0, ${height - padding})`);

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .style("font-size", "0.75em")
    .style("font-family", "Roboto Mono")
    .style("shape-rendering", "crispEdges")
    .attr("transform", `translate(${padding}, 0)`);
};

const setText = () => {
  svg
    .append("text")
    .attr("id", "title")
    .text("Doping in Professional Bicycle Racing")
    .attr("x", "50%")
    .attr("y", "6%")
    .attr("font-size", "1.7em")
    .attr("font-weight", "400")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");
  svg
    .append("text")
    .attr("id", "title")
    .text("35 Fastest times up Alpe d'Huez")
    .attr("x", "50%")
    .attr("y", "12%")
    .attr("font-size", "1.15em")
    .attr("font-weight", "300")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .text("Time in Minutes")
    .attr("transform", "rotate(-90)")
    .attr("x", -210)
    .attr("y", 80)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2");

  svg
    .append("text")
    .text("By LeviaThanSr")
    .attr("x", width - 200)
    .attr("y", height - 15)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2");
};

const startVisualization = () => {
  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => new Date(d.Seconds * 1000))
    .attr("r", 6)
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(new Date(d.Seconds * 1000)));
};

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    dataset = response;
    console.log(dataset);
    setScale();
    setAxes();
    setText();
    startVisualization();
  });
