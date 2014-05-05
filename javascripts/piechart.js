
var colors=[
	{color:"#DF0101"},
	{color:"#F0E400"},
	{color:"#848484"},
	{color:"#01DF01"},
	{color:"#2E9AFE"},
        {color:"#8904B1"},
        {color:"#01DFD7"},
        {color:"#190707"}
];

var svg;

var dataset = {};

function changeData(value){
        var choice;
        if(value == 0) {
            choice = "revenue";
        }
        else if(value == 1) {
            choice = "tuition02_tf"
        }
        else if(value == 2) {
            choice = "inst_grant_avg"
        }
        else if(value == 3) {
            choice = "fed_grant_avg_amount";
        }
        else if(value == 4) {
            choice = "state_grant_avg_amount";
        }
        else {
            choice = "loan_avg_amount";
        }
	PieChart.transition("pieChart", dataset, choice, 130, 100, 30, 0.3);
}

function setUpData(datafile){
    d3.select("#svgbox")
                .append("form")
                .html('<form>' +
                            '<label><input type="radio" name="dataset" value="revenue" onclick="changeData(0);"> Revenue</label>' +
                            '<label><input type="radio" name="dataset" value="tuition02_tf" onclick="changeData(1);"> Tuition</label>' +
                            '<label><input type="radio" name="dataset" value="inst_grant_avg" onclick="changeData(2);" checked> Average University Grants</label>' +
                            '<label><input type="radio" name="dataset" value="fed_grant_avg_amount" onclick="changeData(3);"> Average Federal Grants</label>' +
                            '<label><input type="radio" name="dataset" value="state_grant_avg_amount" onclick="changeData(4);"> Average State Grants</label>' +
                            '<label><input type="radio" name="dataset" value="loan_avg_amount" onclick="changeData(5);"> Average Loan Amount</label>' +
                        '</form>')
                .attr('id', 'form');
    
    svg = d3.select("#svgbox").append("svg")
            .attr("id", "topsvg")
            .append("svg")
            .attr("width",700)
            .attr("height",300);

    svg.append("g").attr("id","pieChart");

    
    d3.csv(datafile, function(error, data) {
        var i = 0;
        data.map(function(d) {
            d.tuition02_tf = +d.tuition02_tf;
            d.revenue = +d.revenue;
            d.control = +d.control;
            d.total_enrollment = +d.total_enrollment;
            d.fed_grant_avg_amount = +d.fed_grant_avg_amount;
            d.state_grant_avg_amount = +d.state_grant_avg_amount;
            d.loan_avg_amount = +d.loan_avg_amount;
            d.inst_grant_avg = +d.inst_grant_avg;
            d.color = colors[i].color;
            d.label = colors[i].label;
            i++;
        });
        dataset = data;
        PieChart.draw("pieChart", dataset, 'inst_grant_avg', 150, 150, 130, 100, 30, 0.3);
    });
    
}

function createPie(datafile){
    dataset = new Array();
    
    if(schoolList.length > 8)
    {
        console.log(schoolList.shift());
        
    }
    
    d3.select("#svgbox")
                .append("form")
                .html('<form>' +
                            '<label><input type="radio" name="dataset" value="revenue" onclick="changeData(0);"> Revenue</label>' +
                            '<label><input type="radio" name="dataset" value="tuition02_tf" onclick="changeData(1);"> Tuition</label>' +
                            '<label><input type="radio" name="dataset" value="inst_grant_avg" onclick="changeData(2);" checked> Average University Grants</label>' +
                            '<label><input type="radio" name="dataset" value="fed_grant_avg_amount" onclick="changeData(3);"> Average Federal Grants</label>' +
                            '<label><input type="radio" name="dataset" value="state_grant_avg_amount" onclick="changeData(4);"> Average State Grants</label>' +
                            '<label><input type="radio" name="dataset" value="loan_avg_amount" onclick="changeData(5);"> Average Loan Amount</label>' +
                        '</form>')
                .attr('id', 'form');
    
    svg = d3.select("#svgbox").append("svg")
            .attr("id", "topsvg")
            .append("svg")
            .attr("width",700)
            .attr("height",300);

    svg.append("g").attr("id","pieChart");


    var i = 0;
    d3.csv(datafile, function(error, data) {
        schoolList.forEach(function(s){
        
            data.forEach(function(d){

                if(d.instname == s){
                    console.log(d.instname);
                    dataset.push({instname: d.instname,
                        tuition02_tf: +d.tuition02_tf,
                        revenue: +d.revenue,
                        control: +d.control,
                        total_enrollment: +d.total_enrollment,
                        fed_grant_avg_amount: +d.fed_grant_avg_amount,
                        state_grant_avg_amount: +d.state_grant_avg_amount,
                        loan_avg_amount: +d.loan_avg_amount,
                        inst_grant_avg: +d.inst_grant_avg,
                        color: colors[i].color,
                        label: colors[i].label
                    });
                    i++;
                }

            })
        
        
        });
        
        PieChart.draw("pieChart", dataset, 'inst_grant_avg', 150, 150, 130, 100, 30, 0.3);
    });
    
}

!function(){
	var PieChart={};
        var format = d3.format('$,');
        var comma = d3.format(',');
            
	function pieTop(d, rx, ry, ir ){
		if(d.endAngle - d.startAngle == 0 ) return "M 0 0";
		var sx = rx*Math.cos(d.startAngle),
                    sy = ry*Math.sin(d.startAngle),
                    ex = rx*Math.cos(d.endAngle),
                    ey = ry*Math.sin(d.endAngle);
			
		var ret =[];
		ret.push("M",sx,sy,"A",rx,ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0),"1",ex,ey,"L",ir*ex,ir*ey);
		ret.push("A",ir*rx,ir*ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0), "0",ir*sx,ir*sy,"z");
		return ret.join(" ");
	}

	function pieOuter(d, rx, ry, h ){
		var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
		var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);
		
		var sx = rx*Math.cos(startAngle),
                    sy = ry*Math.sin(startAngle),
                    ex = rx*Math.cos(endAngle),
                    ey = ry*Math.sin(endAngle);
			
		var ret =[];
		ret.push("M",sx,h+sy,"A",rx,ry,"0 0 1",ex,h+ey,"L",ex,ey,"A",rx,ry,"0 0 0",sx,sy,"z");
                return ret.join(" ");
	}

	function pieInner(d, rx, ry, h, ir ){
		var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
		var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);
		
		var sx = ir*rx*Math.cos(startAngle),
                    sy = ir*ry*Math.sin(startAngle),
                    ex = ir*rx*Math.cos(endAngle),
                    ey = ir*ry*Math.sin(endAngle);

		var ret =[];
		ret.push("M",sx, sy,"A",ir*rx,ir*ry,"0 0 1",ex,ey, "L",ex,h+ey,"A",ir*rx, ir*ry,"0 0 0",sx,h+sy,"z");
		return ret.join(" ");
	}

	function getPercent(d){
		return (d.endAngle-d.startAngle > 0.2 ? 
				Math.round(1000*(d.endAngle-d.startAngle)/(Math.PI*2))/10+'%' : '');
	}	
	
	PieChart.transition = function(id, data, choice, rx, ry, h, ir){
		function arcTweenInner(a) {
		  var i = d3.interpolate(this._current, a);
		  this._current = i(0);
		  return function(t) { return pieInner(i(t), rx+0.5, ry+0.5, h, ir);  };
		}
		function arcTweenTop(a) {
		  var i = d3.interpolate(this._current, a);
		  this._current = i(0);
		  return function(t) { return pieTop(i(t), rx, ry, ir);  };
		}
		function arcTweenOuter(a) {
		  var i = d3.interpolate(this._current, a);
		  this._current = i(0);
		  return function(t) { return pieOuter(i(t), rx-.5, ry-.5, h);  };
		}
		function textTweenX(a) {
		  var i = d3.interpolate(this._current, a);
		  this._current = i(0);
		  return function(t) { return 0.6*rx*Math.cos(0.5*(i(t).startAngle+i(t).endAngle));  };
		}
		function textTweenY(a) {
		  var i = d3.interpolate(this._current, a);
		  this._current = i(0);
		  return function(t) { return 0.6*rx*Math.sin(0.5*(i(t).startAngle+i(t).endAngle));  };
		}
		
		var _data = d3.layout
                        .pie()
                        .sort(null)
                        .value(function(d) {return d[choice];})(data);
		
		d3.select("#"+id)
                        .selectAll(".innerSlice")
                        .data(_data)
			.transition()
                        .duration(750)
                        .attrTween("d", arcTweenInner); 
			
		d3.select("#"+id)
                        .selectAll(".topSlice")
                        .data(_data)
			.transition()
                        .duration(750)
                        .attrTween("d", arcTweenTop); 
			
		d3.select("#"+id)
                        .selectAll(".outerSlice")
                        .data(_data)
			.transition()
                        .duration(750)
                        .attrTween("d", arcTweenOuter); 	
			
		d3.select("#"+id)
                        .selectAll(".percent")
                        .data(_data)
                        .transition()
                        .duration(750)
			.attrTween("x",textTweenX)
                        .attrTween("y",textTweenY)
                        .text(getPercent); 	
	}
	
	PieChart.draw=function(id, data, choice, x , y, rx, ry, h, ir){
                
		var _data = d3.layout
                        .pie()
                        .sort(null)
                        .value(function(d) {return d[choice];})(data);
		
		var slices = d3.select("#"+id)
                        .append("g")
                        .attr("transform", "translate(" + x + "," + y + ")")
			.attr("class", "slices");
			
		slices.selectAll(".innerSlice")
                        .data(_data)
                        .enter()
                        .append("path")
                        .attr("class", "innerSlice")
			.style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
			.attr("d",function(d){ return pieInner(d, rx+0.5,ry+0.5, h, ir);})
			.each(function(d){this._current=d;});
		
                tooltip = d3.select("#svgbox").append("tooltip")
                    .attr("id", "tooltip")
                    .style("opacity", 0);

		slices.selectAll(".topSlice")
                        .data(_data)
                        .enter()
                        .append("path")
                        .attr("class", "topSlice")
			.style("fill", function(d) { return d.data.color; })
			.style("stroke", function(d) { return d.data.color; })
			.attr("d",function(d){ return pieTop(d, rx, ry, ir);})
			.each(function(d){this._current=d;})
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
                            tooltip.html("<br/>" +d.data.instname + "<br/> Tuition: " + format(d.data.tuition02_tf)
                                    + "<br/> Revenue: " + format(d.data.revenue)
                                    + "<br/> Type: " + control
                                    + "<br/> Total Enrollment: " + comma(d.data.total_enrollment)
                                    + "<br/> Avergage University Grants: " + format(d.data.inst_grant_avg)
                                    + "<br/> Avergage Federal Grants: " + format(d.data.fed_grant_avg_amount)
                                    + "<br/> Avergage State Grants: " + format(d.data.state_grant_avg_amount)
                                    + "<br/> Average Loan Amount: " + format(d.data.loan_avg_amount));
                        })
                                
                        .on("mouseout", function(d) {
                            d3.select(this).style("fill", d.data.color);
                            tooltip.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                        });
		
		slices.selectAll(".outerSlice")
                        .data(_data)
                        .enter()
                        .append("path")
                        .attr("class", "outerSlice")
			.style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
			.attr("d",function(d){ return pieOuter(d, rx-.5,ry-.5, h);})
			.each(function(d){this._current=d;});

		slices.selectAll(".percent")
                        .data(_data)
                        .enter()
                        .append("text")
                        .attr("class", "percent")
			.attr("x",function(d){ return 0.6*rx*Math.cos(0.5*(d.startAngle+d.endAngle));})
			.attr("y",function(d){ return 0.6*ry*Math.sin(0.5*(d.startAngle+d.endAngle));})
			.text(getPercent)
                        .each(function(d){this._current=d;});				
	}
	
	this.PieChart = PieChart;
}();