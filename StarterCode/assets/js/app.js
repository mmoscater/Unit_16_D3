// @TODO: YOUR CODE HERE!

// set svg properties
var svgWidth = 960;
var svgHeight = 500;

// margins
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart

var svg = d3.select("#scatter")
            .append("svg")
            .attr("width",svgWidth)
            .attr("height",svgHeight);

// append SVG group
var chartGroup = svg.append("g")
                    .attr("transform",`translate(${margin.left},${margin.top})`);

var textGroup = svg.append("g")
                    .attr("transform",`translate(${margin.left},${margin.top})`)

// initial parameters

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function for updating x scale on click
function xScale(censData,chosenXAxis){
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censData, d => d[chosenXAxis]) * 0.8,
            d3.max(censData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0,width]);
    return xLinearScale;
}

// function for updating y scale on click
function yScale(censData,chosenYAxis){
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censData, d => d[chosenYAxis]) * 0.8,
            d3.max(censData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height,0]);
    return yLinearScale;
}

// function for updating xAxis on click
function renderXAxes(newXscale,xAxis) {
    var bottomAxis = d3.axisBottom(newXscale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

// function for updating yAxis on click
function renderYAxes(newYscale,yAxis) {
    var leftAxis = d3.axisLeft(newYscale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      
    return circlesGroup;
}
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]))
  
    return circlesGroup;
}
function renderXText(circleText, newXScale, chosenXAxis) {

    circleText.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      
    return circleText;
}
function renderYText(circleText, newYScale, chosenYAxis) {

    circleText.transition()
      .duration(1000)
      .attr("y", d => newYScale(d[chosenYAxis]))
  
    return circleText;
}
// Retrieve data from the CSV
d3.csv("assets/data/data.csv").then(function(censData) {
    // if (err) throw err;
    console.log(censData);
    console.log("complete");
    // parse data
    censData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        // bonus
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.income = +data.income;
    });
    //Linear scale function
    var xLinearScale = xScale(censData,chosenXAxis);

    // y scale func
    var yLinearScale = yScale(censData,chosenYAxis);
    
    // initial axis func
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // apend x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis",true)
        .attr("transform",`translate(0,${height})`)
        .call(bottomAxis);
    //apend y axis
    var yAxis = chartGroup.append("g")
        // .classed("y-axis",true)
        .call(leftAxis);

    // append initial scatter points
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censData)
        .enter()
        .append("circle")
        .attr("cx",d => xLinearScale(d[chosenXAxis]))
        .attr("cy",d => yLinearScale(d[chosenYAxis]))
        .attr("r",10)
        .attr("fill","darkblue")
        // .attr("class","circle")
        // .text(function(d){return d.abbr;})
        // .style("fill","white")
        .attr("opacity",".8");

    var circleText = textGroup.selectAll("text")
        .data(censData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .text(function(d){return d.abbr})
        .attr("text-anchor", "middle")
        .attr('alignment-baseline', 'middle')
        .attr('font-size','10px')
        .style('fill', 'white')
        .attr('font-weight','bold');
    
    // group for 3 x-axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform",`translate(${width / 2},${height + 10})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x",0)
        .attr("y",20)
        .attr("value","poverty")
        .classed("active",true)
        .text("In Poverty (%)");
    
    var ageLabel = labelsGroup.append("text")
        .attr("x",0)
        .attr("y",40)
        .attr("value","age")
        .classed("inactive",true)
        .text("Age (Median)");
    
    var incomeLabel = labelsGroup.append("text")
        .attr("x",0)
        .attr("y",60)
        .attr("value","income")
        .classed("inactive",true)
        .text("Household Income (Median)");

    // group for 3 y axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform",`translate(${0 - margin.left},${height / 2})`);

    var healthcareLabel = yLabelsGroup.append("text")
        .attr("x",0)
        .attr("y",60)
        .attr("value","healthcare")
        .classed("active",true)
        .text("Lacks Healthcare (%)")
        .attr("transform","rotate(-90)");

    var smokerLabel = yLabelsGroup.append("text")
        .attr("x",0)
        .attr("y",40)
        .attr("value","smokes")
        .classed("inactive",true)
        .text("Smokers (%)")
        .attr("transform","rotate(-90)");

    var obeseLabel = yLabelsGroup.append("text")
        .attr("x",0)
        .attr("y",20)
        .attr("value","obesity")
        .classed("inactive",true)
        .text("Obesity (%)")
        .attr("transform","rotate(-90)");

    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click",function() {
            // get value
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                //replace with selection
                chosenXAxis = value;
                // callback to func
                xLinearScale = xScale(censData,chosenXAxis);
                // updates x axis with trans
                xAxis = renderXAxes(xLinearScale,xAxis);
                // update circles
                circlesGroup = renderXCircles(circlesGroup,xLinearScale,chosenXAxis);
                circleText = renderXText(circleText,xLinearScale,chosenXAxis);
                // change classes
                if (chosenXAxis === "age") {
                    ageLabel
                        .classed("active",true)
                        .classed("inactive",false);
                    povertyLabel
                        .classed("active",false)
                        .classed("inactive",true);
                    incomeLabel
                        .classed("active",false)
                        .classed("inactive",true);
                } else if (chosenXAxis === "income") {
                    incomeLabel
                        .classed("active",true)
                        .classed("inactive",false);
                    ageLabel
                        .classed("active",false)
                        .classed("inactive",true);
                    povertyLabel
                        .classed("active",false)
                        .classed("inactive",true);
                } else {
                    povertyLabel
                        .classed("active",true)
                        .classed("inactive",false);
                    ageLabel
                        .classed("active",false)
                        .classed("inactive",true);
                    incomeLabel
                        .classed("active",false)
                        .classed("inactive",true);
                }
            }
        });
    // y axis labels event listener
    yLabelsGroup.selectAll("text")
    .on("click",function() {
        // get value
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
            //replace with selection
            chosenYAxis = value;
            // callback to func
            yLinearScale = yScale(censData,chosenYAxis);
            // updates x axis with trans
            yAxis = renderYAxes(yLinearScale,yAxis);
            // update circles
            circlesGroup = renderYCircles(circlesGroup,yLinearScale,chosenYAxis);
            circleText = renderYText(circleText,yLinearScale,chosenYAxis);
            // change classes
            if (chosenYAxis === "smokes") {
                smokerLabel
                    .classed("active",true)
                    .classed("inactive",false);
                healthcareLabel
                    .classed("active",false)
                    .classed("inactive",true);
                obeseLabel
                    .classed("active",false)
                    .classed("inactive",true);
            } else if (chosenYAxis === "obesity") {
                obeseLabel
                    .classed("active",true)
                    .classed("inactive",false);
                smokerLabel
                    .classed("active",false)
                    .classed("inactive",true);
                healthcareLabel
                    .classed("active",false)
                    .classed("inactive",true);
            } else {
                healthcareLabel
                    .classed("active",true)
                    .classed("inactive",false);
                smokerLabel
                    .classed("active",false)
                    .classed("inactive",true);
                obeseLabel
                    .classed("active",false)
                    .classed("inactive",true);
            }
        }
    });
    



            });
//         }

    
// });