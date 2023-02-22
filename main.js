// Homework 5
// Alex Lee and Jack Kovensky


console.log("linked!")

//create the dimensions for the chart frame
const FRAME_HEIGHT = 600;
const FRAME_WIDTH = 600; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// create dimensions for visualization sizes
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left -MARGINS.right;

//create the first visualization frame for the scatter plot
const FRAME1 = d3.select("#vis")
                    .append("svg")
                        .attr("height", FRAME_HEIGHT)
                        .attr("width", FRAME_WIDTH)
                        .attr("class", "frame");

//creating a function to create the scatter plot that will also read in the data
function scatter_plot() { 
d3.csv("data/scatter-data.csv").then((data) => {

    // grabbing the max of each coordinate for the scales of the graph
    const MAX_X2 = d3.max(data, (d) => {return parseInt(d.x)});

    const MAX_Y2 = d3.max(data, (d) => {return parseInt(d.y)});

    
    const X_SCALE2 = d3.scaleLinear()
                        .domain([0, MAX_X2 + 1])
                        .range([0, VIS_WIDTH]);

    const Y_SCALE2 = d3.scaleLinear()
                        .domain([0, MAX_Y2 + 1])
                        .range([VIS_HEIGHT, 0]);

    // Plotting the circles onto the viz 
    FRAME1.selectAll("circle")
    .data(data) 
    .enter()
    .append("circle")
        .attr("cx", (d) => {return X_SCALE2(d.x) + MARGINS.left})
        .attr("cy", (d) => {return Y_SCALE2(d.y) + MARGINS.top})
        .attr("r", 10)
        .attr("class", "point");

    
    // making the two axis
    FRAME1.append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
            .call(d3.axisBottom(X_SCALE2).ticks(10))
            .attr("font-size", "14px");

    FRAME1.append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
            .call(d3.axisLeft(Y_SCALE2).ticks(10))
            .attr("font-size", "14px");

    // creating a function to add a point from the user input        
    function addPoint() {
        const X_SCALE2 = d3.scaleLinear()
                        .domain([0, 10])
                        .range([0, VIS_WIDTH]);
    
        const Y_SCALE2 = d3.scaleLinear()
                            .domain([0, 10])
                            .range([VIS_HEIGHT, 0]);
    
        let new_x = document.getElementById("x").value;
        let new_y = document.getElementById("y").value;
    
        // add point to plot
        FRAME1.append("circle")
            .attr("cx", () => {return X_SCALE2(new_x) + MARGINS.left})
            .attr("cy", () => {return Y_SCALE2(new_y) + MARGINS.top})
            .attr("r", 10)
            .attr("class", "point");
        
        FRAME1.selectAll(".point").on("click", handleClick);
    }
    
    // adding event listeners to add point to the plot from button click
    let pointButton = document.getElementById("point-button");
    pointButton.addEventListener("click", addPoint);

    // creating a function to add a border to the point when clicked
    function handleClick(event, d) {
        this.classList.toggle("border")
        let new_x = d3.select(this).attr("cx");
        let new_y = d3.select(this).attr("cy");

        new_x = Math.round(X_SCALE2.invert(new_x - MARGINS.left));
        new_y = Math.round(Y_SCALE2.invert(new_y - MARGINS.top));
        document.getElementById('output').innerHTML = `Last point clicked: <br> (${new_x}, ${new_y})`
    }

    FRAME1.selectAll(".point").on("click", handleClick);

});
}
scatter_plot()
    

 
    
// Creating the bar chart
const FRAME2 = d3.select("#bar")
                  .append("svg")
                  .attr("height", FRAME_HEIGHT)
                  .attr("width", FRAME_WIDTH)
                  .attr("class", "frame");

// function for plotting the bar chart and reading the data
function plot_bar(){
    d3.csv("data/bar-data.csv").then((data) => { 

        const Y_MAX = d3.max(data, (d) => { return parseInt(d.amount); });
        
        const X_SCALE = d3.scaleBand()
            .range([0, VIS_WIDTH])
            .domain(data.map(function(d) {return d.category;}));
            
        const Y_SCALE = d3.scaleLinear() 
            .domain([0, 100])
            .range([VIS_HEIGHT, MARGINS.top]);

        FRAME2.selectAll('bars')
            .data(data)
            .enter()
            .append('rect')
            .attr("x", (d) => { return X_SCALE(d.category) + MARGINS.left; })
            .attr("y", (d) => { return Y_SCALE(d.amount) + MARGINS.bottom; })
              .attr('width', X_SCALE.bandwidth() - 10)
              .attr('height', (d) => VIS_HEIGHT - Y_SCALE(d.amount))
              .attr('fill', 'deepskyblue')
              .attr('class', 'bar');


    FRAME2.append("g")
        .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
        .call(d3.axisBottom(X_SCALE).ticks(10))
        .attr("font-size", "14px");


    FRAME2.append("g")
        .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
        .call(d3.axisLeft(Y_SCALE).ticks(9))
        .attr("font-size", "14px");
    
    //create a tooltip for the barchart
    const TOOLTIP = d3.select("#bar")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0); 

    function barMousemove(event, d) {
        TOOLTIP.html("Category: " + d.category + "<br>Value: " + d.amount)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 50) + "px")
        }
    
    function barMouseover(event, d) {
            TOOLTIP.style("opacity", 1)
        }
    
    function barMouseleave(event, d) {
            TOOLTIP.style("opacity", 0)
        }

    // add event listener functions to the frame
    FRAME2.selectAll(".bar")
        .on("mouseover", barMouseover)
        .on("mousemove", barMousemove)
        .on("mouseleave", barMouseleave);
        

});  

}

//calling the bar plot function
plot_bar()
    
