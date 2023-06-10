let jacket      = ['heavy', 'medium', 'light', 'light', 'none'];
let topBottom   = ['thick', 'medium', 'thin', 'short', 'short'];

document.getElementById('submit').addEventListener("click", findTemp)

/* 
 * Given the latitude and longtitude, fetch one day weather data 
*/
function findTemp() {
   let lat = document.getElementById('latitude').value
   let long = document.getElementById('longtitude').value
   console.log(lat + " " + long)

   fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&hourly=temperature_2m,precipitation_probability,rain,showers,snowfall,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&past_days=1&forecast_days=3")
   .then(response => response.json())
   .then(data => displayTemp(data))
}

/*
 * Given the weather data, displaty the data in the correct time zone
*/
function displayTemp(data) {
   console.log(data)
   let today = new Date();
   let hourOffset = today.getTimezoneOffset() / 60;      // the hours of offset from GMT
   let localTime = today.getHours() + hourOffset + 24;
   let temp = data.hourly.temperature_2m
   let rain = data.hourly.rain
   let shower = data.hourly.showers
   let snowfall = data.hourly.snowfall
   let windspeed = data.hourly.windspeed_10m
   let tempAvg = temp.reduce((a, b) => a + b) / temp.length
   
   
   document.getElementById("averageTemp").innerHTML = tempAvg

   /* 
    * account for GMT -> current time zone by using the offset.
    * since the .getHours() function is corresponds to the temperature.
    * The edge case of before and after the current day is handled by fetching
    * the previous day and the next day.
   */
   let currentTemp = temp[localTime];
   document.getElementById("currentTemp").innerHTML = currentTemp;

   displaySuggestion(currentTemp, tempAvg);

   /* 
   * TODO: Detect Special Weather: Wind, Rain, Snow, etc
   * rain: raincoat OR umbrella
   * rain + wind: raincoat
   * snow: more cold
   * snow + wind: super cold
   */
   let currentRain = rain[localTime];
   let currentShower = shower[localTime];
   let currentSnow = snowfall[localTime];
   let currentWindspeed = windspeed[localTime];
   console.log("rain: " + currentRain + " shower: " + currentShower + " snow: " + currentSnow + " wind: " + currentWindspeed);
}

/**
 * Given the currentTemp and averageTemp calcualated in displayTemp(),
 * we will find the neccessary suggestion for those temperatures 
 */
function displaySuggestion(currentTemp, averageTemp) {
   let roundedCurrentTemp = 20 * Math.round(currentTemp / 20); // to nearest even number in the tens
   let roundedAverageTemp = 20 * Math.round(averageTemp / 20);
   let posCurrent = (roundedCurrentTemp / 20) - 1;
   let posAverage = (roundedAverageTemp / 20) - 1;

   document.getElementById("currentSuggestion").innerHTML = "You should wear "
      + "Jacket: "   + jacket[posCurrent]
      + ", Top: "    + topBottom[posCurrent]
      + ", Bottom: " + topBottom[posCurrent];

   document.getElementById("completeSuggestion").innerHTML = "You should wear "
      + "Jacket: "   + jacket[posAverage]
      + ", Top: "    + topBottom[posAverage]
      + ", Bottom: " + topBottom[posAverage];
}