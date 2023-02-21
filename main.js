console.log("linked");

const FRAME_HEIGHT = 200;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const FRAME1 = d3.select("#scatterplot") 
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
  console.log(data); //Notice this data has 3 columns
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