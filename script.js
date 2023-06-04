console.log("RUNNING1")

// document.getElementById("submit").addEventListener("click", console.log("CLICKED!"));

document.getElementById('submit').addEventListener("click", findTemp)

function findTemp() {
   let lat = document.getElementById('latitude').value
   let long = document.getElementById('longtitude').value
   console.log(lat + " " + long)

   fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&hourly=temperature_2m&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&forecast_days=1")
   .then(response => response.json())
   .then(data => console.log(data))
}