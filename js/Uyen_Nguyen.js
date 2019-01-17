
/** Add a marker to map
 * @param position given in {lat,lng}. 
 * @return the plotted marker.Dunction also pushes marker to markers[]
 */
function plotLatLng(position){
    var marker = new google.maps.Marker({
        position: position,
        map: map,
        icon: icons.parking.icon
    });
    markers.push(marker);
    return marker;
}

/**Add an array of markers to map
 * @param array of coordinates, each element given in {lat,lng} format
 * @return None. If array size >10, will set a cluster.
 */
function addMarkers(coorList){
    for(var i = 0; i < coorList.length; i++){
        plotLatLng(coorList[i]);
    }
    setCluster(markers);
}
/**Find all markers on speficied STREET
 * @param dataList
 * @param streetName
 * @return array of coordinates.
 */
function MarkersBySt(dataList, streetName){
    var index = dataList[0].indexOf(streetName);
    var allLocations = dataList[1][index];
    var size = dataList[2][index];
    var coorList = [];
    for(var i = 0; i<size;i++){
        var lat = allLocations[i][0];
        var lng = allLocations[i][1];
        coorList.push({lat,lng});
    }
    return coorList;
}


/**
 * Create a cluster if markers.size > 10
 * @param an array of markers
 * @return created markerCluster
 */
function setCluster(markers_list){
    if(markers_list.length > 10){
        var markerCluster = new MarkerClusterer(
        map, markers_list,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });
        cluster = markerCluster;
        return markerCluster;
    }
    return
}


/** Clear all plotted markers except for home location
 * @param None
 * @return None
 */ 
function resetMap(){
    cluster.clearMarkers();  
    setMapOnAll(null);
    markers = [];
}
/**Clear all plotted markers and plot new markers
 * @param array of positions, each element given in {lat,lng} format
 * @return None
 */
function refreshMap(coorList){
    resetMap();
    addMarkers(coorList);
}
function setMapOnAll(option) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(option);
    }
}