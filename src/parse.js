
export function ParseData(data) {
    // initialize geoJSON objects for storing output of parsing functions
    data.busStrings.forEach(b => {
        data.busObj.features.push(...parseBusData(b));
        return;
    })
    data.lineStrings.forEach(l => {
        data.lineObj.features.push(...parseLineData(l, data.busObj))
    })
    return data
}


function parseBusData(busStr) {
    // array for results
    let featureArray = []
    
    // split up bus text into an array
    busStr
        .split('\n') // get each bus with newline element
        .filter(b => b.length) // filter blank lines
        .map(bus => bus.split(' ')) // split each bus into name and coords
        .forEach(b => { 
            // convert the array of arrays into an array of geoJSON feature objects
            let busName = b[0]
            let busLong = +b[1]
            let busLat = +b[2]
            
            featureArray.push({
                "type": "Feature",
                "properties": {
                    "name": busName
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [busLong, busLat]
                }
            })
        });
    return featureArray;
}

function parseLineData(lineStr, busObj) {
    // array for the results
    let featureArray = []
    
    lineStr
        .split('\n') // parse the line string into an array
        .filter(l => l.length) // filter out blank lines
        .filter(b => !b.includes("Fuse.")) // filter out fuses
        .map(l => l.split(' ')) // split each line into array for easier parsing
        .forEach(l => {                 
            // convert the array of arrays into an array of geoJSON feature objects
            let name = l[1]
            let length = +l[3].slice(l[3].indexOf("Length=")+7) // extract chars after "="
            let bus1name = l[4].slice(l[4].indexOf("bus1=")+5, l[4].indexOf(".")) // extract chars after "=", before the "."
            let bus2name = l[5].slice(l[5].indexOf("bus2=")+5, l[5].indexOf(".")) // extract chars after "=", before the "."
            let lineCode = l[9].slice(l[9].indexOf("Linecode=")+9) // extract chars after "="                  
            let bus1feat = busObj.features.find(f => f.properties.name === bus1name);
            let bus2feat = busObj.features.find(f => f.properties.name === bus2name);            
            
            // ensure the line end busses exist, otherwise early return
            if (!bus1feat || !bus2feat) {return} 

            let bus1coords = bus1feat.geometry.coordinates
            let bus2coords = bus2feat.geometry.coordinates
            
            featureArray.push({
                "type": "Feature",
                "properties": {
                    "name": name,
                    "length": length,
                    "bus1": bus1name,
                    "bus2": bus2name,
                    "lineCode": lineCode,
                },
                "geometry": {
                    "type": "linestring",
                    "coordinates": [
                        bus1coords,
                        bus2coords                            
                    ]
                }
            })
        })
    return featureArray
}