const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
fetch(url)
  .then((response) => response.json())
  .then((response) => {
    // console.log(response.data);
    const { data } = response;
    startVisualization(data);
  });

const startVisualization = (dataset) => {
  const height = 450;
  const width = 960;
  const barWidth = width / dataset.length;
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg");
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([0, height]);

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
};
