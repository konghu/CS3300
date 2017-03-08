// graph 2
var svg = d3.select("#weather_data").append("svg").attr("width", 1100).attr("height", 800).attr("id", "weatherBiking");

var weatherData;
var durationData;
var xTempAxis;
var yMilesAxis;
var weatherPlot;
var temperaturePoints = [];
var visibleMilesPoints = [];
var durationPoints = [];
var windSpeedPoints = [];
var durationExtent = [];
var temperatureExtent = [];
var visibleMilesExtent = [];
var windSpeedExtent = [];
var weatherBiking = d3.select("svg#weatherBiking");

// access weather data file
d3.csv("weather_ave_data.csv", function (error, data) {
    if (error) { console.log(error); }

    weatherData = data;

    var temperature = weatherData.map(function (d) { return d["Average of Mean TemperatureF"]; });

    // convert column string data to numbers for further calculations
    temperature.forEach(function(t){
        temperaturePoints.push(Number(t));
    });

    temperatureExtent = d3.extent(temperaturePoints, function (d) { return d });

    var visibleMiles = weatherData.map(function (d) { return d["Average of  Mean VisibilityMiles"]; });

    visibleMiles.forEach(function(t){
        visibleMilesPoints.push(Number(t));
    });

    visibleMilesExtent = d3.extent(visibleMilesPoints, function (d) { return d });

    var windSpeed = weatherData.map(function(d){ return d["Average of  Mean Wind SpeedMPH"]; });

    windSpeed.forEach(function(t){
        windSpeedPoints.push(Number(t));
    });

    windSpeedExtent = d3.extent(windSpeedPoints, function(d){ return d; });
});

// access biking duration file
d3.csv("duration.csv", function(error, data){
    if (error) { console.log(error); }

    durationData = data;

    var duration = durationData.map(function (d) {return d["Row Labels	Sum of Duration"].split("\t")[1] });

    // convert column string data to numbers for further calculations, ignoring last entry of Grand total
    duration.forEach(function(t, index){
        if(!(index==duration.length-1))
        durationPoints.push(Number(t));
    });

    durationExtent = d3.extent(durationPoints, function (d) { return d });
});

function showPlots(){
    // create scales for the variables temperature, visible miles, wind speed and biking duration
    var temperatureScale = d3.scaleLinear().domain(temperatureExtent).range([0, 1200]);
    var milesScale = d3.scaleLinear().domain(visibleMilesExtent).range([600, 0]);
    // using log scale for duration as durationExtent min and max values have huge difference, this scale is being used to calculate radius of the circle
    var durationScale = d3.scaleLog().domain(durationExtent).range([2, 15]);
    var windSpeedScale = d3.scaleOrdinal().domain(windSpeedExtent).range(['#fee0d2','#fb6a4a','#a50f15']);

    // creating X and Y scales
    xTempAxis = d3.axisBottom(temperatureScale).tickSize(0);
    yMilesAxis = d3.axisLeft(milesScale).tickSize(0);
    // calling X and Y scales
    weatherPlot = weatherBiking.append("g").attr("transform", "translate(40, 40)");
    weatherPlot.append("g").call(xTempAxis).attr("transform", "translate(0, 600)").style("font-size", "14px");
    weatherPlot.append("g").call(yMilesAxis).attr("transform", "translate(0, 0)").style("font-size", "14px");

    //adding labels for X and Y scales
    weatherBiking.append("text").text("Temperature in Fahrenheit").attr("x", "950").attr("y", "620").style("font-size", "14px");
    weatherBiking.append("text").text("Visible Miles").attr("x", "10").attr("y", "20").style("font-size", "14px");

    // color key for wind speed data
    weatherBiking.append("text").text("Wind Speed Scale in miles per hour").attr("x", "505").attr("y", "690").style("font-size", "14px");
    weatherBiking.append("rect").attr("x", 530).attr("y", 700).attr("width", 50).attr("height", 5).attr("fill", "#fee0d2");
    weatherBiking.append("rect").attr("x", 580).attr("y", 700).attr("width", 50).attr("height", 5).attr("fill", "#fb6a4a");
    weatherBiking.append("rect").attr("x", 630).attr("y", 700).attr("width", 50).attr("height", 5).attr("fill", "#a50f15");

    weatherBiking.append("text").text("1.4").attr("x", 520).attr("y", 730).style("font-size", "14px");
    weatherBiking.append("text").text("5.93").attr("x", 565).attr("y", 730).style("font-size", "14px");
    weatherBiking.append("text").text("10.46").attr("x", 610).attr("y", 730).style("font-size", "14px");
    weatherBiking.append("text").text("15").attr("x", 670).attr("y", 730).style("font-size", "14px");

    // mapping points on the graph
    for(var i=0; i<durationPoints.length; i++){
        weatherBiking.append("circle")
            .attr("fill", windSpeedScale(windSpeedPoints[i]))
            .attr("stroke", "#de2d26")
            .attr("opacity", 0.6)
            .attr("transform", "translate(40, 40)")
            .attr('cx', temperatureScale(temperaturePoints[i]))
            .attr('cy', milesScale(visibleMilesPoints[i]))
            .attr('r', durationScale(durationPoints[i]));
    }
}

d3.queue()
    .defer(d3.csv, "weather_ave_data.csv")
    .defer(d3.csv, "duration.csv")
    .await(showPlots);