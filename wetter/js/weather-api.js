function getWeatherData(){
    var query = "https://api.openweathermap.org/data/2.5/onecall?lat=48.391820&lon=11.091331&appid=3320df478e0b339c067df25b23f1c402&units=metric&lang=de";
    var cloudsNow, clouds1h, clouds2h, time, sunset, sunrise, sunriseTomorrow, temperature, weatherDescription, icon;

    // get weather forecast 1h
    $.getJSON(query,function(json) {
        cloudsNow = JSON.stringify(json.current.clouds);
        clouds1h = JSON.stringify(json.hourly[1].clouds);
        clouds2h = JSON.stringify(json.hourly[2].clouds);
        time = JSON.stringify(json.current.dt);
        sunset = JSON.stringify(json.daily[0].sunset);
        sunrise = JSON.stringify(json.daily[0].sunrise);
        sunriseTomorrow = JSON.stringify(json.daily[1].sunrise);
        temperature = JSON.stringify(json.current.temp);
        weatherDescription = JSON.stringify(json.current.weather[0].description);
        icon = JSON.stringify(json.current.weather[0].icon);
        evaluate(clouds1h,clouds2h, time, sunset, sunrise, sunriseTomorrow);
        displayWeatherData(weatherDescription, temperature, cloudsNow, icon);
    });
}

//TODO adapt values
function evaluate(clouds1h, clouds2h, time, sunset, sunrise, sunriseTomorrow){
    var sunriseTime;
    const colour = document.getElementById("colour");
    const colourDes = document.getElementById("colourDescription");

    if (time > sunset || time < sunrise) {
        // after sunset
        if(time < sunrise){
            sunriseTime = Math.round((sunrise - time)/3600);
        }else{
            sunriseTime = Math.round((sunriseTomorrow - time)/3600);
        }
        colour.innerHTML = "<img src='images/rot.png' alt='rot'/>"; // source: https://commons.wikimedia.org/wiki/File:Traffic_lights_4_states_1.png
        colourDes.innerHTML = "Es ist Nacht, Sonne gibts erst wieder in " + sunriseTime + " Stunden.  Waschmaschine, Trockner und Spülmaschine lieber nach Sonnenaufgang laufen lassen.";
    }else {
        if(time > sunset - 7200){
            colour.innerHTML = "<img src='images/gelb.png' alt='gelb'/>"; // source: https://upload.wikimedia.org/wikipedia/commons/3/3b/Traffic_lights_4_states_4.png
            colourDes.innerHTML ="Teilweise sonnig in den nächsten 2 Stunden.  Lieber nicht die Waschmaschine, Trockner und Spülmaschine gleichzeitig laufen lassen.";
        }else{
            if (clouds1h < 40 && clouds2h < 40) {
                // little clouds for the next 2h
                colour.innerHTML = "<img src='images/gruen.png' alt='grün'/>"; // source: https://upload.wikimedia.org/wikipedia/commons/a/ae/Traffic_lights_4_states_3.png
                colourDes.innerHTML ="Die nächsten 2 Stunden schauts gut aus. Waschmaschine, Trockner und Spülmaschine sollten kein Problem sein.";
            }else if (clouds1h < 40 || clouds2h < 40) {
                colour.innerHTML = "<img src='images/gelb.png' alt='gelb'/>"; // source: https://upload.wikimedia.org/wikipedia/commons/3/3b/Traffic_lights_4_states_4.png
                colourDes.innerHTML ="Teilweise sonnig in den nächsten 2 Stunden.  Lieber nicht die Waschmaschine, Trockner und Spülmaschine gleichzeitig laufen lassen.";
            }else{
                colour.innerHTML = "<img src='images/rot.png' alt='rot'/>"; // source: https://commons.wikimedia.org/wiki/File:Traffic_lights_4_states_1.png
                colourDes.innerHTML ="Wenig bis keine Sonne in den 2 Stunden. Lieber nicht die Waschmaschine, Trockner und Spülmaschine laufen lassen.";
            }
        }
    }
}

function displayWeatherData(d, t, c, icon){
    var iconSource = "http://openweathermap.org/img/wn/10d@2x.png";
    const description = document.getElementById("wetterBeschreibung");
    const temp = document.getElementById("temperatur");
    const clouds = document.getElementById("wolken");
    const weatherIcon = document.getElementById("weatherIcon");

    description.innerHTML = d.slice(1,-1);
    temp.innerHTML = t + "°C";
    clouds.innerHTML = c + "% Wolken";
    iconSource = iconSource.slice(0,33) + icon.slice(1,-1) + iconSource.slice(36);
    weatherIcon.innerHTML = "<img src='" + iconSource + "' alt='"+ d.slice(1,-1) +" icon' >";
}