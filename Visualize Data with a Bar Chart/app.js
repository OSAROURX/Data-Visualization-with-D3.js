const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const height = 560;
const width = 960;
const padding = 60;

let xScale;
let yScale;
let dataset;
let xAxisScale;
let yAxisScale;

const svg = d3
  .select("body")
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
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([0, height - 2 * padding]);
};

const setAxis = () => {
  const dates = dataset.map((d) => new Date(d[0]));
  console.log(dates);

  xAxisScale = d3
    .scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([padding, width - padding]);

  yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([height - padding, padding]);

  const xAxis = d3.axisBottom(xAxisScale);
  const yAxis = d3.axisLeft(yAxisScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);
};

const setText = () => {
  svg
    .append("text")
    .attr("id", "title")
    .text("United States GDP")
    .attr("x", "50%")
    .attr("y", "8%")
    .attr("font-size", "2.5em")
    .attr("font-weight", "100")
    .attr("letter-spacing", "2")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .text("Gross Domestic Product")
    .attr("transform", "rotate(-90)")
    .attr("x", -292)
    .attr("y", 85)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2");

  svg
    .append("text")
    .text("By LeviaThanSr")
    .attr("x", width - 197)
    .attr("y", height - 15)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2");
};

const startVisualization = () => {
  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", (width - 2 * padding) / dataset.length)
    .attr("height", (d) => yScale(d[1]))
    .attr("x", (d, i) => xScale(i))
    .attr("y", (d) => height - padding - yScale(d[1]))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1]);
};

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    dataset = response.data;
    setText();
    setScales();
    startVisualization();
    setAxis();
    // console.log(dataset);
  });
