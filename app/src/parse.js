// import * as something from 'something'; // placeholder for imports

export function ParseStaticData(data) {
    console.log("**Parsing static data files...")
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
        .filter(b => b.length > 3) // filter out lines that have just "/r"
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
        .filter(l => !l.includes("Fuse.")) // filter out fuses
        .filter (l => l.includes("Line.")) // filter out "\r" lines
        .map(l => l.split(' ')) // split each line into array for easier parsing
        .forEach(l => {                 
            // convert the array of arrays into an array of geoJSON feature objects
            if (!l[3]) {
                console.log("Undefined l: ", l)
            }
            let name = l[1]
            let length = +l[3].slice(l[3].indexOf("Length=")+7) // extract chars after "="
            let bus1name = l[4].slice(l[4].indexOf("bus1=")+5, l[4].indexOf(".")) // extract chars after "=", before the "."
            let bus2name = l[5].slice(l[5].indexOf("bus2=")+5, l[5].indexOf(".")) // extract chars after "=", before the "."
            let lineCode = l[9].slice(l[9].indexOf("Linecode=")+9) // extract chars after "="                  
            let bus1feat = busObj.features.find(f => f.properties.name === bus1name);
            let bus2feat = busObj.features.find(f => f.properties.name === bus2name);            
            
            // ensure the line end buses exist, otherwise early return
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
                    "type": "LineString",
                    "coordinates": [
                        bus1coords,
                        bus2coords                            
                    ]
                }
            })
        })
    return featureArray
}

export function ParseDynamicData(f) {
    console.log("**HD5 File: ", f)
    // Documentation from js-five on GitHub:
    // let g = f.get('group');
    // let d = f.get('group/dataset');
    // let v = d.value;
    // let a = d.attrs;

    let region = f.get('Exports/p13uhs0_1247')
    // region.keys = ['Buses', 'Circuits', 'Frequency', 'FrequencyColumns', 'Lines', 'Loads', 'Mode', 'ModeColumns', 'PVSystems', 'Storages', 'Timestamp', 'TimestampColumns', 'Transformers']
    
    let timestamps = region.get('Timestamp').value // Dataset!
        // timestamp.name = '/Exports/p13uhs0_1247/Timestamp'
        // timestampValues[0] = 1483340400 = Mon Jan 02 2017 07:00:00 GMT+0000
        // timestampValues[1] = 1483340700 = Mon Jan 02 2017 07:05:00 GMT+0000
        // timestamp.attrs.length = 859

   
    let buses = region.get('Buses/ElementProperties') // ElementProperties
    // buses.keys = ['puVmagAngle', 'puVmagAngleColumnRanges', 'puVmagAngleColumns', 'puVmagAngleNames']
    let busPUVmagAngles = buses.get('puVmagAngle')
        // approx 850 rows x 25K columns, or 21.6M values
        // time to check it out!
    let busPUVmagAngleColumnRanges = buses.get('puVmagAngleColumnRanges')
        // length = 25214, integer values mostly multiples of 4 or 6, hard to interpret
    let busPUVmagAngleColumns = buses.get('puVmagAngleColumns')
        // 182 : "p13udm3216__A1__mag [pu] // voltage magnitude on phase A
        // 183 : "p13udm3216__A1__ang [Deg] // voltage angle on phase A
        // 184 : "p13udm3216__B1__mag [pu] // voltage magnitude on phase B
        // 185 : "p13udm3216__B1__ang [Deg] // voltage mangitude on phase B
        // .value.length = 25214, = # bus x 2
    let busPUVmagAngleNames = buses.get('puVmagAngleNames')
        // .value.length = 12607, = # bus
        // contains the bus names
    
    let lines = region.get('Lines/ElementProperties') // ElementProperties
    // lines.keys = ['CurrentsMagAng', 'CurrentsMagAngColumnRanges', 'CurrentsMagAngColumns', 'CurrentsMagAngNames', 'normamps', 'normampsColumnRanges', 'normampsColumns', 'normampsNames']
    
    // download a variable as a CSV file
    let csvContent = 
        "data:text/csv;charset=utf-8," 
        + busPUVmagAngleNames.value.join(',\n');
    // window.open(encodeURI(csvContent));
    

    return 3;
}