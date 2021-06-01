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
  .attr("class", "tooltip")
  .style("visibility", "hidden");

const legend = d3
  .select(".container")
  .append("svg")
  .attr("id", "legend")
  .attr("class", "legend");

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
      } else if (variance > -1 && variance <= 0) {
        color = "lightSteelBlue";
      } else if (variance > 0 && variance <= 1) {
        color = "orange";
      } else if (variance > 1) {
        color = "crimson";
      }
      return color;
    })
    .on("mouseover", (d) => {
      tooltip.transition().style("visibility", "visible");

      tooltip
        .attr("data-year", d.year)
        .style("left", `${xScale(d.year)}px`)
        .html(
          `${d.year} ${months[d.month - 1]}:</br>${(
            datasetArr.baseTemperature + d.variance
          ).toFixed(3)}&#8451</br>${
            d.variance < 0
              ? `<p>${d.variance}&#8451</p>`
              : `<p>+${d.variance}&#8451</p>`
          }`
        );
    })
    .on("mouseout", (d) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

const setLegend = () => {
  const legendBox = legend
    .selectAll("rect")
    .data([0, 1, 2, 3])
    .enter()
    .append("g")
    .attr("class", (d) => "rectBox" + d);

  legendBox.append("rect").attr("class", (d) => "rect" + d);
  legendBox.append("text").attr("class", (d) => "text" + d);

  legendBox
    .select(".rect0")
    .attr("x", 10)
    .attr("y", 0)
    .attr("width", "40")
    .attr("height", "40")
    .attr("fill", "steelBlue");

  legendBox.select(".text0").html("Less Than -1").attr("x", 60).attr("y", 26);

  legendBox
    .select(".rect1")
    .attr("x", 200)
    .attr("y", 0)
    .attr("width", "40")
    .attr("height", "40")
    .attr("fill", "lightSteelBlue");

  legendBox.select(".text1").html("From -1 to 0").attr("x", 250).attr("y", 26);

  legendBox
    .select(".rect2")
    .attr("x", 10)
    .attr("y", 50)
    .attr("width", "40")
    .attr("height", "40")
    .attr("fill", "orange");

  legendBox.select(".text2").html("From 0 to 1").attr("x", 60).attr("y", 76);

  legendBox
    .select(".rect3")
    .attr("x", 200)
    .attr("y", 50)
    .attr("width", "40")
    .attr("height", "40")
    .attr("fill", "crimson");

  legendBox.select(".text3").html("More Than 1").attr("x", 250).attr("y", 76);
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
    setLegend();
    startVisualization();
  })
  .catch((err) => {
    console.error("Error:", err);
  });
