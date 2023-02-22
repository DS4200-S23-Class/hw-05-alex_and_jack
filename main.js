console.log("linked");

const FRAME_HEIGHT = 200;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const FRAME1 = d3.select("scatterplot") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

// Next, open file 
d3.csv("data/scatter-data.csv").then((data) => { 

  // d3.csv parses a csv file 
  // .then() passes the data parsed from the file to a function
  // in the body of this function is where you will build your 
  // vis 

  // let's check our data
  console.log(data + 1); //Notice this data has 3 columns
                      // to access data in a column, use .

  // add our circles with styling 
  FRAME1.selectAll("circle") 
      .data(data) // this is passed from  .then()
      .enter()  
      .append("circle")
        .attr("cx", (d) => { return d.x; }) // use x for cx
        .attr("cy", (d) => { return d.y; }) // use y for cy
        .attr("r", 30)  // set r 
        .attr("fill", (d) => { return d.color; }); // fill by color

}); // .then is closed here 

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

const FRAME2 = d3.select("bar-chart")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

// read data and create plot
d3.csv("data/bar-data.csv").then((data) => {

  // find max amount
  const MAX_AMOUNT = d3.max(data, (d) => { return parseInt(d.amount); });
          // Note: data read from csv is a string, so you need to
          // cast it to a number if needed 
  
  // Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const X_SCALE = d3.scaleBand() 
                    .domain(data.map((d) => d.category)) 
                    .range([0, VIS_WIDTH]) 
                    .padding(0.2); 

  const Y_SCALE = d3.scaleLinear() 
                    .domain([0, (MAX_AMOUNT + 100)]) // add some padding  
                    .range([VIS_HEIGHT, 0]); 

  // Use X_SCALE and Y_SCALE to plot our points
  FRAME2.selectAll("rect")  
      .data(data) // passed from .then  
      .enter()       
      .append("rect")  
        .attr("x", (d) => { return (X_SCALE(d.category) + MARGINS.left); }) 
        .attr("y", (d) => { return (Y_SCALE(d.amount) + MARGINS.top); }) 
        .attr("width", X_SCALE.bandwidth()) 
        .attr("height", (d) => { return (VIS_HEIGHT - Y_SCALE(d.amount)); })
        .attr("class", "bar");
       const TOOLTIP = d3.select("#bar-chart")
                        .append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0);

  // Define event handler functions for tooltips
    function handleMouseover(event, d) {
      // on mouseover, make opaque 
      TOOLTIP.style("opacity", 1); 
      
    }

    function handleMousemove(event, d) {
      // position the tooltip and fill in information 
      TOOLTIP.html("Category: " + d.category + "<br>Value: " + d.amount)
              .style("left", (event.pageX + 10) + "px") //add offset
                                                          // from mouse
              .style("top", (event.pageY - 50) + "px"); 
    }

    function handleMouseleave(event, d) {
      // on mouseleave, make transparant again 
      TOOLTIP.style("opacity", 0); 
    } 

    // Add event listeners
    FRAME2.selectAll(".bar")
          .on("mouseover", handleMouseover) //add event listeners
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave); 
});
