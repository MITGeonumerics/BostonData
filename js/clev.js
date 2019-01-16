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

curr_time = "09:20AM"
curr_day = "SUN"

var ex_range = "00:00AM-04:00PM MON-FRI"
var ex_day = "SUN"
var ex_time = "09:00AM"

var all_time_ranges = [] //all unique time ranges for free parking
var free_meters = [] //list of meters free at given time

for(i=0; i<data_array.length; i++) {
	var meter = data_array[i].properties
	var no_pay = data_array[i].properties.PARK_NO_PAY
	//var time_array = []
	//console.log(i)
	if(no_pay != null) {
		time_array = no_pay.split(",").map(item => item.trim()) //array of free parking ranges for this meter
		for(j=0; j<time_array.length; j++) {
			if(!(all_time_ranges.includes(time_array[j]))) {
				all_time_ranges.push(time_array[j])
				//console.log(all_time_ranges)
				//console.log(i)
			}
		}
	}
	//console.log(time_array)
	var is_free_now = false
	for(var j=0; j<time_array.length; j++) { //iterate through each time range
		if(in_range(ex_day, ex_time, time_array[j])) {
			var is_free_now = true
		} 
	}
	if(is_free_now) {
		free_meters.push(i)
	}
}
//example inputs


function in_range(day, time, range) {
	//console.log(time)
	var start_time = range.substring(0, 7)
	var end_time = range.substring(8, 15)
	var start_day = range.substring(16, 19)
	var end_day = range.substring(20)
	var day_range = range.substring(16)
	var start_num = start_time.substring(0,5)
	var end_num = end_time.substring(0,5)
	var time_num = time.substring(0, 5)
	var in_time_range = false
	var in_day_range = false

	//check if in time range
	if(start_time.includes("AM")) {
		if(end_time == "24:00AM") {
			if(time_num >= start_num) {
				in_time_range = true
			}
		}
		else if(end_time.includes("AM")) { //start time AM, end time AM
			if(time.includes("AM") && time_num >= start_num && time_num <= end_num) {
				in_time_range = true
			}
		}
		else { //start time AM, end time PM
			if(time.includes("AM") && time_num >= start_num) {
				in_time_range = true
			}
			else if(time.includes("PM") && time_num <= end_num) {
				in_time_range = true
			}
		}
	}
	else { //start time PM
		if(time.includes("PM") && time_num >= start_num && time_num <= end_num) {
			in_time_range = true
		}
	}

	//check if in day range
	if(end_day == "") { //only one day
		if(start_day == day) {
			in_day_range = true
		}
	}
	else { //range of days
		if(day_range == "SUN-FRI") {
			if(day != "SAT") {
				in_day_range = true
			}
		}
		else if(day_range == "SUN-SAT") {
			in_day_range = true
		}
		else if(day_range == "MON-FRI") {
			if(day != "SAT" && day != "SUN") {
				in_day_range = true
			}
		}
		else if(day_range == "MON-SAT") {
			if(day != "SUN") {
				in_day_range = true
			}
		}
	}

	return in_day_range && in_time_range
}



//console.log(in_range(ex_day, "24:00AM", "00:00AM-24:00AM SUN"))
//console.log(in_range(ex_day, "08:00AM", "00:00AM-08:00AM MON-SAT"))
//console.log(in_range(ex_day, "06:00AM", "07:00AM-08:00AM MON-SAT"))
//console.log(in_range(ex_day, "02:00PM", "00:00AM-04:00PM MON-SAT"))
//console.log(in_range(ex_day, "02:00PM", "00:00AM-08:00AM MON-SAT"))
//console.log(in_range(ex_day, "02:00PM", "00:00AM-08:00PM MON"))

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



