const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const height = 550;
const width = 1050;
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

const tooltip = d3
  .select(".container")
  .append("div")
  .attr("id", "tooltip")
  .style("visibility", "hidden");

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
    .text("By OSAROURX")
    .attr("x", width - 180)
    .attr("y", height - 15)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2");
};

const startVisualization = () => {
  const barWidth = (width - 2 * padding) / dataset.length;

  const gdp = dataset.map((d) =>
    d[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );

  const years = dataset.map((d) => {
    let quarter;
    let months = d[0].substring(5, 7);
    switch (months) {
      case "01":
        quarter = "Q1";
        break;
      case "04":
        quarter = "Q2";
        break;
      case "07":
        quarter = "Q3";
        break;
      case "10":
        quarter = "Q4";
        break;
    }
    return `${d[0].substring(0, 4)} ${quarter}`;
  });

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", barWidth)
    .attr("height", (d) => yScale(d[1]))
    .attr("x", (d, i) => xScale(i))
    .attr("y", (d) => height - padding - yScale(d[1]))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", (d, i) => {
      tooltip.transition().style("visibility", "visible");
      tooltip
        .html(`${years[i]}</br>$${gdp[i]} Billions`)
        .attr("data-date", d[0])
        .style("left", i * barWidth + padding * 3.2 + "px")
        .style("top", height - padding * 3 + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
    });
};

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    dataset = response.data;
    setScales();
    setAxis();
    setText();
    startVisualization();
  });
