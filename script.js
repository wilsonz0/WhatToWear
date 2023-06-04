console.log("RUNNING1")

// document.getElementById("submit").addEventListener("click", console.log("CLICKED!"));

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
   
   document.getElementById("averageTemp").innerHTML = tempAvg          // + " " + data.timezone + "+" + (-1*hourOffset)

   /* 
    * account for GMT -> current time zone by using the offset.
    * since the .getHours() function is corresponds to the temperature
    * 
    * edge case: before a day and after a day
   */
   document.getElementById("currentTemp").innerHTML = temp[ today.getHours() + hourOffset ]
}