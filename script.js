//                       20        40       60       80 
let jacket     = ['heavy', 'medium', 'light', 'light', 'none'];
let topBottom  = ['thick', 'medium', 'thin', 'thin', 'short'];

// Event Listeners
document.getElementById('submit').addEventListener("click", findTemp)

/* 
 * Given the latitude and longtitude, fetch 4 day weather data.
 *
 * The previous day's weather and 3 days forecast are fetched.
 * Handles the edge case when a user in a different timezone and need 
 * the weather in the previous day that is in GMT time.
*/
function findTemp() {
   let lat = document.getElementById('latitude').value
   let long = document.getElementById('longtitude').value
   console.log(lat + " " + long);

   fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&hourly=temperature_2m,precipitation_probability,rain,showers,snowfall,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&past_days=1&forecast_days=3")
   .then(response => response.json())
   .then(data => displayTemp(data))
}

/*
 * Given the weather data, display the data in the correct time zone
*/
function displayTemp(data) {
   console.log(data)
   let today = new Date();
   let hourOffset = today.getTimezoneOffset() / 60;      // the hours of offset from GMT
   let localTime = today.getHours() + hourOffset + 24;   // account for GMT -> user's time zone by using the offset.
   let temp = data.hourly.temperature_2m 
   let rain = data.hourly.rain
   let shower = data.hourly.showers
   let snowfall = data.hourly.snowfall
   let windspeed = data.hourly.windspeed_10m
   let tempAvg = temp.reduce((a, b) => a + b) / temp.length
   
   document.getElementById("averageTemp").innerHTML = tempAvg

   let currentTemp = temp[localTime];
   document.getElementById("currentTemp").innerHTML = currentTemp;

   // calls the functions to display the suggestions and special suggestions
   displaySuggestion(currentTemp, tempAvg);

   let currentRain = rain[localTime];
   let currentShower = shower[localTime];
   let currentSnow = snowfall[localTime];
   let currentWindspeed = windspeed[localTime];
   displaySpecialSuggestion(currentTemp, currentRain, currentShower, currentSnow, currentWindspeed);
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

/*
 * Given the temperature, amount of rain, shower, snow, and the windspeed, it will display
 * necessary suggestions
*/
function displaySpecialSuggestion(currentTemp, currentRain, currentShower, currentSnow, currentWindspeed) {
   console.log("rain: " + currentRain + " shower: " + currentShower + " snow: " + currentSnow + " wind: " + currentWindspeed);
   /* 
   * Detect Special Weather
   * rain OR shower: raincoat OR umbrella (to generalize only rain/shower >0.1 inch will be detected)
   * snow: more cold
   * wind: might be colder
   */
   if (currentRain > 0.1 || currentShower > 0.1) {
      document.getElementById("special").innerHTML = "It seems like there will be rain. "
      + " Remember to bring a <b>raincoat</b> or <b>umbrella</b>"
   }
   if (currentSnow > 0) {
      document.getElementById("special").innerHTML = "It seems like there will be snow. "
      + " Remember to wear something extra warm"
   }
   if (currentTemp <= 50 && currentWindspeed > 3) {   // 50 F and 3 mph -- NWS
      document.getElementById("special").innerHTML = "There could be potential wind chills."
      + " Remember to wear thicker clothings"
   }
   /* 
   * rain + shower: DNE?
   * rain + snow: terrible weather
   * rain + wind: raincoat
   * 
   * shower + snow: ??
   * shower + wind: ??
   * 
   * snow + wind: super cold
   */
}