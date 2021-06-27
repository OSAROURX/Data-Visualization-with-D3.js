const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const height = 550;
const width = 1050;
const padding = 60;

let xScale;
let yScale;
let dataset;

const container = d3.select("body").append("div").attr("class", "container");

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
      d3.min(dataset, (d) => d.Year) - 1,
      d3.max(dataset, (d) => d.Year) + 1,
    ])
    .range([padding * 1.5, width - padding * 1.5]);

  yScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (d) => new Date(d.Seconds * 1000)),
      d3.max(dataset, (d) => new Date(d.Seconds * 1000)),
    ])
    .range([padding * 1.5, height - padding]);
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
    .attr("transform", `translate(${padding * 1.5}, 0)`);
};

const setText = () => {
  svg
    .append("text")
    .attr("id", "title")
    .text("Doping in Professional Bicycle Racing")
    .attr("x", "50%")
    .attr("y", "6%")
    .attr("font-size", "1.8em")
    .attr("font-weight", "400")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .attr("id", "description")
    .text("35 Fastest times up Alpe d'Huez")
    .attr("x", "50%")
    .attr("y", "12%")
    .attr("font-size", "1.2em")
    .attr("font-weight", "300")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .text("Time in Minutes")
    .attr("transform", "rotate(-90)")
    .attr("x", -256)
    .attr("y", 30)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2");

  svg
    .append("text")
    .text("By LeviaThanSr")
    .attr("x", width - 230)
    .attr("y", height - 15)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2");
};

const setLegend = () => {
  const legend = container
    .append("div")
    .attr("id", "legend")
    .attr("class", "legend");

  const legendBox1 = legend.append("div").attr("class", "legend_box");
  const legendBox2 = legend.append("div").attr("class", "legend_box");

  legendBox1.append("p").text("No doping allegations");
  legendBox1.append("div").attr("class", "orange_box");

  legendBox2.append("p").text("Riders with doping allegations");
  legendBox2.append("div").attr("class", "blue_box");
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
    .attr("cy", (d) => yScale(new Date(d.Seconds * 1000)))
    .style("fill", (d) => (d.Doping ? "#3779ed" : "#ed8f37"))
    .on("mouseover", (d, i) => {
      tooltip.transition().style("visibility", "visible");
      tooltip
        .attr("data-year", d.Year)
        .style("left", d3.event.pageX + 0 + "px")
        .style("top", d3.event.pageY - 70 + "px")
        .html(
          d.Name +
            " : " +
            d.Nationality +
            "<br />" +
            "Year : " +
            d.Year +
            "<br />" +
            "Time : " +
            d.Time +
            (d.Doping ? "<br /><br />" + d.Doping : "")
        );
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
    });
};

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    dataset = response;
    console.log(dataset);
    setScale();
    setAxes();
    setText();
    setLegend();
    startVisualization();
  });
