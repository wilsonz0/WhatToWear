let jacket      = ['heavy', 'medium', 'light', 'light', 'none'];
let topBottom   = ['thick', 'medium', 'thin', 'short', 'short'];

document.getElementById('submit').addEventListener("click", findTemp)

function findTemp() {
   let lat = document.getElementById('latitude').value
   let long = document.getElementById('longtitude').value
   console.log(lat + " " + long)

   fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&hourly=temperature_2m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&forecast_days=1")
   .then(response => response.json())
   .then(data => displayTemp(data))
}

function displayTemp(data) {
   console.log(data)
   let today = new Date();
   let hourOffset = today.getTimezoneOffset() / 60;      // the hours of offset from GMT
   let temp = data.hourly.temperature_2m
   let tempAvg = temp.reduce((a, b) => a + b) / temp.length
   
   document.getElementById("averageTemp").innerHTML = tempAvg

   /* 
    * account for GMT -> current time zone by using the offset.
    * since the .getHours() function is corresponds to the temperature
    * 
    * WARNING: (edge case) before a day and after a day
   */
   let currentTemp = temp[today.getHours() + hourOffset];
   document.getElementById("currentTemp").innerHTML = currentTemp;

   displaySuggestion(currentTemp, tempAvg);
}

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