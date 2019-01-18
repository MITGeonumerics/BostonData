var dataArray = data.features;

//1) Create a thing that tallies the number of meters per street
function metersPerStreet() {
    var stArr = uniqueStreetArray()
    var stCounterArr = []
    for (var k = 0; k < stArr.length; k++) {
        stCounterArr.push(0)
    }

    for (var i = 0; i < dataArray.length; i++) {
        for (var j = 0; j < stArr.length; j++) {
            if (dataArray[i].properties.STREET == stArr[j]) {
                stCounterArr[j]++
            }
        }
    }

    var arr = []
    for (var l = 0; l < stArr.length; l++) {
        arr.push([stArr[l], stCounterArr[l]])
    }
    arr.sort(function (a, b) { return b[1] - a[1] })

    return arr
}

function topmetersPerStreet(x) {
    arr = metersPerStreet()
    arr2 = []
    for (var i = 0; i < x; i++) {
        arr2.push(arr[i])
    }
    return arr2
}
// 2) Create a thing that is an array of arrays representing which day has the most open hours?

function freeMeterDailyTallies() {
    arrCounts = [0, 0, 0, 0, 0, 0, 0]

    for (var i = 0; i < dataArray.length; i++) {
        var arr = freeMeterDailyTally(i)
        for (var j = 0; j < 7; j++) {
            if (arrCounts[j] == null) {
                k = 0
            }
            else arrCounts[j] += arr[j]
        }
    }

    return arrCounts

}

function freeMeterDailyTally(l) {

    sunCount = 0
    monCount = 0
    tueCount = 0
    wedCount = 0
    thuCount = 0
    friCount = 0
    satCount = 0

    daysOfWk = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

    if (dataArray[l].properties.PARK_NO_PAY == null) {
        return [0, 0, 0, 0, 0, 0, 0];
    }
    var strTotal = dataArray[l].properties.PARK_NO_PAY
    var arrHrs = createArrayOfHours(strTotal)

    for (var i = 0; i < arrHrs.length; i++) {
        var current = (calculateHours(convertStrObj(arrHrs[i]).startN, convertStrObj(arrHrs[i]).startT, convertStrObj(arrHrs[i]).endN, convertStrObj(arrHrs[i]).endT))
        for (var j = daysOfWk.indexOf(convertStrObj(arrHrs[i]).startDay); j <= daysOfWk.indexOf(convertStrObj(arrHrs[i]).endDay); j++) {
            if (j == 0) {
                sunCount += current
            }
            if (j == 1) {
                monCount += current
            }
            if (j == 2) {
                tueCount += current
            }
            if (j == 3) {
                wedCount += current
            }
            if (j == 4) {
                thuCount += current
            }
            if (j == 5) {
                friCount += current
            }
            if (j == 6) {
                satCount += current
            }
        }
    }
    arrTallies = [sunCount, monCount, tueCount, wedCount, thuCount, friCount, satCount]
    return arrTallies
}

//3) Find the average amount hours that parking is free
function averageFreeHoursPerWeek() {
    var numerator = 0;
    var meters = 0;
    for (var i = 0; i < dataArray.length; i++) {
        numerator += totalFreeHours(i);
        meters++;
    }
    return numerator / meters;
}

function totalFreeHours(l) {
    totalHoursCounter = 0;

    if (dataArray[l].properties.PARK_NO_PAY == null) {
        return 0;
    }
    var strTotal = dataArray[l].properties.PARK_NO_PAY
    var arrHrs = createArrayOfHours(strTotal)
    for (var i = 0; i < arrHrs.length; i++) {
        totalHoursCounter += (calculateHours(convertStrObj(arrHrs[i]).startN, convertStrObj(arrHrs[i]).startT, convertStrObj(arrHrs[i]).endN, convertStrObj(arrHrs[i]).endT)) * convertStrObj(arrHrs[i]).nDays;
    }

    return totalHoursCounter;
}

function createArrayOfHours(hrStr) {
    if (hrStr == null) {
        arr = ["00:00AM:00:00AM SUN"]
    }

    var arr = hrStr.split(",")

    for (var i = 1; i < arr.length; i++) {
        arr[i] = arr[i].substring(1);
    }

    return arr;
}

function convertStrObj(str) {
    daysOfWk = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

    if (str.charAt(3) == "0") {
        sN = parseInt(str.substring(0, 2))
    }
    else {
        sN = parseInt(str.substring(0, 2)) + .5
    }

    if (str.charAt(11) == "0") {
        eN = parseInt(str.substring(8, 10))
    }
    else {
        eN = parseInt(str.substring(0, 2)) + .5
    }

    sT = str.substring(5, 7)
    eT = str.substring(13, 15)

    if (str.substring(15).includes("-") == false) {
        d1 = str.substring(16, 19)
        d2 = d1
        nD = 1
    }
    else {
        d1 = str.substring(16, 19)
        d2 = str.substring(20, 23)
        nD = daysOfWk.indexOf(d2) - daysOfWk.indexOf(d1) + 1
    }


    var hourObj = {
        startN: sN,
        startT: sT,
        endN: eN,
        endT: eT,
        nDays: nD,
        startDay: d1,
        endDay: d2,
    }


    return hourObj;
}


function calculateHours(startNum, startTime, endNum, endTime) {
    diff = endNum - startNum

    if (startTime == "AM" && endTime == "AM" || startTime == "PM" && endTime == "PM") {
        if (startNum < endNum) {
            return diff
        }
        if (endNum < startNum) {
            return 24 - diff
        }
    }
    if (startTime == "AM" && endTime == "PM") {
        if (startNum <= endNum) {
            return 12 + diff
        }
        if (endNum < startNum) {
            return 12 - Math.abs(diff)
        }
    }
    if (startTime == "PM" && endTime == "AM") {
        if (startNum < endNum && endNum == 24) {
            return 12 - startNum
        }
        if (startNum < endNum) {
            return 12 + diff
        }
        if (endNum <= startNum) {
            return 12 - Math.abs(diff)
        }
    }
}

//4) Find the number of different streets on which there is parking

function streetCounter() {

    var uniqueStreets = ["Generic Name"];

    for (var i = 0; i < dataArray.length; i++) {
        for (var j = 0; j < uniqueStreets.length; j++) {
            if (uniqueStreets[j] == dataArray[i].properties.STREET) {
                break;
            }
            if (j == uniqueStreets.length - 1 && uniqueStreets[j] != dataArray[i].properties.STREET) {
                uniqueStreets.push(dataArray[i].properties.STREET)
            }
        }
    }
    uniqueStreets.shift();
    return uniqueStreets.length
}

function uniqueStreetArray() {

    var uniqueStreets = ["Generic Name"];

    for (var i = 0; i < dataArray.length; i++) {
        for (var j = 0; j < uniqueStreets.length; j++) {
            if (uniqueStreets[j] == dataArray[i].properties.STREET) {
                break;
            }
            if (j == uniqueStreets.length - 1 && uniqueStreets[j] != dataArray[i].properties.STREET) {
                uniqueStreets.push(dataArray[i].properties.STREET)
            }
        }
    }
    uniqueStreets.shift();
    return uniqueStreets
}
//5) Find the number of active and inactive meters
function meterActivityCounter() {

    var activeMeters = 0;
    var inactiveMeters = 0;
    var nullActivityMeters = 0;

    for (var i = 0; i < dataArray.length; i++) {
        if (dataArray[i].properties.METER_STATE == "ACTIVE") {
            activeMeters++
        }
        if (dataArray[i].properties.METER_STATE == "INACTIVE") {
            inactiveMeters++
        }
        if (dataArray[i].properties.METER_STATE == null) {
            nullActivityMeters++
        }
    }

    console.log("Active meters:" + activeMeters);
    console.log("Inactive meters:" + inactiveMeters);
    console.log("Null-activity meters:" + nullActivityMeters);

}
//6) Find the numbers of meters that are single space
function meterSpaceTypeCounter() {

    var singleSpaceCounter = 0;
    var otherCounter = 0;

    for (var i = 0; i < dataArray.length; i++) {
        if (dataArray[i].properties.METER_TYPE == "SINGLE-SPACE") {
            singleSpaceCounter++
        }
        else {
            otherCounter++
        }
    }

    console.log("Single space: " + singleSpaceCounter);
    console.log("Other: " + otherCounter);

}
//7) Find the number of different no pay hours
function noPayHoursCounter() {

    var uniqueHours = ["Generic Name"];

    for (var i = 0; i < dataArray.length; i++) {
        for (var j = 0; j < uniqueHours.length; j++) {
            if (uniqueHours[j] == dataArray[i].properties.PARK_NO_PAY) {
                break;
            }
            if (j == uniqueHours.length - 1 && uniqueHours[j] != dataArray[i].properties.PARK_NO_PAY) {
                uniqueHours.push(dataArray[i].properties.PARK_NO_PAY)
            }
        }
    }
    uniqueHours.shift();
    return(uniqueHours.length)
}

function uniqueNoPayHoursArr() {

    var uniqueHours = ["Generic Name"];

    for (var i = 0; i < dataArray.length; i++) {
        for (var j = 0; j < uniqueHours.length; j++) {
            if (uniqueHours[j] == dataArray[i].properties.PARK_NO_PAY) {
                break;
            }
            if (j == uniqueHours.length - 1 && uniqueHours[j] != dataArray[i].properties.PARK_NO_PAY) {
                uniqueHours.push(dataArray[i].properties.PARK_NO_PAY)
            }
        }
    }
    uniqueHours.shift();
    return uniqueHours;
}

//8) Find the number districts
function districtCounter() {

    var uniqueDistricts = ["Generic Name"];

    for (var i = 0; i < dataArray.length; i++) {
        for (var j = 0; j < uniqueDistricts.length; j++) {
            if (uniqueDistricts[j] == dataArray[i].properties.G_DISTRICT) {
                break;
            }
            if (j == uniqueDistricts.length - 1 && uniqueDistricts[j] != dataArray[i].properties.G_DISTRICT) {
                uniqueDistricts.push(dataArray[i].properties.G_DISTRICT)
            }
        }
    }
    uniqueDistricts.shift();
    console.log(uniqueDistricts);
    console.log(uniqueDistricts.length - 1)
}

//9) Spaces in each district
function spacesPerDistrict() {

    var d0Counter = 0;
    var d1Counter = 0;

    for (var i = 0; i < dataArray.length; i++) {
        if (dataArray[i].properties.G_DISTRICT == "DISTRICT 0") {
            d0Counter++;
        }
        if (dataArray[i].properties.G_DISTRICT == "DISTRICT 1") {
            d1Counter++;
        }
    }

    console.log("D0 Spaces: " + d0Counter)
    console.log("D1 Spaces: " + d1Counter)
}
//10) Find the numbers of meters that have sensors
function sensorCounter() {

    var sensorCounter = 0;
    var nullSensorCounter = 0;
    var noSensorCounter = 0;

    for (var i = 0; i < dataArray.length; i++) {
        if (dataArray[i].properties.HAS_SENSOR == "YES") {
            sensorCounter++
        }
        if (dataArray[i].properties.HAS_SENSOR == null) {
            nullSensorCounter++
        }
        else {
            noSensorCounter++
        }
    }

    return noSensorCounter;
}
//11) Find the number of different date on which meters were installed

function installationCounter() {

    var uniqueInstallation = ["Generic Name"];

    for (var i = 0; i < dataArray.length; i++) {
        for (var j = 0; j < uniqueInstallation.length; j++) {
            if (uniqueInstallation[j] == dataArray[i].properties.INSTALLED_ON) {
                break;
            }
            if (j == uniqueInstallation.length - 1 && uniqueInstallation[j] != dataArray[i].properties.INSTALLED_ON) {
                uniqueInstallation.push(dataArray[i].properties.INSTALLED_ON)
            }
        }
    }
    uniqueInstallation.shift();
    return uniqueInstallation.length
}

function uniqueInstallationArray() {

    var uniqueInstallation = ["Generic Name"];

    for (var i = 0; i < dataArray.length; i++) {
        for (var j = 0; j < uniqueInstallation.length; j++) {
            if (uniqueInstallation[j] == dataArray[i].properties.INSTALLED_ON) {
                break;
            }
            if (j == uniqueInstallation.length - 1 && uniqueInstallation[j] != dataArray[i].properties.INSTALLED_ON) {
                uniqueInstallation.push(dataArray[i].properties.INSTALLED_ON)
            }
        }
    }
    uniqueInstallation.shift();
    return uniqueInstallation
}
function installationsPerDate() {
    var instArr = uniqueInstallationArray()
    var instCounterArr = []
    for (var k = 0; k < instArr.length; k++) {
        instCounterArr.push(0)
    }

    for (var i = 0; i < dataArray.length; i++) {
        for (var j = 0; j < instArr.length; j++) {
            if (dataArray[i].properties.INSTALLED_ON == instArr[j]) {
                instCounterArr[j]++
            }
        }
    }

    var arr = []
    for (var l = 0; l < instArr.length; l++) {
        arr.push([instArr[l], instCounterArr[l]])
    }
    arr.sort(function (a, b) { return b[1] - a[1] })

    return arr
}

//12) Unique pay hours
function payHoursCounter() {

    var uniqueHours = ["Generic Name"];

    for (var i = 0; i < dataArray.length; i++) {
        for (var j = 0; j < uniqueHours.length; j++) {
            if (uniqueHours[j] == dataArray[i].properties.PAY_POLICY) {
                break;
            }
            if (j == uniqueHours.length - 1 && uniqueHours[j] != dataArray[i].properties.PAY_POLICY) {
                uniqueHours.push(dataArray[i].properties.PAY_POLICY)
            }
        }
    }
    uniqueHours.shift();
    return uniqueHours
}

//12.5) Unique pay hours without the $ or total cost thingy
function refinePayHours() {
    arr1 = payHoursCounter()

    for (var i = 0; i < arr1.length; i++) {
        var hoursOnly = ""

        if (arr1[i] == null) {
            arr1[i] = null
        }
        else {
            arr = createArrayOfHours(arr1[i])

            for (var j = 0; j < arr.length; j++) {
                dollarSignIndex = arr[j].indexOf("$")-1
                arr[j] = arr[j].substring(0, dollarSignIndex)
            }

            for (var k = 0; k < arr.length; k++) {
                hoursOnly += arr[k] + ", "
            }
            hoursOnly = hoursOnly.substring(0,hoursOnly.length-2)
            arr1[i] = hoursOnly
        }
    }

    return arr1
}

function uniquePayHoursWithoutCosts(){
    arr = refinePayHours()

    var uniqueHours = ["Generic Name"];

    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < uniqueHours.length; j++) {
            if (uniqueHours[j] == arr[i]) {
                break;
            }
            if (j == uniqueHours.length - 1 && uniqueHours[j] != arr[i]) {
                uniqueHours.push(arr[i])
            }
        }
    }
    uniqueHours.shift();
    return uniqueHours

}

//13) pay hours

function averagePayHoursPerWeek() {
    var numerator = 0;
    var meters = 0;
    for (var i = 0; i < dataArray.length; i++) {
        numerator += totalPayHours(i);
        meters++;
    }
    return numerator / meters;
}

function totalPayHours(l) {
    totalHoursCounter = 0;

    if (dataArray[l].properties.PAY_POLICY == null) {
        return 0;
    }
    var strTotal = dataArray[l].properties.PAY_POLICY
    var arrHrs = createArrayOfHours(strTotal)
    for (var i = 0; i < arrHrs.length; i++) {
        totalHoursCounter += (calculateHours(convertStrObj(arrHrs[i]).startN, convertStrObj(arrHrs[i]).startT, convertStrObj(arrHrs[i]).endN, convertStrObj(arrHrs[i]).endT)) * convertStrObj(arrHrs[i]).nDays;
    }

    return totalHoursCounter;
}

// 14) Create a thing that is an array of arrays representing which day has the most open hours?

function payMeterDailyTallies() {
    arrCounts = [0, 0, 0, 0, 0, 0, 0]

    for (var i = 0; i < dataArray.length; i++) {
        var arr = payMeterDailyTally(i)
        for (var j = 0; j < 7; j++) {
            if (arrCounts[j] == null) {
                k = 0
            }
            else arrCounts[j] += arr[j]
        }
    }

    return arrCounts

}

function payMeterDailyTally(l) {

    sunCount = 0
    monCount = 0
    tueCount = 0
    wedCount = 0
    thuCount = 0
    friCount = 0
    satCount = 0

    daysOfWk = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

    if (dataArray[l].properties.PAY_POLICY == null) {
        return [0, 0, 0, 0, 0, 0, 0];
    }
    var strTotal = dataArray[l].properties.PAY_POLICY
    var arrHrs = createArrayOfHours(strTotal)

    for (var i = 0; i < arrHrs.length; i++) {
        var current = (calculateHours(convertStrObj(arrHrs[i]).startN, convertStrObj(arrHrs[i]).startT, convertStrObj(arrHrs[i]).endN, convertStrObj(arrHrs[i]).endT))
        for (var j = daysOfWk.indexOf(convertStrObj(arrHrs[i]).startDay); j <= daysOfWk.indexOf(convertStrObj(arrHrs[i]).endDay); j++) {
            if (j == 0) {
                sunCount += current
            }
            if (j == 1) {
                monCount += current
            }
            if (j == 2) {
                tueCount += current
            }
            if (j == 3) {
                wedCount += current
            }
            if (j == 4) {
                thuCount += current
            }
            if (j == 5) {
                friCount += current
            }
            if (j == 6) {
                satCount += current
            }
        }
    }
    arrTallies = [sunCount, monCount, tueCount, wedCount, thuCount, friCount, satCount]
    return arrTallies
}
//15) Tally directions of spots
function directionCounter() {

    var south = 0;
    var north = 0;
    var east = 0;
    var west = 0;
    var nullDirCounter = 0;

    var arr = []

    for (var i = 0; i < dataArray.length; i++) {
        if (dataArray[i].properties.DIR == "S") {
            south++
        }
        if (dataArray[i].properties.DIR == "E") {
            east++
        }
        if (dataArray[i].properties.DIR == "W") {
            west++
        }
        if (dataArray[i].properties.DIR == "N") {
            north++
        }
        if (dataArray[i].properties.DIR == null) {
            nullDirCounter++
        }
    }
    arr = [["North", north], ["South", south], ["East", east], ["West", west], ["Null", nullDirCounter]]

    return arr;
}

//16) Most popular pay hours range
function payHourRangeArr() {
    ranges = payHoursCounter()
    rangesCounts = []

    for (var i = 0; i<ranges.length; i++) {
        rangesCounts.push(0)
    }

    for (var j = 0; j<dataArray.length; j++) {
        index = ranges.indexOf(dataArray[j].properties.PAY_POLICY)
        rangesCounts[index] +=1
    }

    arr = []
    for (var k = 0; k<ranges.length; k++) {
        arr.push([ranges[k], rangesCounts[k]])
    }
    arr.sort(function (a, b) { return b[1] - a[1] })
    return arr
}

function eliminateCostFromHourModeArr() {
    arr1 = payHourRangeArr()

    for (var i = 0; i < arr1.length; i++) {
        var hoursOnly = ""

        if (arr1[i][0] == null) {
            arr1[i][0] = null
        }
        else {
            arr = createArrayOfHours(arr1[i][0])

            for (var j = 0; j < arr.length; j++) {
                dollarSignIndex = arr[j].indexOf("$")-1
                arr[j] = arr[j].substring(0, dollarSignIndex)
            }

            for (var k = 0; k < arr.length; k++) {
                hoursOnly += arr[k] + ", "
            }
            hoursOnly = hoursOnly.substring(0,hoursOnly.length-2)
            arr1[i][0] = hoursOnly
        }
    }

    return arr1
}

function combinedPayHourModesNoCost(){
    arr = eliminateCostFromHourModeArr()
    for (var i = 0; i<arr.length; i++) {
        for (var j = i+1; j<arr.length-1; j++) {
            if (arr[i][0]==arr[j][0]) {
                arr[i][1] += arr[j][1]
                arr.splice(j, 1)
                j--;
            }
        }
    }
    arr.sort(function (a, b) { return b[1] - a[1] })
return arr
}

//17) Most popular free hour range
function freeHourRangeArr() {
    ranges = uniqueNoPayHoursArr()
    rangesCounts = []

    for (var i = 0; i<ranges.length; i++) {
        rangesCounts.push(0)
    }

    for (var j = 0; j<dataArray.length; j++) {
        index = ranges.indexOf(dataArray[j].properties.PARK_NO_PAY)
        rangesCounts[index] +=1
    }

    arr = []
    for (var k = 0; k<ranges.length; k++) {
        arr.push([ranges[k], rangesCounts[k]])
    }
    arr.sort(function (a, b) { return b[1] - a[1] })

    return arr
}

//17.5) limit to top popular free hour ranges
function topFreeRangePerStreet(x) {
    arr = freeHourRangeArr()
    arr2 = []
    for (var i = 0; i < x; i++) {
        arr2.push(arr[i])
    }
    return arr2
}

//17.75) limit to top popular par hour ranges
function topPayRangePerStreet(x) {
    arr = combinedPayHourModesNoCost()
    arr2 = []
    for (var i = 0; i < x; i++) {
        arr2.push(arr[i])
    }
    return arr2
}
















//HERE I CAN DO CHARTS I THINK

// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);
google.charts.setOnLoadCallback(drawChart2);
google.charts.setOnLoadCallback(drawChart4);
google.charts.setOnLoadCallback(drawChart5);
google.charts.setOnLoadCallback(drawChart6);


google.charts.load('current', { 'packages': ['table'] });
google.charts.setOnLoadCallback(drawChart3);












// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Day');
    data.addColumn('number', 'Hours');
    data.addRows([
        ['Sunday', 166860],
        ['Monday', 91133.5],
        ['Tuesday', 91133.5],
        ['Wednesday', 91133.5],
        ['Thursday', 91133.5],
        ['Friday', 91133.5],
        ['Saturday', 94222],
    ]);

    // Set chart options
    var options = {
        'title': 'Hours of free parking per day of the week',
        'width': 400,
        'height': 300
    };

    // Instantiate and draw our chart, passing in some options.
    //   var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}




















// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart2() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Street');
    data.addColumn('number', 'Number of Meters');
    data.addRows(
        topmetersPerStreet(50)
    );

    // Set chart options
    var options = {
        'title': 'Meters Per Street',
        'width': 700,
        'height': 500
    };

    // Instantiate and draw our chart, passing in some options.
    //   var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div2'));
    chart.draw(data, options);
}








function drawChart3() {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Street')
    data.addColumn('number', 'Number of Meters')
    data.addRows(
        topmetersPerStreet(10)
    )
    var table = new google.visualization.Table(document.getElementById('table_div'));

    table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
}











// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart4() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'InstallationDate');
    data.addColumn('number', 'Number of Meters');
    data.addRows(installationsPerDate());

    // Set chart options
    var options = {
        'title': 'Installations Per Date',
        'width': 400,
        'height': 300
    };

    // Instantiate and draw our chart, passing in some options.
    //   var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    var chart = new google.visualization.PieChart(document.getElementById('chart_div4'));
    chart.draw(data, options);
}

















// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart5() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Hour Range');
    data.addColumn('number', 'Number of Meters');
    data.addRows(
        topPayRangePerStreet(5)
    );

    // Set chart options
    var options = {
        'title': 'Counts of Common Hour Ranges - Paid Parking',
        'width': 700,
        'height': 500
    };

    // Instantiate and draw our chart, passing in some options.
    //   var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div5'));
    chart.draw(data, options);
}



















// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart6() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Hour Range');
    data.addColumn('number', 'Number of Meters');
    data.addRows(
        topFreeRangePerStreet(5)
    );

    // Set chart options
    var options = {
        'title': 'Counts of Common Hour Ranges - Free Parking',
        'width': 700,
        'height': 500
    };

    // Instantiate and draw our chart, passing in some options.
    //   var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div6'));
    chart.draw(data, options);
}