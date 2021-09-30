
async function scales() {
    const format = d3.format(",");
    let data = await d3.csv(
        'wealth-health-2014.csv',
        d3.autoType
    );
    
    const margin = ({top: 20, right: 20, bottom: 20, left: 20})
    const width = 650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
       

    let IncomeRange= d3.extent(data, (d) => d.Income );
    let LifeExpectancyRange= d3.extent(data, (d) => d.LifeExpectancy);

    var incomeMax = IncomeRange[1];
    var incomeMin = IncomeRange[0];
    var LifeExpectancyMax = LifeExpectancyRange[1];
    var LifeExpectancyMin = LifeExpectancyRange[0];

    const incomeScale = d3
        .scaleLinear()
        .domain([incomeMin, incomeMax])
        .range([50, width-60]);
   
    const lifeExpectancyScale = d3
        .scaleLinear()
        .domain([LifeExpectancyMin-5, LifeExpectancyMax+5])
        .range([height-50, 50]);

    const xAxis = d3.axisBottom()
        .scale(incomeScale)
        .ticks(5, "s")

    const yAxis= d3.axisLeft()
        .scale(lifeExpectancyScale)
        .ticks(5, "s")
    
    svg.append("g")
        .call(yAxis)
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + 50 + ",0)")

    svg.append("g")
        .call(xAxis)
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (height - 50) + ")")
    

    svg.append("text")
        .text("Income")
        .attr('y', 450)
        .attr('x', width/2 - 20)
        .attr("fill", "darkgray")
        
    svg.append("text")
        .text("Life Expectancy")
        .attr('y', 15)
        .attr('x', -110)
        .attr("transform", "translate(0,"+(height/2.5)+")rotate(270)")
        .attr("fill", "darkgray")

    	
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);
    console.log("unique regions", Array.from(new Set(data.map(d => d.Region))));
    const sizeScale = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.Population))
        .range([5, 25]);

    let PopulationRange = d3.extent(data, (d) => d.Population);
    var rScale = d3.scaleLinear()
        .domain([PopulationRange[0], PopulationRange[1]])
        .range([5, 25]);
   
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("fill", function(d){
            return colorScale(d.Region);
        })
        .attr("cx", function(d,index){return incomeScale(d.Income);})
        .attr("cy", function(d,index){return lifeExpectancyScale(d.LifeExpectancy);})
        .attr("r", (d) => rScale(d.Population))
        .style("opacity", .6)
        .attr("stroke", "grey")
        .on("mouseenter", (event, d) => {
            const pos = d3.pointer(event, window);
            d3.select(".tooltip")
            .style("display", "block")
            .style("top", (pos[1] + 10) + "px")
            .style("left", (pos[0] + 10) + "px")
            .html(`<div>Country: ${d.Country}</div>
            <div>Region: ${d.Region}</div>
            <div>Population: ${format(d.Population)}</div>
            <div>Income: ${format(d.Income)}</div>
            <div>LifeExpectancy: ${d.LifeExpectancy}</div>`)
        })
        .on("mouseleave", (event, d) => {
            d3.select(".tooltip").style("display", "none");
        }); 

    const legend = svg.append("g")

    legend.selectAll('.legend-color')
        .data(colorScale.domain())
        .enter()
        .append('rect')
        .attr('class', 'legend-color')
        .attr('width', 15)
        .attr('height', 15)
        .attr('x', width -150)
        .attr('y', (d,i) => (i*17+height*2/3)- 3)
        .attr('alignment-baseline', 'hanging')
        .attr("fill", d=> colorScale(d))

        legend.selectAll('.legend-text')
        .data(colorScale.domain())
        .enter()
        .append('text')
        .attr('class', 'legend-text')
        .attr('x', width -130)
        .attr('y', (d,i) => i*17+height*2/3)
        .attr('alignment-baseline', 'hanging')
        .text(d=>d)

    }

scales();
