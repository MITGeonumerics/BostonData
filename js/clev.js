data_array = data.features

var street_names = [] //list of street names
var street_map = {} //maps each meter index to street
var street_map_objects = {} //maps each meter object to street
var street_map_array = []
var street_avg_lat_lon = [] //maps each avg lat-lon to streets
var free_parking_times = [] //list of unique free parking times
var free_parking_count = [] //count for number of meters for each free parking time

for(i=0; i<(data_array.length); i++) {
	var street = data_array[i].properties.STREET
	var free = data_array[i].properties.PARK_NO_PAY

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

	if(!(free_parking_times.includes(free))) {
		free_parking_times.push(free)
	}

	if(free_parking_count[free]) {
		free_parking_count[free].push(i)
	}
	else {
		free_parking_count[free] = [i]
	}

}

for(i=0; i<street_names.length; i++) {
	var street = street_names[i]
	var meter_array = [] //list of all parking meter objects on this street
	for(j=0; j<data_array.length; j++) {
		var this_street = data_array[j].properties.STREET
		var meter = data_array[j]		
		if(street == this_street) {
			meter_array.push(meter)
		}
	}
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

	//push in form [lat, lon] for map
	street_avg_lat_lon.push({[street]: [avg_lat, avg_lon]})
}

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

curr_time = "09:20"
curr_day = "SUN"

var all_time_ranges = [] //all unique time ranges for free parking
for(i=0; i<data_array.length; i++) {
	meter = data_array[i].properties
	no_pay = data_array[i].properties.PARK_NO_PAY
	//console.log(i)
	if(no_pay != null) {
		time_array = no_pay.split(",") //array of free parking ranges for this meter
		for(j=0; j<time_array.length; j++) {
			if(!(all_time_ranges.includes(time_array[j]))) {
				all_time_ranges.push(time_array[j])
				//console.log(all_time_ranges)
				//console.log(i)
			}
		}
	}
}


	//all meters free parking times on SUNDAY
// 	meter.free = [{"SUN": 0}, {"MON": 0}, {"TUE": 0},{"WED": 0},{"THU": 0},{"FRI": 0}, {"SAT": 0}]
// 	if(i==2071) {
// 		meter.free.SUN = [["00:00", "08:00"], ["20:00", "24:00"]]
// 	}
// 	else if(!(i==3222 || i ==6954)) {
// 		//console.log(i)
// 		meter.free.SUN = [["00:00", "24:00"]]
// 	}
// }

// //list of all free meters at given time
// free_meters = []
// for(i=0; i<data_array.length; i++) {
// 	if(!(i==3222 || i==6954)) {
// 		free_times = data_array[i].properties.free[curr_day]
// 		//free_meters = []
// 		is_free = false
// 		//console.log(i)
// 		for(j=0; j<free_times.length; j++) {
// 			if(curr_time >= free_times[j][0] && curr_time <= free_times[j][1]) {
// 				is_free = true
// 			}
// 		}
// 		if(is_free) {
// 			free_meters.push(i)
// 		}
		
// 	}
// }



