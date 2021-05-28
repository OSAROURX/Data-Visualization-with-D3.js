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
  .style("visibility", "visible");

const setScale = () => {
  xScale = d3.scaleLinear().range([padding * 1.2, width - padding * 1.2]);

  yScale = d3.scaleLinear().range([padding * 1.8, height - padding * 1.8]);
};

const setAxes = () => {
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .style("font-size", "0.75em")
    .style("font-family", "Roboto Mono")
    .style("shape-rendering", "crispEdges")
    .attr("transform", `translate(0, ${height - padding * 1.8})`);

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .style("font-size", "0.75em")
    .style("font-family", "Roboto Mono")
    .style("shape-rendering", "crispEdges")
    .attr("transform", `translate(${padding * 1.2}, 0)`);
};

const setText = () => {
  svg
    .append("text")
    .attr("id", "title")
    .text("Monthly Global Land-Surface Temperature")
    .attr("x", "50%")
    .attr("y", "8%")
    .attr("font-size", "1.8em")
    .attr("font-weight", "400")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .attr("id", "description")
    .html(
      `${dataset.monthlyVariance[0].year} - ${
        dataset.monthlyVariance[dataset.monthlyVariance.length - 1].year
      } : base temperature ${dataset.baseTemperature}&#8451;`
    )
    .attr("x", "50%")
    .attr("y", "14%")
    .attr("font-size", "1.2em")
    .attr("font-weight", "300")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .text("Months")
    .attr("transform", "rotate(-90)")
    .attr("x", -275)
    .attr("y", padding * 0.3 + 12)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .text("Years")
    .attr("x", "50%")
    .attr("y", height - padding * 1.1)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .text("By LeviaThanSr")
    .attr("x", width - 210)
    .attr("y", height - padding * 1.1)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2");
};

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    dataset = response;
    console.log(dataset);
    setScale();
    setAxes();
    setText();
  });
