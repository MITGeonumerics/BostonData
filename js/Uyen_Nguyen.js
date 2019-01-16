
var dataArr = data.features;
function diffBASE_RATE(){
    baseRate_list = [];
    tally_chart = [];
    for(var i = 0; i< dataArr.length; i++){
        var base_rate = dataArr[i].properties.BASE_RATE;
        var isDiff = true;
        for(var c = 0; c<baseRate_list.length; c++){
            if(base_rate == baseRate_list[c]){
                isDiff = false;
                var index = baseRate_list.indexOf(base_rate);
                tally_chart[index]++;
                break;
            }
        }
        if(isDiff){
            baseRate_list.push(base_rate);
            tally_chart.push(1);
        }
    }
    console.log(baseRate_list);
    console.log(tally_chart);
}
function isActive(){
    var countActive = 0;
    var countNotActive = 0;
    
    for(var i = 0; i< dataArr.length; i++){
        var status = dataArr[i].properties.METER_STATE;
        if(status == "ACTIVE"){
            countActive++;
        }
        else{
            countNotActive++
        }
    }
    var status_list = [countActive, countNotActive];
    console.log(status_list);

}
function parking_type(){
    var singleSpaced = 0;
    var others = 0;
    var location_single = []
    var location_others = [];
    //Next step: create list of types
    for(var i = 0; i< dataArr.length; i++){
        var spaceType = dataArr[i].properties.METER_TYPE;
        if(spaceType == "SINGLE-SPACE"){
            singleSpaced++;
            location_single.push(i);
        }
        else{
            others++;
            location_others.push(i);
            
        }
    }
    console.log("Single-spaced parking: " + singleSpaced);
    console.log("Other space types: " + others);
    //console.log("Location of single: " + location_single);
    //console.log("Location of others: " + location_others);
}
function has_TowAway(){
    var unknown = 0;
    var active = 0 ;
    location_active = [];
    for(var i = 0; i< dataArr.length; i++){
        var status_TowAway = dataArr[i].properties.TOW_AWAY;
        if(status_TowAway == null){
            unknown++;
        }
        else{
            active++;
            location_active.push(i);
        }
    }
    console.log("TowAway is unknown: " + unknown);
    console.log("TowAway is active: " + active);
    //console.log("Location of active TowAway: " + location_active);

}
function diffSTREETS(){
    var street_names = [];
    var meter_locations = [];
    var tally_meter = [];
    for(var i = 0; i< dataArr.length; i++){
        var streetName = dataArr[i].properties.STREET;
        //location of meter
            var lat = dataArr[i].properties.LATITUDE;
            var lng = dataArr[i].properties.LONGITUDE;
        var isDiff = true;
        for(var c = 0; c<street_names.length; c++){
            if(streetName == street_names[c]){
                isDiff = false;
                var index = street_names.indexOf(streetName);
                tally_meter[index]++;
                meter_locations[index].push([lat,lng]);
                break;
            }
        }
        if(isDiff){ //why not false?
            street_names.push(streetName);
            meter_locations.push([[lat,lng]]);
            tally_meter.push(1);
        }
    }
    //console.log(street_list);
    //console.log(meter_locations);
    //console.log(tally_meter);
    var streets_list = [street_names,meter_locations,tally_meter];
    /*for(var i = 0; i< street_names.length; i++){
        var name = street_names[i];
        var locations = meter_locations[i];
        var count = tally_meter[i];
        streets_list.push([name,locations,count]);
    }*/

    console.log(streets_list);
    return streets_list;
}
function has_SENSOR(){
    sensorSTATUS_list = [];
    tally_sensor = [];
    for(var i = 0; i< dataArr.length; i++){
        var has_SENSOR = dataArr[i].properties.HAS_SENSOR;
        var isDiff = true;
        for(var c = 0; c<sensorSTATUS_list.length; c++){
            if(has_SENSOR == sensorSTATUS_list[c]){
                isDiff = false;
                var index = sensorSTATUS_list.indexOf(has_SENSOR);
                tally_sensor[index]++;
                break;
            }
        }
        if(isDiff){ //why not false?
            sensorSTATUS_list.push(has_SENSOR);
            tally_sensor.push(1);
        }
    }
    console.log(sensorSTATUS_list);
    console.log(tally_sensor);

}
function allCoordinates(){
    coordinates = [];
    for(var i = 0 ; i<dataArr.length; i++){
        lat = dataArr[i].properties.LATITUDE
        lng = dataArr[i].properties.LONGITUDE
        if(lat == null || lng == null){
            console.log(i);
        }
        else {
            coordinates.push({lat,lng})
        }
    }
    return coordinates
}