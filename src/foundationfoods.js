
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
            .attr("fill", "#ff2a12")
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

function drawPieChart() {
    /*
    var svgPieChart = d3.select("body")
        .select("#followerDiv")
        .append("svg")
        .attr("width", 300)
        .attr("height", 300)
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .attr("overflow", "scroll")
        .style("border-style", "solid")
        .style("background-color", "#f5f5f5")
    */

    // set the dimensions and margins of the graph
    const width = 400,
        height = 400,
        margin = 10;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#followerDiv")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create dummy data
    const data = { a: 9, b: 20, c: 30, d: 8, e: 12 }

    // set the color scale
    const color = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

    // Compute the position of each group on the pie:
    const pie = d3.pie()
        .value(function (d) { return d[1] })
    const data_ready = pie(Object.entries(data))

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg.selectAll('whatever')
        .data(data_ready)
        .join('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function (d) { return (color(d.data[1])) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

}

function removePieChart() {
    d3.select("body").select("#followerDiv").select("svg").remove()
}

function drawBarChart(arrayOfData, xAxisAttribute, unitOfMeasure) {    // facciamo che questo attributo è per esempio la stringa "Water"
    // cancella il bar chart precedente
    d3.select("svg").selectAll("g").remove()

    // imposta il colore delle barre a seconda dell'xAxisAttribute
    var barColor = "#000000"
    switch (xAxisAttribute) {
        case "Energy (Atwater General Factors)":
            barColor = "#ff2a12"
            break
        case "Water":
            barColor = "#59bfff"
            break
        case "Protein":
            barColor = "#c23c3c"
            break
        case "Total lipid (fat)":
            barColor = "#dece6a"
            break
        case "Carbohydrate, by difference":
            barColor = "#70c47f"
            break
    }

    // imposta dei valori di scala a seconda dell'xAxisAttribute
    var maxDomainValue = 2000
    if (xAxisAttribute == "Energy (Atwater General Factors)") {
        maxDomainValue = 1500
    } else {
        maxDomainValue = 150
    }

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, maxDomainValue])
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
        .attr("width", function (d) {
            nutrientAmount = 0;
            d["foodNutrients"].forEach(nutrient => {
                // quando l'ho trovato, recupero l'amount e lo restituisco
                if (nutrient["nutrient"]["name"] == xAxisAttribute) {
                    nutrientAmount = nutrient["amount"]
                }
            });
            return x(nutrientAmount)
        })
        .attr("height", y.bandwidth())
        .attr("fill", barColor)
        .attr("transform", "translate(0," + barChartMargins.top + ")")      // necessario per spostare il grafico nel punto giusto

    // Add labels, need binding again the data to the labels
    svgContainer.select(".bars")
        .selectAll("labels")
        .data(arrayOfData)
        .enter()
        .append("text")
        .text(function (d) {
            nutrientAmount = 0;
            d["foodNutrients"].forEach(nutrient => {
                // quando l'ho trovato, recupero l'amount e lo restituisco
                if (nutrient["nutrient"]["name"] == xAxisAttribute) {
                    nutrientAmount = nutrient["amount"]
                }
            });
            return nutrientAmount + unitOfMeasure
        })
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("x", function (d) {
            nutrientAmount = 0;
            d["foodNutrients"].forEach(nutrient => {
                // quando l'ho trovato, recupero l'amount e lo restituisco
                if (nutrient["nutrient"]["name"] == xAxisAttribute) {
                    nutrientAmount = nutrient["amount"]
                }
            });
            return x(nutrientAmount) + barChartMargins.left + 20
        })
        .attr("y", function (d) { return y(d["description"]) + barChartMargins.top / 2.5 })
        //.attr("width", function (d) { return x(d["foodNutrients"][1]["amount"]); })
        .attr("height", y.bandwidth())
        .attr("transform", "translate(0," + barChartMargins.top + ")")      // necessario per spostare il grafico nel punto giusto

    // Cambia colore al passaggio del mouse e mostra il followerDiv con la PieChart
    svgContainer.selectAll(".bar").on("mouseover", function () {
        d3.select(this).attr("fill", "orange")
        document.getElementById("followerDiv").style.display = "block"
        drawPieChart();
    })
    svgContainer.selectAll(".bar").on("mouseout", function () {
        d3.select(this).attr("fill", barColor)
        document.getElementById("followerDiv").style.display = "none"
        removePieChart();
    })

}

// Click actions on sorting buttons
function sortByKcal() {
    console.log("SortByKcalButton has been clicked!")

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
                    if (nutrient["nutrient"]["name"] == "Energy (Atwater General Factors)") {
                        amountOfB = nutrient["amount"]
                        return
                    }
                });
                // faccio la stessa cosa per a
                a["foodNutrients"].forEach(nutrient => {
                    // quando l'ho trovato, recupero l'amount e lo salvo
                    if (nutrient["nutrient"]["name"] == "Energy (Atwater General Factors)") {
                        amountOfA = nutrient["amount"]
                        return
                    }
                });
                // sottraggo i due amounts
                return amountOfB - amountOfA
            })

            console.log(foodArray)
            drawBarChart(foodArray, "Energy (Atwater General Factors)", " Kcal/100g")
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
            drawBarChart(foodArray, "Water", " %")
        })
        .catch(function (error) {
            console.log(error); // Some error handling here
        });

}

function sortByProtein() {
    console.log("SortByProteinButton has been clicked!")
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
                    if (nutrient["nutrient"]["name"] == "Protein") {
                        amountOfB = nutrient["amount"]
                        return
                    }
                });
                // faccio la stessa cosa per a
                a["foodNutrients"].forEach(nutrient => {
                    // quando l'ho trovato, recupero l'amount e lo salvo
                    if (nutrient["nutrient"]["name"] == "Protein") {
                        amountOfA = nutrient["amount"]
                        return
                    }
                });
                // sottraggo i due amounts
                return amountOfB - amountOfA
            })

            console.log(foodArray)
            drawBarChart(foodArray, "Protein", " %")
        })
        .catch(function (error) {
            console.log(error); // Some error handling here
        });

}
function sortByTotalLipid() {
    console.log("SortByTotalLipidButton has been clicked!")
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
                    if (nutrient["nutrient"]["name"] == "Total lipid (fat)") {
                        amountOfB = nutrient["amount"]
                        return
                    }
                });
                // faccio la stessa cosa per a
                a["foodNutrients"].forEach(nutrient => {
                    // quando l'ho trovato, recupero l'amount e lo salvo
                    if (nutrient["nutrient"]["name"] == "Total lipid (fat)") {
                        amountOfA = nutrient["amount"]
                        return
                    }
                });
                // sottraggo i due amounts
                return amountOfB - amountOfA
            })

            console.log(foodArray)
            drawBarChart(foodArray, "Total lipid (fat)", " %")
        })
        .catch(function (error) {
            console.log(error); // Some error handling here
        });

}
function sortByCarbohydrates() {
    console.log("SortByCarbohydratesButton has been clicked!")
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
                    if (nutrient["nutrient"]["name"] == "Carbohydrate, by difference") {
                        amountOfB = nutrient["amount"]
                        return
                    }
                });
                // faccio la stessa cosa per a
                a["foodNutrients"].forEach(nutrient => {
                    // quando l'ho trovato, recupero l'amount e lo salvo
                    if (nutrient["nutrient"]["name"] == "Carbohydrate, by difference") {
                        amountOfA = nutrient["amount"]
                        return
                    }
                });
                // sottraggo i due amounts
                return amountOfB - amountOfA
            })

            console.log(foodArray)
            drawBarChart(foodArray, "Carbohydrate, by difference", " %")
        })
        .catch(function (error) {
            console.log(error); // Some error handling here
        });
}

// Add event listeners to sort buttons
document.getElementById("sortByKcalButton").addEventListener("click", sortByKcal)
document.getElementById("sortByWaterButton").addEventListener("click", sortByWater)
document.getElementById("sortByProteinButton").addEventListener("click", sortByProtein)
document.getElementById("sortByTotalLipidButton").addEventListener("click", sortByTotalLipid)
document.getElementById("sortByCarbohydratesButton").addEventListener("click", sortByCarbohydrates)

// Add event listeners to followerDiv
document.addEventListener("mousemove", function (event) {
    var follower = document.getElementById("followerDiv");
    //follower.style.display = "block";
    follower.style.left = event.clientX + 5 + "px";
    follower.style.top = event.clientY + 5 + "px";
});
