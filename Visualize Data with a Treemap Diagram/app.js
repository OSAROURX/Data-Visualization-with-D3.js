const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const height = 1280;
const width = 1150;

let dataset;

const container = d3
  .select("body")
  .append("div")
  .attr("class", "container")
  .attr("id", "container");

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
  .select("body")
  .append("svg")
  .attr("id", "legend")
  .attr("class", "legend");

const setText = () => {
  svg
    .append("text")
    .attr("id", "title")
    .text("Video Game Sales")
    .attr("x", "50%")
    .attr("y", "3%")
    .attr("font-size", "1.9em")
    .attr("font-weight", "500")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .attr("id", "description")
    .text("Top 100 Most Sold Video Games Grouped by Platform")
    .attr("x", "50%")
    .attr("y", "6%")
    .attr("font-size", "1.2em")
    .attr("font-weight", "400")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .text("By LeviaThanSr")
    .attr("x", width / 2)
    .attr("y", height - 35)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2")
    .attr("text-anchor", "middle");
};

const startVisualization = () => {
  const color = d3.scaleOrdinal(d3.schemeTableau10);
  const setTreeMap = d3.treemap().size([width, 1000]).paddingInner(2);
  const hierarchy = d3
    .hierarchy(dataset)
    .sum((d) => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value);

  setTreeMap(hierarchy);

  const gameTiles = hierarchy.leaves();

  const block = svg
    .selectAll("g")
    .data(gameTiles)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0 + 120})`);

  const tile = block
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("fill", (d) => color(d.data.category))
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .on("mouseover", (d) => {
      tooltip.transition().style("visibility", "visible");
      tooltip
        .attr("data-value", d.data.value)
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 28 + "px")
        .html(
          `<p><span>Name: </span>${d.data.name}<p>
            <p><span>Category: </span>${d.data.category}<p>
            <p><span>Value: </span>${d.data.value}<p>`
        );
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
    });

  const tileText = block
    .append("text")
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .attr("x", 5)
    .attr("y", (d, i) => 15 + i * 10)
    .style("font-size", "12")
    .text((d) => d);

  const categories = gameTiles
    .map((d) => d.data.category)
    .filter((i, idx, arr) => arr.indexOf(i) === idx);

  // console.log(categories);

  legend
    .selectAll("rect")
    .data(categories)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("fill", (d) => color(d))
    .attr("x", (d, i) => i * 63)
    .attr("y", 30)
    .attr("width", 22)
    .attr("height", 22);

  legend
    .append("g")
    .selectAll("text")
    .data(categories)
    .enter()
    .append("text")
    .attr("fill", "black")
    .attr("x", (d, i) => i * 63 + 23)
    .attr("y", 46)
    .text((d) => d);
};

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    dataset = response;
    console.log(dataset);
    setText();
    startVisualization();
  })
  .catch((err) => {
    console.error("Error:", err);
  });
