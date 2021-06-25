const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countryURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

const height = 550;
const width = 1050;
const padding = 60;

let educationDataset;
let countryDataset;

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

fetch(countryURL)
  .then((response) => response.json())
  .then((countryResponse) => {
    countryDataset = countryResponse;
    console.log(countryDataset);
    setText();
    return fetch(educationURL)
      .then((response) => response.json())
      .then((educationResponse) => {
        educationDataset = educationResponse;
        console.log(educationDataset);
      })
      .catch((err) => {
        console.error("Failed to fetch " + educationURL);
        console.error(err);
      });
  })
  .catch((err) => {
    console.error("Failed to fetch " + countryURL);
    console.error(err);
  });
