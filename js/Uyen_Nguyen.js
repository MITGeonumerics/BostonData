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
    assignListener();
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
    map.setCenter(center);
    map.setZoom(13)
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

function assignListener(){
    for (var i = 0, marker; marker = markers[i]; i++) {
        google.maps.event.addListener(marker, 'click', function() {
            var content = 
            '<div id="iw-container">' +
                '<div class="iw-title">Porcelain Factory of Vista Alegre</div>' +
                '<div class="iw-content">' +
                '<img src="http://maps.marnoto.com/en/5wayscustomizeinfowindow/images/vistalegre.jpg" alt="Porcelain Factory of Vista Alegre" height="115" width="83">' +
                '<p>Founded in 1824, the Porcelain Factory of Vista Alegre was the first industrial unit dedicated to porcelain production in Portugal. For the foundation and success of this risky industrial development was crucial the spirit of persistence of its founder, José Ferreira Pinto Basto. Leading figure in Portuguese society of the nineteenth century farm owner, daring dealer, wisely incorporated the liberal ideas of the century, having become "the first example of free enterprise" in Portugal.</p>' +
                '<div class="iw-bottom-gradient"></div>' +
            '</div>';

            infowindow.setContent(content);
            infowindow.setOptions({maxWidth:250}); 
            infowindow.open(map, this);
            map.panTo(this.getPosition())
        });
    }
}