// Select the submit button
var submit = d3.select("#submit");

submit.on("click", function() {

    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input element and get the raw HTML node
    var inputElement = d3.select("#keywords");

    // Get the value property of the input element
    var inputValue = inputElement.property("value");

    console.log(inputValue);

    live_trends_data = live_trends(inputValue)
})
    
async function live_trends(inputValue){ 

    // Retrieve data
    const live_trends_url = `/live_trends/${inputValue}`
    const live_trends_data = await d3.json(live_trends_url);

    // Print data
    console.log('return from py:',live_trends_data);

    return(live_trends_data)
}

(async function(){

    // Define SVG area dimensions
    const
        svgWidth = 960,
        svgHeight = 500;

    // Define the chart's margins as an object
    const margin = {
        top: 60,
        right: 60,
        bottom: 60,
        left: 60
    };

    // Define dimensions of the chart area
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    // Select body, append SVG area to it, and set its dimensions
    const svg = d3.select("#time")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    // Append a group area, then set its margins
    const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Retrieve data
    const time_data_url = '/init'
    const time_data = await d3.json(time_data_url);
    console.log(time_data.date);

    // Create a function to parse date and time
    const parseTime = d3.timeParse("%Y-%m-%d");

    // Format date data
    time_data.date.forEach(function(data) {
        data = parseTime(data);
        console.log(data);
    });
    console.log(time_data.date);

    // // Reformat data
    // Object.keys(time_data).forEach(function (key) {
    //     time_data[key] = Object.values(time_data[key])
    // });

    // // Cast values to numbers
    // time_data.forEach(function(data) {
        
    //     data.tacos = +data.tacos;
    //     data.sandwiches = +data.sandwiches;
    //     data.kebabs = +data.kebabs;
        
    // });

    // // Create the scales
    // const xTimeScale = d3.scaleTime()
    //     .domain(d3.extent(time_data.date))
    //     .range([0, chartWidth]);

    // const yLinearScale = d3.scaleLinear()
    //     .range([chartHeight, 0]);

    // Configure a line function which will plot the x and y coordinates using our scales
    // const drawLine = d3.line()
    //     .x(data => xTimeScale(time_data.date))
    //     .y(data => yLinearScale(time_data.taco));

    // // Find max of data
    // const tacoMax = d3.max(time_data.taco);

    // const sandwichMax = d3.max(time_data.sandwich);

    // const kebabMax = d3.max(time_data.kebab);;

    // let yMax;
    // if ((tacoMax > sandwichMax) && (tacoMax > kebabMax)) {
    //     yMax = tacoMax;
    // }
    // else if ((sandwichMax > tacoMax) && (sandwichMax > kebabMax)) {
    //     yMax = sandwichMax;
    // }
    // else {
    //     yMax = kebabMax;
    // }

    // // Use the yMax value to set the yLinearScale domain
    // yLinearScale.domain([0, yMax]);

    // // Create the axes
    // const bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y-%m-%d"));
    // const leftAxis = d3.axisLeft(yLinearScale);

    // // Add x-axis
    // chartGroup.append("g")
    //     .attr("transform", `translate(0, ${chartHeight})`)
    //     .call(bottomAxis);

    // // Add y-axis
    // chartGroup.append("g").call(leftAxis);

//     // Line generator for taco data
//     const tacoLine = d3.line()
//         .x(d => xTimeScale(d.date))
//         .y(d => yLinearScale(d.tacos));

//     // Line generator for sandwich data
//     const sandwichLine = d3.line()
//         .x(d => xTimeScale(d.date))
//         .y(d => yLinearScale(d.sandwiches));

//     // Line generator for kebab data
//     const kebabLine = d3.line()
//         .x(d => xTimeScale(d.date))
//         .y(d => yLinearScale(d.kebabs));

//     // Append a path for tacoLine
//     chartGroup
//         .append("path")
//         .attr("d", tacoLine(time_data))
//         .classed("line green", true);

//     // Append a path for sandwhichLine
//     chartGroup
//         .data([time_data])
//         .append("path")
//         .attr("d", sandwichLine)
//         .classed("line orange", true);

//     // Append a path for sandwhichLine
//     chartGroup
//         .data([time_data])
//         .append("path")
//         .attr("d", kebabLine)
//         .classed("red", true);
})()