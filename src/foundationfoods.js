
// set margins in a constant
const margins = {
    left: 40,
    right: 40,
    top: 40,
    bottom: 40
}

const barChartMargins = {
    left: 300,
    top: 40
}

// Set the dimensions of the SVG container
const width = window.innerWidth - (2 * margins.right);
const height = 5200 - margins.top;


// Create an SVG container in the document body
var svgContainer = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
    .attr("overflow", "scroll")
    .style("border-style", "solid")
    .style("background-color", "#f5f5f5")


// Initial bar chart drawing
d3.json("../FoundationFoodsApril2023.json")
    .then(function (data) {
        console.log("Stampo data['FoundationFoods']")
        console.log(data["FoundationFoods"])
        var foundationFoods = data["FoundationFoods"]
        console.log(foundationFoods[0]["description"])
        console.log(foundationFoods.map(function (d) { return d["description"] }))


        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 1500])
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
            .range([0, 5000])
            .domain(foundationFoods.map(function (d) { return d["description"] }))
            .padding(.1);

        // Draw Y axis on left. d3.axisLeft() takes the y scaleBand as a parameter
        svgContainer.append("g")
            .call(d3.axisLeft(y))
            .attr("transform", "translate(" + barChartMargins.left + ",40)")


        // Add bars
        // Bind data and draw bars
        svgContainer.append("g")
            .attr("class", "bars")
            .selectAll("bars")
            .data(foundationFoods)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", barChartMargins.left)
            .attr("y", function (d) { return y(d["description"]) })
            .attr("width", function (d) { return x(d["foodNutrients"][1]["amount"]); })
            .attr("height", y.bandwidth())
            .attr("fill", "#69b3a2")
            .attr("transform", "translate(0," + barChartMargins.top + ")")      // necessario per spostare il grafico nel punto giusto

        // Add labels, need binding again the data to the labels
        svgContainer.select(".bars")
            .selectAll("labels")
            .data(foundationFoods)
            .enter()
            .append("text")
            .text(function (d) { return d["foodNutrients"][1]["amount"] + " Kcal/100g" })
            .attr("font-family", "sans-serif")
            .attr("font-weight", "bold")
            .attr("x", function (d) { return x(d["foodNutrients"][1]["amount"]) + barChartMargins.left + 10; })
            .attr("y", function (d) { return y(d["description"]) + barChartMargins.top / 2.5 })
            .attr("width", function (d) { return x(d["foodNutrients"][1]["amount"]); })
            .attr("height", y.bandwidth())
            .attr("transform", "translate(0," + barChartMargins.top + ")")      // necessario per spostare il grafico nel punto giusto

        // Cambia colore al passaggio del mouse
        svgContainer.selectAll(".bar").on("mouseover", function () { d3.select(this).attr("fill", "orange") })
        svgContainer.selectAll(".bar").on("mouseout", function () { d3.select(this).attr("fill", "#69b3a2") })

    })
    .catch(function (error) {
        console.log(error); // Some error handling here
    });

function drawBarChart(arrayOfData, xAxisAttribute) {
    d3.select("svg").selectAll("g").remove()

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 1500])
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
        .range([0, 5000])
        .domain(arrayOfData.map(function (d) { return d["description"] }))
        .padding(.1);

    // Draw Y axis on left. d3.axisLeft() takes the y scaleBand as a parameter
    svgContainer.append("g")
        .call(d3.axisLeft(y))
        .attr("transform", "translate(" + barChartMargins.left + ",40)")


    // Add bars
    // Bind data and draw bars
    svgContainer.append("g")
        .attr("class", "bars")
        .selectAll("bars")
        .data(arrayOfData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", barChartMargins.left)
        .attr("y", function (d) { return y(d["description"]) })
        .attr("width", function (d) { return x(d["foodNutrients"][1]["amount"]); })
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2")
        .attr("transform", "translate(0," + barChartMargins.top + ")")      // necessario per spostare il grafico nel punto giusto

    // Add labels, need binding again the data to the labels
    svgContainer.select(".bars")
        .selectAll("labels")
        .data(arrayOfData)
        .enter()
        .append("text")
        .text(function (d) { return d["foodNutrients"][1]["amount"] + " Kcal/100g" })
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("x", function (d) { return x(d["foodNutrients"][1]["amount"]) + barChartMargins.left + 10; })
        .attr("y", function (d) { return y(d["description"]) + barChartMargins.top / 2.5 })
        .attr("width", function (d) { return x(d["foodNutrients"][1]["amount"]); })
        .attr("height", y.bandwidth())
        .attr("transform", "translate(0," + barChartMargins.top + ")")      // necessario per spostare il grafico nel punto giusto

    // Cambia colore al passaggio del mouse
    svgContainer.selectAll(".bar").on("mouseover", function () { d3.select(this).attr("fill", "orange") })
    svgContainer.selectAll(".bar").on("mouseout", function () { d3.select(this).attr("fill", "#69b3a2") })

}

// Click actions on sorting buttons
function sortByKcal() {
    console.log("SortByKcalButton has been clicked!")

    d3.json("../FoundationFoodsApril2023.json")
        .then(function (data) {
            foodArray = data["FoundationFoods"];

            foodArray.sort((a, b) => b["foodNutrients"][1]["amount"] - a["foodNutrients"][1]["amount"])

            console.log(foodArray)
            drawBarChart(foodArray)
        })
        .catch(function (error) {
            console.log(error); // Some error handling here
        });
}

function sortByWater() {
    console.log("SortByWaterButton has been clicked!")
    d3.json("../FoundationFoodsApril2023.json")
        .then(function (data) {
            foodArray = data["FoundationFoods"];

            foodArray.sort((a, b) => {
                // parto da b, navigo tra tutti i nutrienti di b
                var amountOfB = 0;
                var amountOfA = 0;
                // cerco per il nutriente che ha come nome "Water"
                b["foodNutrients"].forEach(nutrient => {
                    // quando l'ho trovato, recupero l'amount e lo salvo
                    if (nutrient["nutrient"]["name"] == "Water") {
                        amountOfB = nutrient["amount"]
                        return
                    }
                });
                // faccio la stessa cosa per a
                a["foodNutrients"].forEach(nutrient => {
                    // quando l'ho trovato, recupero l'amount e lo salvo
                    if (nutrient["nutrient"]["name"] == "Water") {
                        amountOfA = nutrient["amount"]
                        return
                    }
                });
                // sottraggo i due amounts
                return amountOfB - amountOfA
            })

            console.log(foodArray)
            drawBarChart(foodArray)
        })
        .catch(function (error) {
            console.log(error); // Some error handling here
        });

}

function sortByProtein() {
    console.log("SortByProteinButton has been clicked!")
}
function sortByTotalLipid() {
    console.log("SortByTotalLipidButton has been clicked!")
}
function sortByCarbohydrates() {
    console.log("SortByCarbohydratesButton has been clicked!")
}

// Add event listeners to sort buttons
document.getElementById("sortByKcalButton").addEventListener("click", sortByKcal)
document.getElementById("sortByWaterButton").addEventListener("click", sortByWater)
document.getElementById("sortByProteinButton").addEventListener("click", sortByProtein)
document.getElementById("sortByTotalLipidButton").addEventListener("click", sortByTotalLipid)
document.getElementById("sortByCarbohydratesButton").addEventListener("click", sortByCarbohydrates)