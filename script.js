// Set up dimensions and margins
const margin = { top: 20, right: 30, bottom: 40, left: 50 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Data (replace this with your actual data)
const data = [
    { region: "Chicago", infectionRate: 10, vaccinationRate: 30 },
    { region: "Champaign", infectionRate: 20, vaccinationRate: 50 },
    { region: "Urbana", infectionRate: 15, vaccinationRate: 40 },
    { region: "Purdue", infectionRate: 25, vaccinationRate: 60 },
    { region: "Indiana", infectionRate: 30, vaccinationRate: 40 },
    { region: "Evanston", infectionRate: 5, vaccinationRate: 90 },
    // Add more data points
];

// Define scales
const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.infectionRate)])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.vaccinationRate)])
    .range([height, 0]);

const colorScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.infectionRate)])
    .range(["blue", "red"]);

// Create axes
const xAxis = d3.axisBottom(xScale).ticks(10);
const yAxis = d3.axisLeft(yScale).ticks(10);

// Append x-axis
const xAxisGroup = svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

// Add x-axis label
xAxisGroup.append("text")
    .attr("x", width / 2)
    .attr("y", margin.bottom - 10)
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .text("Infection Rate");

// Append y-axis
const yAxisGroup = svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

// Add y-axis label
yAxisGroup.append("text")
    .attr("x", -margin.bottom)
    .attr("y", height / 50)
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Vaccination Rate");

// Create dots
const dots = svg.selectAll("circle")
    .data(data)
  .enter().append("circle")
    .attr("cx", d => xScale(d.infectionRate))
    .attr("cy", d => yScale(d.vaccinationRate))
    .attr("r", 5)
    .style("fill", d => colorScale(d.infectionRate))
    .style("opacity", 0.7);

// Create tooltip
const tooltip = d3.select("#tooltip");

// Add hover interaction
dots.on("mouseover", (event, d) => {
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    tooltip.html(`Region: ${d.region}<br>Infection Rate: ${d.infectionRate}<br>Vaccination Rate: ${d.vaccinationRate}`)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
})
.on("mouseout", () => {
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
});

// Zoom functionality
const zoom = d3.zoom()
    .scaleExtent([1, 5]) // Adjust the scale extent as needed
    .translateExtent([[0, 0], [width, height]])
    .on("zoom", zoomed);

svg.call(zoom);

function zoomed(event) {
    // Create new scale objects based on event
    const new_xScale = event.transform.rescaleX(xScale);
    const new_yScale = event.transform.rescaleY(yScale);
  
    // Update axes with these new boundaries
    xAxisGroup.call(d3.axisBottom(new_xScale).ticks(10));
    yAxisGroup.call(d3.axisLeft(new_yScale).ticks(10));
  
    // Update the position of dots
    dots.attr("cx", d => new_xScale(d.infectionRate))
        .attr("cy", d => new_yScale(d.vaccinationRate));
}

// Zoom in and out buttons
d3.select("#zoomIn").on("click", () => {
    svg.transition().duration(750).call(zoom.scaleBy, 1.5);
});

d3.select("#zoomOut").on("click", () => {
    svg.transition().duration(750).call(zoom.scaleBy, 0.75);
});
