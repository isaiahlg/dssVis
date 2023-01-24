import {text} from "https://cdn.skypack.dev/d3-fetch@3";

export function LoadStaticData(data) {
    console.log("*Fetching static data files...")
    return Promise.all([
        d3.json('/data/geojsons/bay.geo.json'),
        text('/data/p13uhs0_1247/DSSfiles/Buscoords.dss'),
        text('/data/p13uhs0_1247/DSSfiles/Lines.dss'),
        text('/data/p13uhs0_1247/DSSfiles/p13uhs0_1247--p13udt13213/Lines.dss'),
        text('/data/p13uhs0_1247/DSSfiles/p13uhs0_1247--p13udt13219/Lines.dss'),
        text('/data/p13uhs0_1247/DSSfiles/p13uhs0_1247--p13udt15681/Lines.dss'),
        text('/data/p13uhs0_1247/DSSfiles/p13uhs0_1247--p13udt18158/Lines.dss'),
    ]).then(resps => {
        data.zips = resps[0];
        data.busStrings.push(resps[1]);
        for (let i = 2; i < resps.length; i += 1) {
            data.lineStrings.push(resps[i])
        }
        return data
    })
}

export function LoadDynamicData() {
    console.log("*Fetching h5 file...")
    return fetch('/data/p13uhs0_1247/store.h5')
        .then(response => { 
            console.log("*HD5 file fetched.")
            return response.arrayBuffer() 
        })
        .then(buffer => {
            console.log("*Loading HD5 file...")
            let f = new hdf5.File(buffer, "store.h5");
            console.log("*Loaded HD5 file.")
            return f
        })
}