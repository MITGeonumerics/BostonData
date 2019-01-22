// Custom parking icon
var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
var icons = {
    parking: {
        icon: iconBase + 'parking_lot_maps.png'
    }  
};
/** Add a marker to map
 * @param position given in {lat,lng}. 
 * @return the plotted marker.Function also pushes marker to markers[]
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


/**
 * Create a cluster if markers.size > 10
 * @param an array of markers
 * @return updated cluster or None
 */
function setCluster(markers_list){
    if(cluster != null){
        cluster.clearMarkers()
    }
    if(markers_list.length > 10){
        cluster = new MarkerClusterer(
        map, markers_list,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        });
        return cluster;
    }
    return
}


/** Clear all plotted markers except for home location
 * @param None
 * @return None
 */ 
function resetMap(){
    if(cluster != null){
        cluster.clearMarkers();
    }
    setMapOnAll(null);
    markers = [];
}
/**Clear all plotted markers and plot new markers
 * @param array of positions, each element given in {lat,lng} format
 * @return None
 *
function refreshMap(coorList){
    resetMap();
    addMarkers(coorList);
}*/
function setMapOnAll(option) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(option);
    }
}