const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const height = 580;
const width = 1250;
const padding = 60;

let xScale;
let yScale;
let datasetArr;
let datasetValues;
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

const setScale = () => {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(datasetValues, (d) => d.year) - 1 / 3,
      d3.max(datasetValues, (d) => d.year) + 1,
    ])
    .range([padding * 2, width - padding * 2]);

  yScale = d3
    .scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding * 2, height - padding * 2]);
};

const setAxes = () => {
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .style("font-size", "0.75em")
    .style("font-family", "Roboto Mono")
    .style("shape-rendering", "crispEdges")
    .attr("transform", `translate(0, ${height - padding * 2})`);

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .style("font-size", "0.75em")
    .style("font-family", "Roboto Mono")
    .style("shape-rendering", "crispEdges")
    .attr("transform", `translate(${padding * 2}, 0)`);
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
      `${datasetValues[0].year} - ${
        datasetValues[datasetValues.length - 1].year
      } : base temperature ${datasetArr.baseTemperature}&#8451;`
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

const startVisualization = () => {
  svg
    .selectAll("rect")
    .data(datasetValues)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => datasetArr.baseTemperature + d.variance)
    .attr("height", (d) => (height - padding * 4) / 12)
    .attr(
      "width",
      (d) =>
        (width - padding * 4) /
        (d3.max(datasetValues, (d) => d.year) -
          d3.min(datasetValues, (d) => d.year))
    )
    .attr("y", (d) => yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0)))
    .attr("x", (d) => xScale(d.year))
    .attr("fill", (d) => {
      let variance = parseInt(d.variance);
      let color;
      if (variance <= -1) {
        color = "steelBlue";
      } else if (variance <= 0) {
        color = "lightSteelBlue";
      } else if (variance <= 1) {
        color = "orange";
      } else {
        color = "crimson";
      }
      return color;
    })
    .on("mouseover", (d) => {
      tooltip.transition().style("visibility", "visible");

      tooltip
        .attr("data-year", d.year)
        .html(
          `${d.year} ${months[d.month - 1]}:</br>${(
            datasetArr.baseTemperature + d.variance
          ).toFixed(3)}&#8451</br>${
            d.variance < 0
              ? `<p>${d.variance}&#8451</p>`
              : `<p>+${d.variance}&#8451</p>`
          }`
        )
        .style("left", `${xScale(d.year)}px`)
        .style("top", `${d3.event.pageY - 80}px`);
    })
    .on("mouseout", (d) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    datasetArr = response;
    datasetValues = datasetArr.monthlyVariance;
    console.log(datasetArr);
    console.log(datasetValues);
    setScale();
    setAxes();
    setText();
    startVisualization();
  })
  .catch((err) => {
    console.error("Error:", err);
  });
