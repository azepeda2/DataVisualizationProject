var svg;
var tooltip;
var data;
var background;
var choice = 0;
var format = d3.format('$,');
var comma = d3.format(',');

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var xvar = "tuition03_tf",
    yvar = "tot_rev_w_auxother_sum",
    xname = "Tuition",
    yname = "Total Revenue";

// setting up x 
var xValue = function(d) {return d[xvar];},
        xScale = d3.scale.linear().range([0, width]),
        xMap = function(d) {return xScale(xValue(d));},
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setting up y
var yValue = function(d) {return d[yvar];},
        yScale = d3.scale.linear().range([height, 0]),
        yMap = function(d) {return yScale(yValue(d));},
        yAxis = d3.svg.axis().scale(yScale).orient("left");

function createScatterPlot() {

    d3.select("#svgbox")
                .append("form")
                .html('<form>' +
                'Select value for x-axis:' +
                '<select id="xList" onchange="chooseCategory()">' +
                    '<option value="tuition03_tf">Tuition</option>' +
                    '<option value="tot_rev_w_auxother_sum">Total Revenue</option>' +  
                    '<option value="total_enrollment">Total Enrollment</option>' +
                    '<option value="all_employees">Employees</option>' +
                '</select>' +

                'Select value for y-axis:' +
                '<select id="yList" onchange="chooseCategory()">' +
                    '<option value="tuition03_tf">Tuition</option>' +
                    '<option value="tot_rev_w_auxother_sum">Total Revenue</option>' +
                    '<option value="total_enrollment">Total Enrollment</option>' +
                    '<option value="all_employees">Employees</option>' +
                '</select>' +

            '</form>' +

            '<form>' +
                '<label><input type="radio" name="control" value="revenue" onclick="highlightPoints(0);" checked>' + "Don't Highlight</label>" +
                '<label><input type="radio" name="control" value="revenue" onclick="highlightPoints(1);"> Highlight Public</label>' +
                '<label><input type="radio" name="control" value="tuition" onclick="highlightPoints(2);"> Highlight Private </label>' +
            '</form>')
            .attr('id', 'form');
    
    // adding graph to page
    svg = d3.select("#svgbox").append("svg")
            .attr("id", "topsvg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    tooltip = d3.select("#svgbox").append("div")
            .attr("id", "tooltip")
            .attr("class", "tooltip")
            .style("opacity", 0);

    // load data from file
    d3.csv("data/top50with5categories.csv", function(error, dataset) {

        // ensures data from csv is interpreted as int
        dataset.forEach(function(d) {
            d.tuition03_tf = +d.tuition03_tf;
            d.tot_rev_w_auxother_sum = +d.tot_rev_w_auxother_sum;
            d.control = +d.control;
            d.total_enrollment = +d.total_enrollment;
            d.all_employees = +d.all_employees;
        });

        data = dataset;
        updateChart(data);
        
    });
    
    
};
    
function updateChart(data)
{
    xValue = function(d) {return d[xvar];},
    yValue = function(d) {return d[yvar];},
            
            // setting up the domain for the x and y-axis
    xScale.domain([0, d3.max(data, xValue) + 1]);
    yScale.domain([0, d3.max(data, yValue) + 1]);
    
    if(xvar == "total_enrollment" || xvar == "all_employees")
        xAxis.tickFormat(d3.format(".3s"));
    else
        xAxis.tickFormat(d3.format("$.3s"));
    if(yvar == "total_enrollment" || yvar == "all_employees")
        yAxis.tickFormat(d3.format(".3s"));
    else
        yAxis.tickFormat(d3.format("$.3s"));
    
    // creating the x-axis
    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(xname);
    
    // creating the y-axis
    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(yname);
    
    plotPoints(data);
};

function chooseCategory()
{
    xvar = document.getElementById("xList")
            .options[xList.selectedIndex].value;
    yvar = document.getElementById("yList")
            .options[yList.selectedIndex].value;
    xname = document.getElementById("xList")
            .options[xList.selectedIndex].text,
            yname = document.getElementById("yList")
            .options[yList.selectedIndex].text;
    svg.selectAll("g")
            .data([])
            .exit()
            .remove();
    removePoints();
    updateChart(data);
    
}

function removePoints()
{
    svg.selectAll(".dot")
            .data([])
            .exit()
            .remove();
}
function plotPoints(data)
{
    // plotting the points on to the graph
    svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function(d) {
                if(choice == 1)
                {
                    if(d["control"] == 1)
                        return "#D4D4D4";
                    else
                        return "black";
                }
                else if(choice == 2)
                {
                    if(d["control"] == 2)
                        return "#D4D4D4";
                    else
                        return "black";
                }
            })
            .on("mouseover", function(d) {
                var control;
        if(d["control"] == 1)
            control = "public";
        else
            control = "private";
        d3.select(this).style("fill", "tan");
        tooltip.transition()
                .duration(200)
                .style("opacity", 2)
                .style("color", "black");
        tooltip.html(d["instname"] + "<br/> Tuition: " + format(d["tuition03_tf"])
                + "<br/> Revenue: " + format(d["tot_rev_w_auxother_sum"])
                + "<br/> Type: " + control
                + "<br/> Total Enrollment: " + comma(d["total_enrollment"])
                + "<br/> Total Employees: " + comma(d["all_employees"]))
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        
        background = svg.append("rect")
                .attr("x", (d3.event.pageX - 50))
                .attr("y", (d3.event.pageY - 410))
                .attr("width", 220)
                .attr("height", 120)
                .style("fill", "#f2f2f2");
    })
    
            .on("mouseout", function(d) {
                d3.select(this).style("fill", "black");
        tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        background.transition()
                .duration(500)
                .style("opacity", 0)
                .remove();
    });
    
}

function highlightPoints(control)
{
    choice = control;
    removePoints();
    plotPoints(data);
}