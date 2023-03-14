
var cities = JSON.parse(localStorage.getItem("city"))||[];
var apiURL = "https://api.openweathermap.org/data/2.5/weather?";// link for weather data
var APIKey = "44f519700a5299bfc8825f01f460623c";
var queryURL;
var city;    

function reset() {
    $('#search-input').val('');  
    $('#history').empty();
}

// set the value in local storage
function setLocalStorage () {
    localStorage.setItem('city', JSON.stringify(cities));   
}

// create new Button
function displayDataBtn() {
    city = $("#search-input").val(); 
    displayData(city, "new_city");
}; 

// get Value from localStorage
function getLocalStorage () {
    var localStorageContent = localStorage.getItem("city");
    var city_list = JSON.parse(localStorageContent);
    console.log("city length: " + city_list.length);
    for (let i = 0; i < city_list.length; i++){
        var city_his = $("<div>");
        var his_btn = $("<button>").attr({ "class": "btn btn-secondary mt-3 w-100", "id": city_list[i] });
        his_btn.text( city_list[i] );
        $(city_his).append( his_btn );
        $( "#history" ).append( city_his );
        console.log(city_list[i].name)
        $("#" + city_list[i]).on("click", function(e) {
            e.preventDefault();
            var city_name = this.id;
            displayData(city_name, "exists");
        })
    }
}

// get today's data 
//recieving data from the seach button and initiating the function for displaying today's data. Checking and showing temperature, wind, humidity
function displayData(city, state) {
    queryURL = apiURL + "q=" + city + "&appid=" + APIKey;  
    console.log(queryURL);
    $("#today").html("");
    cities.push(city);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (result) {
        console.log("latitude: " + result.coord.lon)
        var city_lat = result.coord.lat;
        var city_lon = result.coord.lon;
        var todays_weather = $("<div>");
        todays_weather.addClass("border p-3");
        var title = $( "<h1>" );
        var date = result.dt;
        var day = new Date(date*1000);// converting the data type
        title.text( result.name );
        var dt = $( "<h3>" );
        dt.text(day.toISOString().substring(0,10));
        var iconcode = result.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
        var icon_img = (`<img src="${iconurl}">`);           
        var temp = $( "<p>" );
        var k2c = ( result.main.temp - 273.15 ).toFixed(1)
        temp.text(`Temp: ${k2c}°C`);
        var wind = $( "<p>" );
        var ms2kmh = ( result.wind.speed * 3.6 ).toFixed(1)
        wind.text(`Wind: ${ ms2kmh } KPH`);
        var humidity = $( "<p>" );
        humidity.text(`Humidity: ${ result.main.humidity }%`);
        $(todays_weather).append( title, dt, icon_img, temp, wind, humidity );
        $( "#today" ).append( todays_weather );
        forecast(city_lat, city_lon);
        
         
        if(state === "exists"){
            return;
        } else {
            console.log("title.length: " + title.length);
            for (let i = 0; i < title.length; i++) {
                var city_his = $("<div>");
                var his_btn = $("<button>").attr({ "class": "btn btn-secondary mt-3 w-100", "id": result.name });
                his_btn.text( result.name );
                $(city_his).append( his_btn );
                $( "#history" ).append( city_his );
                $("#" + result.name).on("click", function(e) {
                    e.preventDefault();
                    console.log(this.id);
                    var city_name = this.id;
                    // setLocalStorage();
                    displayData(city_name, "exists");
                })
            }

        }
       
    });
}

// find the 5 days weather
function forecast(city_lat, city_lon){
    $("#forecast").html("");
    var lat = city_lat;
    var lon = city_lon;
    console.log(lat);
    console.log(lon);
    var forcastapiURL = "https://api.openweathermap.org/data/2.5/forecast?";//link for forecast data
    var forcastURL =  forcastapiURL + "lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
    console.log(forcastURL);
    $.ajax({
        url: forcastURL,
        method: "GET"
    }).then(function (response) {
        console.log(response.list);        
        for (let i = 1; i < 39; i+=8) {
            console.log(response.list[i]);
            var forecast_div = $("<div class='row m-2'>");
            var forecast_col = $("<div class='col-auto p-3 m-3 bg-dark text-light'>");               
            var iconcode = response.list[i].weather[0].icon;
            var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
            var icon_img = (`<br/><img src="${iconurl}">`);   
            var temp = $( "<p>" );
            var k2c = ( response.list[i].main.temp - 273.15 ).toFixed(1)
            temp.text(`Temp: ${k2c}°C`);
            var wind = $( "<p>" );
            var ms2kmh = ( response.list[i].wind.speed * 3.6 ).toFixed(1)
            wind.text(`Wind: ${ ms2kmh } KPH`);
            var humidity = $( "<p>" );
            humidity.text(`Humidity: ${ response.list[i].main.humidity }%`);
            var result = response.list[i].dt_txt.substring(0,10); 
            $(forecast_col).append( result, icon_img, temp, wind, humidity);
            $(forecast_div).append( forecast_col );
            $( "#forecast" ).append( forecast_div );
        }          
    });
}
//the search button works when user input the city name

$(".search-button").on("click", function (e) {
    e.preventDefault(); 
    console.log(city);    
    displayDataBtn();     
    setLocalStorage();        
});

getLocalStorage();
