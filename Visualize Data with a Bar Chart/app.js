const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
fetch(url)
  .then((response) => response.json())
  .then((response) => {
    const data = response.data.map((d) => [d[0], d[1], d[0].split("-")[0]]);
    console.log(data);
    startVisualization(data);
  });

const startVisualization = (dataset) => {
  const height = 500;
  const width = 960;
  const padding = 50;
  const barWidth = (width - 2 * padding) / dataset.length;
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg");

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(dataset, (d) => d[2]), d3.max(dataset, (d) => d[2])])
    .range([padding, width - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([height - padding, 1.5 * padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale);

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d, i) => i * barWidth + padding)
    .attr("y", (d) => yScale(d[1]) - padding)
    .attr("width", barWidth)
    .attr("height", (d) => height - yScale(d[1]))
    .append("title")
    .text((d) => d[1]);

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

  svg.selectAll("text").append("text").attr("id", "title").text("USD GDP");
};
