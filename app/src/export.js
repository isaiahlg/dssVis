export function ExportGeoJSON(geoJSONdata, filename) {

    let dataStr = JSON.stringify(geoJSONdata);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    // linkElement.click();
};