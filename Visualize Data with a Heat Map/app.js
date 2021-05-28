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
    .attr("y", padding * 0.5 + 12)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .text("Years")
    .attr("x", "50%")
    .attr("y", height - padding * 0.5)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .text("By LeviaThanSr")
    .attr("x", width - 230)
    .attr("y", height - padding * 0.5)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2");
};

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    dataset = response;
    console.log(dataset);
    setText();
  });
