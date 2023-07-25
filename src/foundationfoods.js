
// ***** Questo blocco serve a precaricare il dataset in una variabile che posso usare più facilmente
var response
var foodsDataset = new Array()
async function leggiDataset() {
    response = await fetch("../FoundationFoodsApril2023.json")
    foodsDataset = await response.json()
}
leggiDataset()
// *****

// set margins in a constant
const margins = {
    left: 40,
    right: 40,
    top: 40,
    bottom: 40
}

const barChartMargins = {
    left: 170,
    top: 40
}

// Set the dimensions of the SVG container
const width = window.innerWidth - (2 * margins.right);
const height = 5200 - margins.top;

// list of selected foods for the sum
// Uso new Array() perché il forEach dà errore se lo dichiaro solo con "[]". In questo modo il tipo di variabile è ben definito.
var selectedFoods = new Array();

// Create an SVG container in the document body
var svgContainer = d3.select("body")
    .append("svg")
    .attr("id", "barChartSvg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
    .attr("overflow", "scroll")
    .style("border-style", "solid")
    .style("background-color", "#f5f5f5")


// Prende un alimento come parametro e restituisce un dizionario di nutrienti da visualizzare nella Pie Chart
function createDictOfNutrients(food) {
    console.log("printo il parametro food che viene dato normalmente a createDictOfNutrients")
    console.log(food)
    const dictOfNutrients = { water: 0, protein: 0, fat: 0, carbohydrates: 0, other: 0 }

    food["foodNutrients"].forEach(nutrient => {
        if (nutrient["nutrient"]["name"] == "Water")
            dictOfNutrients.water = nutrient["amount"] + 0.001
    });
    food["foodNutrients"].forEach(nutrient => {
        if (nutrient["nutrient"]["name"] == "Protein")
            dictOfNutrients.protein = nutrient["amount"] + 0.001
    });
    food["foodNutrients"].forEach(nutrient => {
        if (nutrient["nutrient"]["name"] == "Total lipid (fat)")
            dictOfNutrients.fat = nutrient["amount"] + 0.001
    });
    food["foodNutrients"].forEach(nutrient => {
        if (nutrient["nutrient"]["name"] == "Carbohydrate, by difference")
            dictOfNutrients.carbohydrates = nutrient["amount"] + 0.001
    });
    // devo correggere l'assenza di nutrienti mettendo "other"
    var other = 100 - (dictOfNutrients.water + dictOfNutrients.protein + dictOfNutrients.fat + dictOfNutrients.carbohydrates)
    dictOfNutrients.other = other
    console.log("Showing the dictionary of nutrients for the food:")
    console.log(dictOfNutrients)

    return dictOfNutrients      // lo restituisco e va a finire nella variabile "data" che disegna la torta
}

// Disegna la pie chart accanto al cursore. Prende come parametro il nome e il dizionario con i nutrienti
function drawPieChart(foodName, dictOfNutrients) {
    // modifica il nome del riquadro della legenda
    d3.select("#foodNameLegend")
        .text(foodName)


    // set the dimensions and margins of the graph
    const width = 300,
        height = 300,
        margin = 10;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called "followerDiv" that follows the cursor
    const svgPieChart = d3.select("#followerDiv")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Salvo in questa variabile il dizionario di nutrienti passato come parametro
    const data = dictOfNutrients

    // set the color scale
    // in ordine sono water, protein, lipid, carbohydrates, other
    const color = d3.scaleOrdinal()
        .range(["#59bfff", "#c23c3c", "#dece6a", "#70c47f", "#6b6b6b"])

    // Compute the position of each group on the pie:
    const pie = d3.pie()
        .value(function (d) { return d[1] })
    const data_ready = pie(Object.entries(data))

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svgPieChart.selectAll("pieChart")
        .data(data_ready)
        .join('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function (d) { return (color(d.data[1])) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")

    // seleziona i tag <p> che devono contenere i valori nutrizionali nella legenda
    d3.select("#waterValue")
        .text(dictOfNutrients.water.toFixed(0) + " %")
    d3.select("#proteinValue")
        .text(dictOfNutrients.protein.toFixed(0) + " %")
    d3.select("#fatValue")
        .text(dictOfNutrients.fat.toFixed(0) + " %")
    d3.select("#carbohydratesValue")
        .text(dictOfNutrients.carbohydrates.toFixed(0) + " %")
    d3.select("#otherValue")
        .text(dictOfNutrients.other.toFixed(0) + " %")
}

// viene eseguita al mouseout dalle bars
function removePieChart() {
    d3.select("body").select("#followerDiv").select("svg").remove()
}

// restituisce un oggetto food dandogli il nome
function findFoodByName(foodName) {
    var foodToReturn = {}
    console.log("findFoodByName executed")
    // questa funzione deve restituire l'oggetto che ha quel nome. 
    console.log(foodsDataset)
    foodsDataset["FoundationFoods"].forEach(function (food) {
        if (food["description"] == String(foodName))
            foodToReturn = food
    })
    return foodToReturn
}

// funzione che crea il pie chart della somma dei cibi
function drawSumPieChart() {
    console.log("Drawing sum pie chart!")
    document.getElementById("sumPieChartDiv").style.display = "flex"
    /* per ogni cibo contenuto nella lista selectedFoods devo calcolare il dizionario dei nutrienti con la funzione 
        createDictOfNutrients, e poi a questo dizionario devo sommare i valori del successivo dizionario.

        Una volta che ho il dizionario con i valori totali, posso passarlo alla funzione che disegna il PieChart,
        ma al posto di passargli il food name, ci passo la stringa "Your selection"
    */
    // il dizionario di partenza a cui dovrò sommare tutti i valori
    summedNutrientsDict = { water: 0, protein: 0, fat: 0, carbohydrates: 0, other: 0 }

    selectedFoods.forEach(function (foodName) {
        const currentDictOfNutrients = createDictOfNutrients(findFoodByName(foodName));
        summedNutrientsDict["water"] = summedNutrientsDict["water"] + currentDictOfNutrients["water"]
        summedNutrientsDict["protein"] = summedNutrientsDict["protein"] + currentDictOfNutrients["protein"]
        summedNutrientsDict["fat"] = summedNutrientsDict["fat"] + currentDictOfNutrients["fat"]
        summedNutrientsDict["carbohydrates"] = summedNutrientsDict["carbohydrates"] + currentDictOfNutrients["carbohydrates"]
        summedNutrientsDict["other"] = summedNutrientsDict["other"] + currentDictOfNutrients["other"]
    })
    console.log("Showing the sum of nutrients dictionary: ")
    console.log(summedNutrientsDict)

    // Da qui in poi avviene il disegno: ***************************************************************************************

    // set the dimensions and margins of the graph
    const width = 300,
        height = 300,
        margin = 10;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called "sumPieChartDiv" that follows the cursor
    d3.select("#sumPieChartDiv").select("svg").remove()
    const svgPieChart = d3.select("#sumPieChartDiv")
        .insert("span", ":first-child")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Salvo in questa variabile il dizionario di nutrienti SOMMATI che ho costruito qualche riga sopra
    const data = summedNutrientsDict

    // set the color scale
    // in ordine sono water, protein, lipid, carbohydrates, other
    const color = d3.scaleOrdinal()
        .range(["#59bfff", "#c23c3c", "#dece6a", "#70c47f", "#6b6b6b"])

    // Compute the position of each group on the pie:
    const pie = d3.pie()
        .value(function (d) { return d[1] })
    const data_ready = pie(Object.entries(data))

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svgPieChart.selectAll("pieChart")
        .data(data_ready)
        .join('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function (d) { return (color(d.data[1])) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")

    // seleziona i tag <p> che devono contenere i valori nutrizionali nella legenda
    d3.select("#sumWaterValue")
        .text(summedNutrientsDict.water.toFixed(0) + " %")
    d3.select("#sumProteinValue")
        .text(summedNutrientsDict.protein.toFixed(0) + " %")
    d3.select("#sumFatValue")
        .text(summedNutrientsDict.fat.toFixed(0) + " %")
    d3.select("#sumCarbohydratesValue")
        .text(summedNutrientsDict.carbohydrates.toFixed(0) + " %")
    d3.select("#sumOtherValue")
        .text(summedNutrientsDict.other.toFixed(0) + " %")

}

//funzione che resetta la lista e il sumPieChartDiv
function resetSumPieChart() {
    // resetta l'array
    selectedFoods = new Array()
    // resetta l'HTML
    d3.select("#selectedFoodsList").selectAll("li").remove()
    // nascondi il sumPieChartDiv
    d3.select("#sumPieChartDiv").style("display", "none")
}

// funzione principale che disegna il bar chart
function drawBarChart(arrayOfData, xAxisAttribute, unitOfMeasure) {
    // cancella il bar chart precedente
    d3.select("#barChartSvg").selectAll("g").remove()
    // cancella l'overlay se c'è
    d3.select("#welcomingOverlay").remove()

    // imposta il colore delle barre a seconda dell'xAxisAttribute
    var barColor = "#000000"
    switch (xAxisAttribute) {
        case "Energy (Atwater General Factors)":
            barColor = "#4a4a4a"
            break
        case "Water":
            barColor = "#59bfff"
            break
        case "Protein":
            barColor = "#e33636"
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
        maxDomainValue = 1300
    } else {
        maxDomainValue = 130
    }

    // Define X axis (horizontal with values to represent)
    var x = d3.scaleLinear()
        .domain([0, maxDomainValue])
        .range([0, width]);

    // Draw X axis on top
    svgContainer.append("g")
        .attr("transform", "translate(" + barChartMargins.left + "," + margins.top + ")")
        .call(d3.axisTop(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "15px")
        .style("font-weight", "bold")

    // Add Y axis with bands (vertical with labels for each bar)
    var y = d3.scaleBand()
        .range([0, 5000])
        .domain(arrayOfData.map(function (d) { return d["description"] }))
        .padding(.1);

    // Draw Y axis on left. d3.axisLeft() takes the y scaleBand as a parameter
    svgContainer.append("g")
        .call(d3.axisLeft(y).tickFormat(t => {          // modifica il formato delle etichette
            if (t.length > 20)
                return t.slice(0, 20) + "... "
            else
                return t
        }))
        .attr("transform", "translate(" + barChartMargins.left + ",40)")
        .style("font-size", "12px")
        .style("font-weight", "bold")

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
        //.attr("font-weight", "bold")
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
        .attr("height", y.bandwidth())
        .attr("transform", "translate(0," + barChartMargins.top + ")")      // necessario per spostare il grafico nel punto giusto

    // Cambia colore al passaggio del mouse e mostra il followerDiv con la PieChart
    svgContainer.selectAll(".bar").on("mouseover", function () {
        console.log("Mouseover su una barra!")
        d3.select(this).style("stroke", "orange").style("stroke-width", "4px")
        document.getElementById("followerDiv").style.display = "block"
        drawPieChart(d3.select(this).data()[0].description, createDictOfNutrients(d3.select(this).data()[0]));      // ************ QUA CI VA IL FOOD RELATIVO ALLA BARRA SU CUI STO PASSANDO
    })
    svgContainer.selectAll(".bar").on("mouseout", function () {
        console.log("Mouseout da una barra!")
        d3.select(this).style("stroke", "orange").style("stroke-width", "0px")
        document.getElementById("followerDiv").style.display = "none"
        removePieChart();
    })
    // aggiungi event handler per il click sulla barra. Il click dovrebbe inserire il nome del cibo nella lista selectedFoods
    svgContainer.selectAll(".bar").on("click", function () {
        console.log("clicked on a bar!")
        d3.select(this).style("stroke", "orange").style("stroke-width", "4px")
        d3.select(this).attr("fill", "orange")
        selectedFoods.push(d3.select(this).data()[0].description)
        console.log("Showing selectedFoods array:")
        console.log(selectedFoods)
        // Dovrei anche mostrarlo nell'HTML
        const newListItem = document.createElement("li");
        newListItem.textContent = d3.select(this).data()[0].description;
        const listContainer = document.getElementById("selectedFoodsList")
        listContainer.appendChild(newListItem)
    })
}

// Click actions on sorting buttons
function sortByKcal() {
    console.log("SortByKcalButton has been clicked! Showing the sorted array:")

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
            drawBarChart(foodArray, "Energy (Atwater General Factors)", " Kcal")
        })
        .catch(function (error) {
            console.log(error); // Some error handling here
        });
}

function sortByWater() {
    console.log("SortByWaterButton has been clicked! Showing the sorted array:")
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
    console.log("SortByProteinButton has been clicked! Showing the sorted array:")
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
    console.log("SortByTotalLipidButton has been clicked! Showing the sorted array:")
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

// Add event listener to calculate sum button
document.getElementById("CalculateSumButton").addEventListener("click", drawSumPieChart)

// Add event listener to reset the list and hide the sumPieChartDiv
document.getElementById("ResetButton").addEventListener("click", resetSumPieChart)
