const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
fetch(url)
  .then((response) => response.json())
  .then((response) => {
    console.log(response.data[0][0].split("-")[0]);
    const { data } = response;
    const dataset = data.map((d) => [d[0].split("-")[0], d[1]]);
    startVisualization(dataset);
  });

const startVisualization = (dataset) => {
  const height = 500;
  const width = 960;
  const padding = 50;
  const barWidth = width / dataset.length;
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg");

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(dataset, (d) => d[0]), d3.max(dataset, (d) => d[0])])
    .range([padding, width - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([height - padding, padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale);
  svg

    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * barWidth)
    .attr("y", (d) => height - yScale(d[1]))
    .attr("width", barWidth)
    .attr("height", (d) => yScale(d[1]))
    .attr("class", "bar");

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${height - padding}, 0})`)
    .call(yAxis);
};
