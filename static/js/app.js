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

    // Set the span tag in the h1 element to the text
    // that was entered in the form
    d3.select("small>span").text(inputValue);
    interest_over_time_data = interest_over_time(inputValue)
})
    
async function interest_over_time(inputValue){ 

    const interest_over_time_url = `/interest_over_time/${inputValue}`
    console.log(interest_over_time_url)
    var keyword_string = inputValue.replace('/,/g','-')
    console.log('keyword',keyword_string);
    let interest_over_time_data = await d3.json(interest_over_time_url);
    console.log('return from py:',interest_over_time_data);
    return(interest_over_time_data)
}

