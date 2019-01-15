data_array = data.features

var street_names = [] //list of street names
var street_map = {} //maps each meter index to street
var street_map_objects = {} //maps each meter object to street
var street_map_array = []
var street_avg_lat_lon = [] //maps each avg lat-lon to streets

for(i=0; i<(data_array.length); i++) {
	var street = data_array[i].properties.STREET
	//console.log(street)

	if(!(street_names.includes(street))) {
		street_names.push(street)
	}

	if(street_map[street]) {
		street_map[street].push(i)
	}
	else {
		street_map[street] = [i]

	}
	if(street_map_objects[street]) {
		street_map_objects[street].push(data_array[i])
	}
	else {
		street_map_objects[street] = [data_array[i]]
	}

}

for(i=0; i<street_names.length; i++) {
	var street = street_names[i]
	var meter_array = [] //list of all parking meter objects on this street
	for(j=0; j<data_array.length; j++) {
		var this_street = data_array[j].properties.STREET
		//console.log(this_street)
		var meter = data_array[j]
		
		if(street == this_street) {
			meter_array.push(meter)
		}
	}
	//console.log(meter_array)
	street_map_array.push({[street]: meter_array})

}

for(i=0; i<street_names.length; i++) {
	var street = street_names[i]
	var lat_lon_array = [] //list of all lat_lon of parking meters on this street
	for(j=0; j<data_array.length; j++) {
		var this_street = data_array[j].properties.STREET
		var geometry = data_array[j].geometry

		if(geometry != null) {
			var lat_lon = data_array[j].geometry.coordinates
		}
		if(street == this_street) {
			lat_lon_array.push(lat_lon)
		}

	}

	//get avg lat and lon for this street
	var avg_lat = 0
	var avg_lon = 0
	for(k=0; k<lat_lon_array.length; k++) {
		avg_lon += lat_lon_array[k][0]  //lon is 1st coord
		avg_lat += lat_lon_array[k][1]  //lat is 2nd coord
	}
	avg_lat /= lat_lon_array.length
	avg_lon /= lat_lon_array.length
	//console.log(avg_lat)

	//push in form [lat, lon] for map
	street_avg_lat_lon.push({[street]: [avg_lat, avg_lon]})
}


//var arr = Object.values(street_map_objects)
//function insertText() {
//	document.getElementById("res").innerHTML = street_names
//}

    	var fragment = document.createDocumentFragment();
		console.log(select)
		for(var i=0; i<street_names.length; i++) {
			var opt = street_names[i]
			var el = document.createElement('option')
			el.innerHTML = opt
			el.value = opt
			fragment.appendChild(el)
		}
		var select = document.getElementById('select')
		select.appendChild(fragment)

		function getCoords() {
			var name = document.getElementById('select').value
			console.log(name)
			var street_index = street_names.indexOf(name)
			console.log(street_index)
			var coords = Object.values(street_avg_lat_lon[street_index])
			console.log(coords)
			document.getElementById('res').innerHTML = coords
		}

