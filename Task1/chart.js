// TEACHER BEFORE YOU START checking my code, please don't be strict, I don't know Java and HTML.

async function buildPlot() {
    console.log("Hi!");
    const data = await d3.json("my_weather_data.json");
    //console.table(data);

    const dateParser = d3.timeParse("%Y-%m-%d")
    const yAccessor = (d) => d.temperatureMin; // For min Temperature
    const xAccessor = (d) => dateParser(d.date); // There was fixed some value d => d.date since it was string

    const YAccessor = (d) => d.temperatureHigh; // For high Temperature


    // Функ для инкап доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin:{
            top:15,
            left:15,
            bottom:15,
            right:15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper")

    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height)
    svg.attr("width",dimension.width)
    const bounded = svg.append("g")
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`)



    const yScaler = d3.scaleLinear() // Min Temperature
        .domain(d3.extent(data, yAccessor))
        .range([dimension.boundedHeight,0])


    const YScaler = d3.scaleLinear() //High Temperature
        .domain(d3.extent(data, YAccessor))
        .range([dimension.boundedHeight,0])
    bounded.append("g")
        .call(d3.axisLeft(YScaler));

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data, xAccessor ))
        .range([0,dimension.boundedWidth]);

    var lineGeneratorMin = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor(d)));


    var lineGeneratorHigh = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => YScaler(YAccessor(d)));


    bounded.append("path") // Min temperature

        .attr("fill","none")
        .attr("stroke","Red")
        .attr("d",lineGeneratorMin(data));

    bounded.append("path") // High Temperature

        .attr("fill","none")
        .attr("stroke","Green")
        .attr("d",lineGeneratorHigh(data));


    const xAxisGenerator = d3.axisBottom()
        .scale(xScaler)
    const xAxis = bounded.append("g")
        .call(xAxisGenerator)

        .style("transform", `translateY(${
            dimension.boundedHeight
        }px)`)
}

buildPlot()