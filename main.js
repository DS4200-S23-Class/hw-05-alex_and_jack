d3.csv("/data/scatter-data.csv").then(data => {
  // loop through each row of the data and log the x-y values
  data.forEach(datum => {
    console.log(`x: ${datum.x}, y: ${datum.y}`);
  });
}).catch(error => {
  console.error(`Error loading data: ${error}`);
});