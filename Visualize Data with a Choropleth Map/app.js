const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countryURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

const height = 615;
const width = 1050;

let educationDataset;
let countryDataset;
let data;

let maxValue;
let minValue;

const container = d3.select("body").append("div").attr("class", "container");

const svg = d3
  .select(".container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "svg");

const legend = svg
  .append("g")
  .attr("class", "key")
  .attr("id", "legend")
  .attr("transform", "translate(575, 85)");

const tooltip = d3
  .select(".container")
  .append("div")
  .attr("id", "tooltip")
  .style("visibility", "hidden");

const setText = () => {
  svg
    .append("text")
    .attr("id", "title")
    .text("United States Educational Attainment")
    .attr("x", "50%")
    .attr("y", "4%")
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
    .attr("y", "10%")
    .attr("font-size", "1.2em")
    .attr("font-weight", "300")
    .attr("dominant-baseline", "middle")
    .attr("text-anchor", "middle");

  svg
    .append("text")
    .text("By LeviaThanSr")
    .attr("x", width - 180)
    .attr("y", height - 35)
    .attr("font-weight", "300")
    .attr("letter-spacing", "2");
};

const setMinMax = (dataset) => {
  maxValue = d3.max(dataset, (d) => d.bachelorsOrHigher);
  minValue = d3.min(dataset, (d) => d.bachelorsOrHigher);
};

const startVisualization = (min, max) => {
  const xScale = d3.scaleLinear().domain([min, max]).range([0, 400]);

  const colorScale = d3
    .scaleThreshold()
    .domain(d3.range(min, max, (max - min) / 8))
    .range(d3.schemeBlues[8]);

  const legendScaleData = d3
    .axisBottom(xScale)
    .tickSize(14)
    .tickFormat((num) => Math.round(num) + "%")
    .tickValues(colorScale.domain());

  const legendColorData = colorScale.range().map((d) => {
    d = colorScale.invertExtent(d);
    if (d[0] === null) {
      d[0] = xScale.domain()[0];
    }
    if (d[1] === null) {
      d[1] = xScale.domain()[1];
    }
    return d;
  });

  legend
    .selectAll("rect")
    .data(legendColorData)
    .enter()
    .append("rect")
    .attr("height", 10)
    .attr("x", (d) => xScale(d[0]))
    .attr("width", (d) => xScale(d[1]) - xScale(d[0]))
    .attr("fill", (d) => colorScale(d[0]));

  legend.call(legendScaleData).select(".domain").remove();

  svg
    .selectAll("path")
    .data(countryDataset)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("d", d3.geoPath())
    .attr("transform", "scale(0.9), translate(105,80)")
    .attr("data-fips", (d) => d.id)
    .attr("data-education", (d) => {
      let county = educationDataset.filter((i) => i.fips == d.id);
      if (county[0]) {
        return county[0].bachelorsOrHigher;
      }
      return 0;
    })
    .attr("fill", (d) => {
      let county = educationDataset.filter((i) => i.fips == d.id);
      if (county[0]) {
        return colorScale(county[0].bachelorsOrHigher);
      }
      return colorScale(0);
    })
    .on("mouseover", function (d) {
      tooltip.transition().style("visibility", "visible");
      tooltip
        .html(function () {
          let county = educationDataset.filter((i) => i.fips === d.id);
          if (county[0]) {
            let area = county[0].area_name;
            let state = county[0].state;
            let bachelorsOrHigher = county[0].bachelorsOrHigher;
            return `${area}, ${state}: </br>${bachelorsOrHigher}%`;
          }
          return 0;
        })
        .attr("data-education", () => {
          let county = educationDataset.filter((i) => i.fips == d.id);
          if (county[0]) {
            return county[0].bachelorsOrHigher;
          }
          return 0;
        })
        .style("left", d3.event.pageX + 0 + "px")
        .style("top", d3.event.pageY - 30 + "px");
    })
    .on("mouseout", function () {
      tooltip.transition().style("visibility", "hidden");
    });

  svg
    .append("path")
    .datum(topojson.mesh(data, data.objects.states, (a, b) => a !== b))
    .attr("class", "states")
    .attr("d", d3.geoPath())
    .attr("transform", "scale(0.9), translate(105,80)");
};

fetch(countryURL)
  .then((response) => response.json())
  .then(async (countryResponse) => {
    data = countryResponse;
    countryDataset = topojson.feature(data, data.objects.counties).features;
    // console.log(data);
    try {
      const response = await fetch(educationURL);
      const educationResponse = await response.json();
      educationDataset = educationResponse;

      setText();
      setMinMax(educationDataset);
      startVisualization(minValue, maxValue);
    } catch (err) {
      console.error(`Failed to fetch educationURL => ${educationURL}`);
      console.error(err);
    }
  })
  .catch((err) => {
    console.error(`Failed to fetch countryURL => ${countryURL}`);
    console.error(err);
  });
