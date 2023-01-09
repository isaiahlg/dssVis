export function ShowStaticData(data) {
    console.log("***Displaying static data files...")
    drawMap(data.zips);
    drawBusses(data.busObj);
    drawLines(data.lineObj);
    return
}

function getMapConfig(){
    let width = 600;
    let height = 600;
    let container = d3.select("#map")
        .attr("height", height)
        .attr("width", width);
    return {width, height, container};
}

function getMapProjection() {
    let projection = d3.geoMercator();
    let s0 = 10240;
    let x0 = 21879;
    let y0 = 7351;
    let m = 70;
    let b = 22;
    let s = m * s0;
    let x = m * (x0 - b);
    let y = m * (y0 - b);

    projection.scale(s).translate([x, y]);
    return projection;
}

function drawBaseMap(container, zips, projection) {
    const path = d3.geoPath().projection(projection);

    container.selectAll("path")
        .data(zips)
        .enter()
        .append("path")
        .attr("d", d => path(d)) 
        .attr("stroke", "#ccc")
        .attr("fill", "#eee");
};

function addZoom() {
    let zoom = d3.zoom().on('zoom', handleZoom);
    function handleZoom(e) {
        d3.select('#map')
            .attr('transform', e.transform);
    };
    d3.select('#map').call(zoom);
};

function drawMap(geoJson) {
    const config = getMapConfig();
    const projection = getMapProjection();
    drawBaseMap(config.container, geoJson.features, projection);
    addZoom();
};

function drawBusses(busses) {
    const config = getMapConfig();
    const projection = getMapProjection(config);
    const container = config.container;
    container.selectAll("circle")
        .data(busses.features)
        .enter()
        .append("circle")
        .attr("r", 0.8)
        .attr("cx", d => projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0])
        .attr("cy", d => projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1])
        .attr("fill", "#2a5599")
};

function drawLines(powerLines) {
    const config = getMapConfig()
    const projection = getMapProjection(config);
    const container = d3.select("#map");
    container.selectAll("line")
        .data(powerLines.features)
        .enter()    
        .append("line")
        .attr("x1", d => projection([d.geometry.coordinates[0][0], d.geometry.coordinates[0][1]])[0])
        .attr("y1", d => projection([d.geometry.coordinates[0][0], d.geometry.coordinates[0][1]])[1])
        .attr("x2", d => projection([d.geometry.coordinates[1][0], d.geometry.coordinates[1][1]])[0])
        .attr("y2", d => projection([d.geometry.coordinates[1][0], d.geometry.coordinates[1][1]])[1])
        .attr("stroke", "#992a2a")
        .attr("stroke-width", 0.5)
        .style("opacity", 1);
};