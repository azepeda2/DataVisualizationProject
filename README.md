DataVisualizationProject
========================

cs490/cs690

The United States College Information System

User Documentation

You can find a description of the USCIS project on the following GitHub page : http://azepeda2.github.io/DataVisualizationProject/index.html

You can access the USCIS application from the following GitHub page: http://azepeda2.github.io/DataVisualizationProject/USCIS.html

From the main application page, you can choose which visualiation you want displayed. You can choose from a scatter plot, pie chart, choropleth map, or a bar chart. There is also a search box that allows you to search for specific universities, which adds them to a list of up to eight different choices. This list is displayed underneath the search box and the schools are compared through the pie chart visualization. 

When using the scatter plot visualization, you may set the values displayed on the x-axis and y-axis. You can choose from tuition, revenue, total enrollment, average federal grants, average state grants, average university grants, average loans taken, total degrees awarded, and total employees. You can also choose to highlight the public universities, highlight the private universities, or color all of the points the same color. If you hover over a particular point, you will be presented with a list of information on the university. This includes: tuition, revenue, total enrollment, average federal grants, average state grants, average university grants, average loans taken, total degrees awarded, total employees, and if it's a public or private university.

When using the pie chart, you may choose to compare the universities by revenue, tuition, average federal grants, average state grants, average university grants, and average loans taken. If you hover over a particular slice, you will be presented with information about the university. This includes: the name of the university, tuition, revenue, whether it's public or private, total enrollment, average university grants, average federal grants, average state grants, and average loan amount. You can add a specific university to be displayed by searching for it using the search box on the right side of the page. You can select up to eight different universities to be displayed. As you add more than eight schools to your list, only the eight most recent schools will be kept. If you have not added any university to your search list, a pre-selected list of top five schools based on university grants is displayed for you. You can also choose to clear the list of selected schools. 

The Map Module creates a visual representation of state total values in the form of a choropleth map. Our method for determining state values calculates the total value for each state, gets the state average, and fills in the state with a certain color depth depending on the value.  For example, the states with the lower average value are represented with a lighter color while the states with higher average value are represented with darker color. There is a legend underneath the map that signifies which color represents very low, low, medium, high, and very high. If you hover over a particular state, the Map Module will present you with the state name, state total, andf state average for the chosen value. You can choose between tuition, revenue, average university grants, average state grants, average federal grants, or average loans taken. Each individual university is represented on the map by a point, which can also be hovered over and presents information on that particular univerisity. This information includes the univerisity's tuition, revenue, average university grants, average state grants, average federal grants, average loans taken, total students enrolled, total degrees awarded, and total employees. 

When using the bar chart, you can choose to sort or unsort the data. You can also select which value is being displayed ranging from the university's tuition, revenue, average university grants, average state grants, average federal grants, average loans taken, total students enrolled, total degrees awarded, and total employees. The y-axis represents the value being compared, while the x-axis contains each universities' bar along with its name. You can choose to highlight the public schools, private schools, or keep them the same color.

Developer Documentation

If you are a developer and/or would to see the source code for yourself, feel free to fork a copy of the project at: https://github.com/azepeda2/DataVisualizationProject You can also dowload a zip version of the project at: https://github.com/azepeda2/DataVisualizationProject/zipball/master or a tar.gz version at: https://github.com/azepeda2/DataVisualizationProject/tarball/master .

The languages used to develop this project include HTML5, JavaScript, and D3 (a JavaScript library). Netbeans is my preferred IDE to work in HTML5, JavaScript, and D3, but you can choose which to use.

If you are looking to see how these visualizations are implemented, you find a javascript for each visualization in the javascripts/ directory of the project. These include: piechart.js, scatterplot.js, map.js, and barchart.js. These implementations include the use of D3 and JavaScript. The main file which integrates all of the visualizations is located in the USCIS.html file in the root directory. Here you will find functions that create each visualization as well as the forms that allow the user to change visualization. If you want to add more visualizations, this is where you would incorporate your code. This is written in HTML5 and JavaScript. 
