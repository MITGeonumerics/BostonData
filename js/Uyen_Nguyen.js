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
    clearMap();
    map.setCenter(center);
    map.setZoom(13)
}
/**Clear all plotted markers and plot new markers
 * @param None
 * @return None
 */
function clearMap(){
    if(cluster != null){
        cluster.clearMarkers();
    }
    setMapOnAll(null);
    markers = [];
}
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
                '<div class="iw-title"> Hi</div>' +

                '<div class="iw-content">'  +
                '<p>Founded in 1824, the Porcelain Factory of Vista Alegre was the first industrial unit dedicated to porcelain production in Portugal. For the foundation and success of this risky industrial development was crucial the spirit of persistence of its founder, José Ferreira Pinto Basto. Leading figure in Portuguese society of the nineteenth century farm owner, daring dealer, wisely incorporated the liberal ideas of the century, having become "the first example of free enterprise" in Portugal.</p>' +
                '<div class="iw-bottom-gradient"></div>' +
            '</div>';
            var selectedPos = {lat:this.getPosition().lat(),lng:this.getPosition().lng()};
            var noPayPolicy = getInfo(selectedPos, 'PARK_NO_PAY');
            var payPolicy = getInfo(selectedPos, 'PAY_POLICY')
            var parkingType = getInfo(selectedPos, 'METER_TYPE')
            var onStreet = getInfo(selectedPos, 'STREET')
            
            infowindow.setContent(content);
            infowindow.setOptions({maxWidth:150}); 
            infowindow.open(map, this);
            map.panTo(this.getPosition())
        });
    }
}
function getIndexofPos(position){
    for(var index = 0; index < data_array.length-1; index++){
        var sameLat = position.lat == data_array[index].properties.LATITUDE;
        var sameLng = position.lng == data_array[index].properties.LONGITUDE;
        if  (sameLat && sameLng){
            return index;
        }
    }
}

function getInfo(position,prop){
    var indexPos = getIndexofPos(position);
    return data_array[indexPos].properties[prop];
}