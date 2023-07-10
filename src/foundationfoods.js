
// set margins in a constant
const margins = {
    left: 80,
    right: 40,
    top: 40,
    bottom: 40
}

const barChartMargins = {
    left: 300,
    top: 40
}

// Set the dimensions of the SVG container
const width = window.innerWidth - margins.left;
const height = window.innerHeight - margins.top;

// set scales for svg
var yScale = d3.scaleBand().range([0, height - 100]);   // range della visualizzazione, poi dovrei aggiornare il domain quando disegno
var xScale = d3.scaleLinear().range([0, width]);  // range della visualizzazione, poi dovrei aggiornare il domain quando disegno


// Create an SVG container in the document body
var svgContainer = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border-style", "solid")
    .style("background-color", "#f5f5f5")


// disegno iniziale
d3.json("../prova.json")
    .then(function (data) {
        console.log("Stampo data['FoundationFoods']")
        console.log(data["FoundationFoods"])
        var foundationFoods = data["FoundationFoods"]
        console.log(foundationFoods[0]["description"])
        console.log(foundationFoods.map(function (d) { return d["description"] }))


        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 3000])
            .range([0, width]);

        // Draw X axis on top
        svgContainer.append("g")
            .attr("transform", "translate(" + barChartMargins.left + "," + margins.top + ")")
            .call(d3.axisTop(x))
            .selectAll("text")
            .attr("transform", "translate(-10,-12)rotate(-30)")
            .style("text-anchor", "end")
            .style("font-size", "15px")
            .style("font-weight", "bold")

        // Add Y axis with bands
        var y = d3.scaleBand()
            .range([0, 500])
            .domain(foundationFoods.map(function (d) { return d["description"] }))
            .padding(.1);

        // Draw Y axis on left. d3.axisLeft() takes the y scaleBand as a parameter
        var yAxis = svgContainer.append("g")
            .call(d3.axisLeft(y))
            .attr("transform", "translate(" + barChartMargins.left + ",40)")


        // Add bars
        var bars = svgContainer.selectAll("bars")
            .data(foundationFoods)
            .enter()
            .append("rect")
            .attr("x", barChartMargins.left)
            .attr("y", function (d) { return y(d["description"]) })
            .attr("width", function (d) { return x(d["foodNutrients"][1]["amount"]); })
            .attr("height", y.bandwidth())
            .attr("fill", "#69b3a2")
            .attr("transform", "translate(0," + barChartMargins.top + ")")      // necessario per spostare il grafico nel punto giusto

        bars.on("mouseover", function () { d3.select(this).attr("fill", "orange") })
        bars.on("mouseout", function () { d3.select(this).attr("fill", "#69b3a2") })
        /*
        data.forEach(datacase => {
            drawBar(datacase, offset)
            offset += width / 11;
        })
        */
    })
    .catch(function (error) {
        console.log(error); // Some error handling here
    });

