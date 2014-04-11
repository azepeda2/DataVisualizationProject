var width = 1200,
        height = 500;

var color = d3.scale.linear()
        .domain([0, 0.25])
        .range(["grey", "yellow"]);

setMap(0);


function setMap(choice){
    d3.select("svg")
            .data([])
            .exit()
            .remove();
    
    d3.csv("../data/top100Grants.csv", function(error, data) {
        data.forEach(function(d){
            d.tuition = +d.tuition;
            d.revenue = +d.revenue;
            d.inst_grant_avg = +d.inst_grant_avg;
        });

        if(choice == 0){
            var total = d3.sum(data, function(d) { return d.revenue; });
        } else if(choice == 1){
            var total = d3.sum(data, function(d) { return d.tuition; });
        } else {
            var total = d3.sum(data, function(d) { return d.inst_grant_avg; });
        }
        
        d3.json("../json/us.json", function(error, us) {
            
            var map = d3.select("body").append("svg")
                    .attr("width",width)
                    .attr("height",height)
                    .attr("class", "map");
            
            var projection = d3.geo.albersUsa()
                    .scale(1000)
                    .translate([width / 2, height / 2]);
            
            var path = d3.geo.path()
                    .projection(projection);
            
            map.selectAll(".states")
                    .data(topojson.feature(us, us.objects.subunit).features)
                    .enter().append("path")
                    .attr("class", "states")
                    .attr("id", function(d){
                        return d.properties.name;})
                    .attr("d", path)
                    .style("fill", function(d) {
                        
                        var stateTotal = new Array();
                        data.forEach(function(e){

                            if(d.properties.name == e.state) {
                                //document.write(e.state);
                                //document.write(e.revenue);
                                if(choice == 0){
                                    if(typeof stateTotal[d.properties.name] != "undefined")
                                        stateTotal[e.state] = stateTotal[e.state] + e.revenue;
                                    else
                                        stateTotal[e.state] =  e.revenue;

                                }else if(choice == 1){
                                    if(typeof stateTotal[d.properties.name] != "undefined")
                                        stateTotal[e.state] = stateTotal[e.state] + e.tuition;
                                    else
                                        stateTotal[e.state] =  e.tuition;
                                } else {
                                    if(typeof stateTotal[d.properties.name] != "undefined")
                                        stateTotal[e.state] = stateTotal[e.state] + e.inst_grant_avg;
                                    else
                                        stateTotal[e.state] =  e.inst_grant_avg;
                                }
                            }

                        })

                        if(typeof stateTotal[d.properties.name] === "undefined") {
                                //document.write(stateTotal[d.properties.name]);
                                //document.write("</br>");
                                return color(0);

                        } else {
                               // document.write(stateTotal[d.properties.name]);
                                //document.write("</br>");
                                var ratio = stateTotal[d.properties.name]/total;
                                //document.write(ratio);document.write("</br>");
                                return color(ratio);
                            }

                    })
                    .on("onHover", function(d) {
                        d3.select(this)
                        .style('stroke', '#979697')
                        .style('stroke-width', '4px');
                if(!isIE){
                    moveToFront.call(this.parentNode);
                    moveToFront.call(this);
                }
                hoverOnState(d.properties);
            })
                    .on("outHover", function(d) {
                        d3.select(this)
                        .style('stroke', '#D4D4D4')
                        .style('stroke-width', '1px');
                hoverOutState();
            })
                    .on("mousemove", moveMapLabel);
                    
        });
    });
}



function hoverOnState(handle){
    var text = "empty for now";
    
    var labelText = "<h1><i>" + handle.state + "</i></h1><p>" + text + "</p>";
    
    var infolabel = d3.select("body")
            .append("div")
            .attr("class", "infolabel") 
            .html(labelText)
            .moveToFront(); 
}

function hoverOutState(){
    d3.select(".infolabel").remove(); //remove info label
}

function moveMapLabel() {
    
    var x = d3.event.clientX; 
    var y = d3.event.clientY - 10; 
    
    //at center coordinates of div, switch side of mouse on which infolabel appears
    var switchIt = 0;
    if (x < 930){
        switchIt = 40;
    }else{
        switchIt = -250;
    }
    
    var mug = d3.select(".infolabel") 
            .style("left", (x+switchIt) +"px")
            .style("top", y + "px");
}