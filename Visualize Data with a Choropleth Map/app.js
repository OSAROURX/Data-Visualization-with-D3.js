const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const height = 550;
const width = 1050;
const padding = 60;

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

const setText = () => {
  svg
    .append("text")
    .attr("id", "title")
    .text("United States Educational Attainment")
    .attr("x", "50%")
    .attr("y", "6%")
    .attr("font-size", "1.8em")
    .attr("font-weight", "400")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .attr("id", "description")
    .text(
      "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
    )
    .attr("x", "50%")
    .attr("y", "12%")
    .attr("font-size", "1.2em")
    .attr("font-weight", "300")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");
};

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    dataset = response;
    console.log(dataset);
    setText();
  })
  .catch((err) => {
    console.error("Error:", err);
  });
