// Create color palette array
var colors = ['#FF33E3', '#FFB533', '#33FF4F', '#FF4F33', '#B533FF'];

// Create function to pull data
async function live_trends(inputValue){ 

    // Retrieve data
    const live_trends_url = `/live_trends/${inputValue}`
    const live_trends_data = await d3.json(live_trends_url);

    // Print data
    console.log('return from py:',live_trends_data);

    return(live_trends_data)
}

// Select the submit button
var submit = d3.select("#submit");

submit.on("click", async function() {

    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input element and get the raw HTML node
    const inputElement = d3.select("#keywords");

    // Get the value property of the input element
    const inputValue = inputElement.property("value");

    // Retrieve data
    const time_data_url = `/live_trends/${inputValue}`;
    const time_data = await d3.json(time_data_url);
    console.log(time_data);

    // Format date data
    const parseTime = d3.timeParse("%a, %d %b %Y 00:00:00 GMT");

    // Format date data
    var i;
    for (i = 0; i < time_data.date.length; i++) {
        time_data.date[i] = parseTime(time_data.date[i]);
    };
    
    // Create usable arrays for looping
    var input_array = inputValue.split(",");
    var chart_data = [];

    // Create interest-over-time graph
    (function time_series(){
        for (i = 0; i < input_array.length; i++) {
            let trace_i = {
                type: "scatter",
                mode: "lines",
                name: input_array[i],
                y: time_data[input_array[i]],
                x: time_data.date,
                line: {color: colors[i]}
            };
            chart_data.push(trace_i);
        };

        let data = chart_data;

        let layout = {
            showlegend: false,
            autosize: true,
            height: 600,
            margin: {l: 25},
            yaxis: {
                range: [0, 100],
                showticklabels: true,
            }
        };

        Plotly.newPlot('time', data, layout);
    })();

    (function avg_plot(){
        let mean_data = [];
        let color_array = [];

        for (i=0; i < input_array.length; i++) {
            mean_i = d3.mean(time_data[input_array[i]]);
            mean_data.push(mean_i);
            color_array.push(colors[i]);
        };

        let data = [
            {
                 x: input_array,
                y: mean_data,
                marker:{
                    color: color_array
                },
                type: "bar"
            }
        ];

        let layout = {
            height: 600,
            margin: {r: 0},
            yaxis: {
                showgrid: true,
                showticklabels: false,
                range: [0, 100]
            }
        };

        Plotly.newPlot('avg', data, layout);
    })();
});

// Create function to call upon page load
(async function init(){

    // Retrieve data
    const time_data_url = `/init`;
    const time_data = await d3.json(time_data_url);
    console.log(time_data);

    // Format date data
    const parseTime = d3.timeParse("%a, %d %b %Y 00:00:00 GMT");

    // Format date data
    var i;
    for (i = 0; i < time_data.date.length; i++) {
        time_data.date[i] = parseTime(time_data.date[i]);
    };
    
    // Create usable arrays for looping
    var input_array = [];
    var chart_data = [];

    for (key in time_data){
        if(!['date','isPartial'].includes(key)){
            input_array.push(key)
        }
    }
    console.log(input_array);

    // Create interest-over-time graph
    (function time_series(){
        for (i = 0; i < input_array.length; i++) {
            let trace_i = {
                type: "scatter",
                mode: "lines",
                name: input_array[i],
                y: time_data[input_array[i]],
                x: time_data.date,
                line: {color: colors[i]}
            };
            chart_data.push(trace_i);
        };

        let data = chart_data;

        let layout = {
            showlegend: false,
            autosize: true,
            height: 600,
            margin: {l: 25},
            yaxis: {
                range: [0, 100],
                showticklabels: true,
            }
        };

        Plotly.newPlot('time', data, layout);
    })();

    (function avg_plot(){
        let mean_data = [];
        let color_array = [];

        for (i=0; i < input_array.length; i++) {
            mean_i = d3.mean(time_data[input_array[i]]);
            mean_data.push(mean_i);
            color_array.push(colors[i]);
        };

        let data = [
            {
                 x: input_array,
                y: mean_data,
                marker:{
                    color: color_array
                },
                type: "bar"
            }
        ];

        let layout = {
            height: 600,
            margin: {r: 0},
            yaxis: {
                showgrid: true,
                showticklabels: false,
                range: [0, 100]
            }
        };

        Plotly.newPlot('avg', data, layout);
    })();
})()