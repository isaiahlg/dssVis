import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import {text} from 'https://cdn.skypack.dev/d3-fetch@3'; // use for reading text files into d3.js

export function LoadStaticData(data) {
    return Promise.all([
        d3.json('./data/geojsons/bay.geo.json'),
        text('./data/p13uhs0_1247/DSSfiles/Buscoords.dss'),
        text('./data/p13uhs0_1247/DSSfiles/Lines.dss'),
        text('./data/p13uhs0_1247/DSSfiles/p13uhs0_1247--p13udt13213/Lines.dss'),
        text('./data/p13uhs0_1247/DSSfiles/p13uhs0_1247--p13udt13219/Lines.dss'),
        text('./data/p13uhs0_1247/DSSfiles/p13uhs0_1247--p13udt15681/Lines.dss'),
        text('./data/p13uhs0_1247/DSSfiles/p13uhs0_1247--p13udt18158/Lines.dss'),
    ]).then(resps => {
        data.zips = resps[0];
        data.busStrings.push(resps[1]);
        for (let i = 2; i < resps.length; i += 1) {
            data.lineStrings.push(resps[i])
        }
        return data
    })
}
