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
   let today = new Date();
   let temp = data.hourly.temperature_2m
   let tempAvg = temp.reduce((a, b) => a + b) / temp.length
   let time = data.hourly.time
   
   document.getElementById("averageTemp").innerHTML = tempAvg

   // find the current time by parsing and then verifying it with our current time
   for (let i = 0; i < time.length; i++) {
      let curr = time[i]
      let currParsed = parseInt(curr.substring(curr.length - 5, curr.length - 3))

      if (today.getHours() == currParsed) {
         document.getElementById("currentTemp").innerHTML = temp[i] 
      }
   }
}