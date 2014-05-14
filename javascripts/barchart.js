var barmargin = {top: 20, right: 20, bottom: 230, left: 40},
        barwidth = 960 - barmargin.left - barmargin.right,
        barheight = 750 - barmargin.top - barmargin.bottom;

var format = d3.format('$,');
var comma = d3.format(',');

var x = d3.scale.ordinal()
        .rangeRoundBands([0, barwidth], .1, 1);

var y = d3.scale.linear()
        .range([barheight, 0]);

var xaxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

var yaxis = d3.svg.axis()
        .scale(y)
        .orient("left");

var svg;
var data;
var choice = 0;
var format = d3.format('$,');
var comma = d3.format(',');

var yvar = "revenue",
    yname = "Total Revenue";

function createBarChart() 
{
    d3.select("#svgbox")
                .append("form")
                .html('<form>' +
                'Select value for y-axis:' +
                '<select id="barList" onchange="chooseBarCategory()">' +
                    '<option value="tuition02_tf">Tuition</option>' +
                    '<option value="revenue">Total Revenue</option>' +
                    '<option value="total_enrollment">Total Enrollment</option>' +
                    '<option value="fed_grant_avg_amount">Average Federal Grants</option>' +
                    '<option value="state_grant_avg_amount">Average State Grants</option>' +
                    '<option value="inst_grant_avg">Average University Grants</option>' +
                    '<option value="loan_avg_amount">Average Loans Taken</option>' +
                    '<option value="totaldegrees">Total Degrees Awarded</option>' +
                    '<option value="all_employees">Total Employees</option>' +
                '</select>' +

            '</form>' +

            
            '<label><input id="sort" type="checkbox"> Sort values</label>' +
            '<form>' +
                '<label><input type="radio" name="control" value="revenue" onclick="highlightBars(0);" checked>' + "Don't Highlight</label>" +
                '<label><input type="radio" name="control" value="revenue" onclick="highlightBars(1);"> Highlight Public</label>' +
                '<label><input type="radio" name="control" value="tuition" onclick="highlightBars(2);"> Highlight Private </label>' +
            '</form>')
            .attr('id', 'form');
    
    // adding graph to page
    svg = d3.select("#svgbox").append("svg")
            .attr("id", "topsvg")
            .attr("width", barwidth + barmargin.left + barmargin.right)
            .attr("height", barheight + barmargin.top + barmargin.bottom)
            .append("g")
            .attr("transform", "translate(" + barmargin.left + "," + barmargin.top + ")");
    
    d3.csv("data/top50Tuition.csv", function(error, dataset) {

      dataset.forEach(function(d) {
                d.tuition02_tf = +d.tuition02_tf;
                d.revenue = +d.revenue;
                d.control = +d.control;
                d.total_enrollment = +d.total_enrollment;
                d.fed_grant_avg_amount = +d.fed_grant_avg_amount;
                d.state_grant_avg_amount = +d.state_grant_avg_amount;
                d.inst_grant_avg = +d.inst_grant_avg;
                d.loan_avg_amount = +d.loan_avg_amount;
                d.totaldegrees = +d.totaldegrees;
                d.all_employees = +d.all_employees;  
            });
            
            data = dataset;
            updateBarChart(data);
    });
}

function updateBarChart(data)
{
    x.domain(data.map(function(d) { return d.instname; }));
    y.domain([0, d3.max(data, function(d) { return d[yvar]; })]);

    if(yvar == "total_enrollment" || yvar == "totaldegrees")
        yaxis.tickFormat(d3.format(".3s"));
    else
        yaxis.tickFormat(d3.format("$.3s"));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + barheight + ")")
        .call(xaxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-90) translate(-15, -15)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yaxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yname);

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.instname); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d[yvar]); })
        .attr("height", function(d) { return barheight - y(d[yvar]); })
        .attr("fill", "#08519c");
   d3.select("input#sort").on("change", change);
 }
var sortTimeout = setTimeout(function() {
    d3.select("input#sort").property("checked", true).each(change);
}, 2000);


function change() {
    clearTimeout(sortTimeout);

    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b[yvar] - a[yvar]; }
        : function(a, b) { return d3.ascending(a.instname, b.instname); })
        .map(function(d) { return d.instname; }))
        .copy();

    var transition = svg.transition().duration(500),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.instname); });

    transition.select(".x.axis")
        .call(xaxis)
        .selectAll("g")
        .delay(delay);

        svg.selectAll(".x.axis")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-90) translate(-15, -15)");
  }

function chooseBarCategory()
{
    yvar = document.getElementById("barList")
            .options[barList.selectedIndex].value;
    yname = document.getElementById("barList")
            .options[barList.selectedIndex].text;
    svg.selectAll("g")
            .data([])
            .exit()
            .remove();
    removeBars();
    updateBarChart(data);
    
}

function removeBars()
{
    svg.selectAll(".bar")
            .data([])
            .exit()
            .remove();
}

function highlightBars(choice)
{
    svg.selectAll(".bar")
            .style("fill", function(d) {
                if(choice == 1)
                {
                    if(d["control"] == 1)
                        return "#08519c";
                    else
                        return "#D4D4D4";
                }
                else if(choice == 2)
                {
                    if(d["control"] == 2)
                        return "#08519c";
                    else
                        return "#D4D4D4";
                }
                else
                {
                    return "#08519c";
                }
            });
            
}