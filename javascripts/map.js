var width = 1200,
    height = 500;

var dataset;
var map;
var stateTotal, stateAvg;
var schoolinfo;
var background;

var color = d3.scale.quantize()
        .domain([0, 0.04, 0.8, 1.2, 1.6])
        .range(["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"]);


function setMap(choice){
    
    schoolinfo = d3.select("#main_content_wrap.outer")
            .append("div")
            .attr("id", "schoolinfo");
    
    d3.csv("data/map.csv", function(error, data) {
        data.forEach(function(d){
            d.tuition02_tf = +d.tuition02_tf;
            d.revenue = +d.revenue;
            d.control = +d.control;
            d.total_enrollment = +d.total_enrollment;
            d.inst_grant_avg = +d.inst_grant_avg;
            d.LATITUDE = +d.LATITUDE;
            d.LONGITUD = +d.LONGITUD;
            d.all_employees = +d.all_employees;
            d.fed_grant_avg_amount = +d.fed_grant_avg_amount;
            d.state_grant_avg_amount = +d.state_grant_avg_amount;
            d.loan_avg_amount = +d.loan_avg_amount;
        });
        if(choice == 0){
            var total = d3.mean(data, function(d) { return d.revenue; });
        } else if(choice == 1){
            var total = d3.mean(data, function(d) { return d.tuition02_tf; });
        } else if(choice == 2){
            var total = d3.mean(data, function(d) { return d.inst_grant_avg; });
        } else if(choice == 3){
            var total = d3.mean(data, function(d) { return d.fed_grant_avg_amount; });
        } else if(choice == 4){
            var total = d3.mean(data, function(d) { return d.state_grant_avg_amount; });
        } else if(choice == 5){
            var total = d3.mean(data, function(d) { return d.loan_avg_amount; });
        }
        
        d3.json("json/us.json", function(error, us) {
            
            d3.select("#svgbox").append("form")
                    .html('<form>' +
                    '<label><input type="radio" name="dataset" value="revenue" onclick="changeMap(0);" checked> Revenue</label>' +
                            '<label><input type="radio" name="dataset" value="tuition02_tf" onclick="changeMap(1);"> Tuition</label>' +
                            '<label><input type="radio" name="dataset" value="inst_grant_avg" onclick="changeMap(2);"> Average University Grants</label>' +
                            '<label><input type="radio" name="dataset" value="fed_grant_avg_amount" onclick="changeMap(3);"> Average Federal Grants</label>' +
                            '<label><input type="radio" name="dataset" value="state_grant_avg_amount" onclick="changeMap(4);"> Average State Grants</label>' +
                            '<label><input type="radio" name="dataset" value="loan_avg_amount" onclick="changeMap(5);"> Average Loan Amount</label>' +
                    '</form>')
                    .attr("id", "form");
            
            map = d3.select("#svgbox").append("svg")
                    .attr("id", "topsvg")
                    .attr("width",width)
                    .attr("height",height);
            
            var projection = d3.geo.albersUsa()
                    .scale(1000)
                    .translate([width / 2, height / 2]);
            
            var path = d3.geo.path()
                    .projection(projection);
            stateTotal = new Array();
            stateAvg = new Array();
            
            map.selectAll(".states")
                    .data(topojson.feature(us, us.objects.subunit).features)
                    .enter().append("path")
                    .attr("class", "states")
                    .attr("id", function(d){
                        return d.properties.name;})
                    .attr("d", path)
                    .style("fill", function(d) {
                        
                        var count = 0;
                        data.forEach(function(e){

                            if(d.properties.name == e.state) {
                                if(choice == 0){
                                    if(typeof stateTotal[d.properties.name] != "undefined")
                                        stateTotal[e.state] = stateTotal[e.state] + e.revenue;
                                    else
                                        stateTotal[e.state] =  e.revenue;
                                    count++;
                                }else if(choice == 1){
                                    if(typeof stateTotal[d.properties.name] != "undefined")
                                        stateTotal[e.state] = stateTotal[e.state] + e.tuition02_tf;
                                    else
                                        stateTotal[e.state] =  e.tuition02_tf;
                                    count++;
                                } else if(choice == 2){
                                    if(typeof stateTotal[d.properties.name] != "undefined")
                                        stateTotal[e.state] = stateTotal[e.state] + e.inst_grant_avg;
                                    else
                                        stateTotal[e.state] =  e.inst_grant_avg;
                                    count++;
                                } else if(choice == 3){
                                    if(typeof stateTotal[d.properties.name] != "undefined")
                                        stateTotal[e.state] = stateTotal[e.state] + e.fed_grant_avg_amount;
                                    else
                                        stateTotal[e.state] =  e.fed_grant_avg_amount;
                                    count++;
                                } else if(choice == 4){
                                    if(typeof stateTotal[d.properties.name] != "undefined")
                                        stateTotal[e.state] = stateTotal[e.state] + e.state_grant_avg_amount;
                                    else
                                        stateTotal[e.state] =  e.state_grant_avg_amount;
                                    count++;
                                } else if(choice == 5){
                                    if(typeof stateTotal[d.properties.name] != "undefined")
                                        stateTotal[e.state] = stateTotal[e.state] + e.loan_avg_amount;
                                    else
                                        stateTotal[e.state] =  e.loan_avg_amount;
                                    count++;
                                }
                            }

                        })
                
                        if(typeof stateTotal[d.properties.name] === "undefined") {
                            return color(0);

                        } else {                  
                            stateAvg[d.properties.name] = stateTotal[d.properties.name]/count;
                            var ratio = (stateAvg[d.properties.name])/total;
                            return color(ratio);
                        }

                    })
            .on("mouseover", function(d) {
                        hoverOnState(d);
            })
            .on("mouseout", function(d) {
                        hoverOutState();
            });
            
            map.selectAll(".circle")
                   .data(data)
                   .enter()
                   .append("circle")
                   .attr("r",2)
                   .attr("fill", "black")
                   .attr("opacity",0.3)
                   .attr("transform", function(d) {
                         if(d.LONGITUD !== 0 && d.LATITUDE !== 0){
                            return "translate(" + projection([d.LONGITUD,d.LATITUDE]) + ")"}
                    })
                    .on("mouseover", function(d) {
                        hoverOutState();
                        var control;
                        if(d["control"] == 2)
                            control = "private";
                        else
                            control = "public";
                        d3.select(this).style("fill", "white");
                        schoolinfo.transition()
                                .style("opacity", 2)
                                .style("color", "black");
                        schoolinfo.html("<h4>" + d["instname"] + "<br/> Tuition: " + format(d["tuition02_tf"])
                        + "<br/> Revenue: " + format(d["revenue"])
                        + "<br/> Type: " + control
                        + "<br/> Total Enrollment: " + comma(d["total_enrollment"])
                        + "<br/> Total Employees: " + comma(d["all_employees"])
                        + "<br/> Average Federal Grants: " + format(d["fed_grant_avg_amount"])
                        + "<br/> Average State Grants: " + format(d["state_grant_avg_amount"])
                        + "<br/> Average University Grants: " + format(d["inst_grant_avg"])
                        + "<br/> Average Loans Taken: " + format(d["loan_avg_amount"])
                        + "<br/> Total Degrees Awarded: " + comma(d["totaldegrees"]) + "<h4/>");
                    })

                    .on("mouseout", function(d) {
                        d3.select(this).style("fill", "black");
                        schoolinfo.transition()
                                .style("opacity", 0);
                    });
            
            var legend = d3.select('#svgbox')
                    .append('ul')
                    .attr("id", "tooltip");
            
            var keys = legend.selectAll('li.key')
                    .data(color.range());
            var r = ["very low", "low", "medium", "high", "very high"];
            var i = 0;
            keys.enter().append('li')
                    .attr('class', 'key')
                    .style('border-top-color', String)
                    .text(function(d) {
                        return (r[i++]);
            });
            
        });
        dataset = data;
        
    });
}

function changeMap(choice) {
    if(choice == 0){
        var total = d3.mean(dataset, function(d) { return d.revenue; });
    } else if(choice == 1){
        var total = d3.mean(dataset, function(d) { return d.tuition02_tf; });
    } else {
        var total = d3.mean(dataset, function(d) { return d.inst_grant_avg; });
    }
    stateTotal = new Array();
    
    map.selectAll(".states")
            .style("fill", function(d) {
                
                var count = 0;
                dataset.forEach(function(e){

                    if(d.properties.name == e.state) {

                        if(choice == 0){
                            if(typeof stateTotal[d.properties.name] != "undefined")
                                stateTotal[e.state] = stateTotal[e.state] + e.revenue;
                            else
                                stateTotal[e.state] =  e.revenue;
                            count++;
                        } else if(choice == 1){
                            if(typeof stateTotal[d.properties.name] != "undefined")
                                stateTotal[e.state] = stateTotal[e.state] + e.tuition02_tf;
                            else
                                stateTotal[e.state] =  e.tuition02_tf;
                            count++;
                        } else if(choice == 2){
                            if(typeof stateTotal[d.properties.name] != "undefined")
                                stateTotal[e.state] = stateTotal[e.state] + e.inst_grant_avg;
                            else
                                stateTotal[e.state] =  e.inst_grant_avg;
                            count++;
                        } else if(choice == 3){
                            if(typeof stateTotal[d.properties.name] != "undefined")
                                stateTotal[e.state] = stateTotal[e.state] + e.fed_grant_avg_amount;
                            else
                                stateTotal[e.state] =  e.fed_grant_avg_amount;
                            count++;
                        } else if(choice == 4){
                            if(typeof stateTotal[d.properties.name] != "undefined")
                                stateTotal[e.state] = stateTotal[e.state] + e.state_grant_avg_amount;
                            else
                                stateTotal[e.state] =  e.state_grant_avg_amount;
                            count++;
                        } else if(choice == 5){
                            if(typeof stateTotal[d.properties.name] != "undefined")
                                stateTotal[e.state] = stateTotal[e.state] + e.loan_avg_amount;
                            else
                                stateTotal[e.state] =  e.loan_avg_amount;
                            count++;
                        }
                    }

                })

                if(typeof stateTotal[d.properties.name] === "undefined") {
                    return color(0);

                } else {
                    stateAvg[d.properties.name] = stateTotal[d.properties.name]/count;
                    var ratio = (stateAvg[d.properties.name])/total;
                    return color(ratio);
                }

            })
    .on("mouseover", function(d) {
        hoverOnState(d);
    })
    .on("mouseout", function(d) {
        hoverOutState();
    });
    
}

function hoverOnState(handle){    
    var labelText = "<h4><p>" + handle.properties.name + "</br> State Total: " + 
            format(stateTotal[handle.properties.name].toFixed(0)) + "</br> State Average: " +
            format(stateAvg[handle.properties.name].toFixed(0)) + "</p></h4>";
    
    var infolabel = d3.select("#svgbox")
            .append("div")
            .attr("id", "stateinfo")
            .html(labelText); 
}

function hoverOutState(){
    d3.select("#stateinfo").remove(); //remove info label
}
