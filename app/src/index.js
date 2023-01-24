// TODO LIST

// VISUALIZE POWER FLOW DATA
// find where a given power flow data parameter is being stored
// visualize a power flow data parameter in a moment
// write a README.md
// animate a power flow data parameter over time
// add a linked view of a graph overall
// add a time slider bar
// add interactivity to the map

// SEPARATE THE FRONT AND BACK END?
// make app run offline by:
    // - just include the URLs for the dependencies in the head to be fetched on running
    // - copy js files of packages into repo
    // - use node to serve and use package.json
    // - use react for same stuff as node
// write a geojson file after parsing data
// read geojson file for showing data in d3
// add other components


import * as load from "./load.js"
import * as parse from "./parse.js"
import * as show from "./show.js"

export async function VisualizeStaticData() {
    console.log("Visualizing Static Data...")
    // global data variable
    let staticData = {
        "zips" : {}, // zip code geojson
        "busStrings": [],
        "lineStrings": [],
        "busObj": {
            "type": "FeatureCollection",
            "features": []
        },  
        "lineObj": {
            "type": "FeatureCollection",
            "features": []
        }
    }

    staticData = await load.LoadStaticData(staticData);
    staticData = parse.ParseStaticData(staticData);
    show.ShowStaticData(staticData);
    console.log("Done visualizing static data.")
}

export async function VisualizeDynamicData() {
    console.log("Visualizing Dynamic Data")
    let file = await load.LoadDynamicData();
    let value = parse.ParseDynamicData(file);
    console.log("Done visualizing dynamic data")
}

VisualizeStaticData();
// VisualizeDynamicData();