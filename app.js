
const API_KEY = "3af651289611407db0105856252707";
const BASE_URL = "http://api.weatherapi.com/v1/current.json?";
//String of saved locations.

function loadLocations(){
    let locations = localStorage.getItem("locations");

    if(locations){
        return JSON.parse(locations);
    }else{
        return [];
    }
}

function saveLocations(savedLocations){
    localStorage.setItem("locations", JSON.stringify(savedLocations));
}

let savedLocations = loadLocations();

//load locations and populate savedLocations from localStorage.



let searchForm = document.getElementById("searchForm");
let searchInput = document.getElementById("searchLocation");
let loadingDiv = document.querySelector("#loading");
let searchButton = document.querySelector("#searchButton");
let currentWeather = null;
let weatherContent = document.querySelector(".weatherContent");
let isF = true;


let temp = document.querySelector(".temperature");
let tempDescription = document.getElementById("tempDescription");
let cityCountry = document.getElementById("cityCountry");
let weatherImg = document.getElementById("weatherImg");
let stylesheet = document.getElementById("dayOrNight");

let savedLocationSection = document.getElementById("savedLocations");


displayLocations(savedLocations);

document.getElementById("saveButton").onclick = (e) => {
    //add [currentWeather.location.name] in the right ordered location in savedLocations
    if(!savedLocations.includes(currentWeather.location.name)){
        addLocationInOrder(currentWeather.location.name, savedLocations);
        saveLocations(savedLocations);
    }
    //display the savedLocations in the saved locations section.

    displayLocations(savedLocations);
};

function displayLocations(savedLocations){
    removeChildren(savedLocationSection);

    savedLocations.forEach(location => {
        let card = createDivCard(location);
        savedLocationSection.appendChild(card);
    })
}

//returns a div card
function createDivCard(location){
    const div = document.createElement("div");
    div.className = "location";
    const para = document.createElement("p");
    para.textContent = location;
    para.onclick = (e) => {
        loadAndDisplayWeather(location);
    }

    div.appendChild(para);

    const span = document.createElement("span");
    span.className = "remove-location";
    span.style.cursor = "pointer";
    span.style.color = "red";
    span.style.marginLeft = "8px";
    span.innerHTML = "&#10005;";
    span.onclick = (e) => {
        //remove location from savedLocations;
        //delete the div;

        savedLocations.splice(savedLocations.indexOf(location), 1);
        //save savedLocations to localStorage;
        saveLocations(savedLocations);
        div.remove();
    }

    div.appendChild(span);

    return div;
}

//removes the children of the parent
function removeChildren(parent){
    while(parent.firstChild != null){
        parent.removeChild(parent.firstChild);
    }
}

function addLocationInOrder(location, savedLocations){

    for(let i = 0; i < savedLocations.length; i++){
        if(location.toLowerCase() < savedLocations[i].toLowerCase()){
            savedLocations.splice(i, 0, location);
            return;
        }
    }

    savedLocations.push(location);
}

if(savedLocations.length == 0){
    loadAndDisplayWeather("USA");
}else{
    loadAndDisplayWeather(savedLocations[0]);
}

document.querySelector(".conversion").addEventListener('click', (event) => {
    isF = !isF;
    displayWeather(currentWeather);
    toggleButtonText(isF, event.target);
})

toggleButtonText(isF, document.querySelector(".conversion"));

function toggleButtonText(isF, targetButton){
    if(isF){
        targetButton.textContent = 'C';
    }else{
        targetButton.textContent = 'F';
    }
}


searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    //disable the search button
    searchButton.disabled = true;
  

    // call the api to get weather data in json. use text from search
    loadAndDisplayWeather(searchInput.value.toLowerCase().trim());

    


})

function loadAndDisplayWeather(location){
    toggleLoading();
        callWeatherApi(location).then((jsonData) => {
        currentWeather = jsonData;
        console.log(currentWeather);
        //display stuff from the weather data onto the stuff inside the main element
        displayWeather(currentWeather);
    }).catch((reason) => {
        console.log(reason);
        alert("Enter a valid city! or connection issue??!!!");

    }).finally(() => {
        searchButton.disabled = false;
        toggleLoading();
    })
}

function toggleLoading(){
    weatherContent.classList.toggle("invisible");
    loadingDiv.classList.toggle("invisible");
}

//displays the weather data on the screen. (no return)
function displayWeather(weatherData){
    temp.textContent = correctTemp(isF, weatherData);
    tempDescription.textContent = weatherData.current.text;
    weatherImg.src = "https://"+weatherData.current.condition.icon;

    setDayOrNight(weatherData.current.condition.icon);
    
    cityCountry.textContent = weatherData.location.name + ", " + weatherData.location.country;
}

function setDayOrNight(weatherImgUrl){
    if(weatherImgUrl.includes("night")){
        stylesheet.setAttribute("href", "night.css");

    }else{
        stylesheet.setAttribute("href", "day.css");
    }                         
}

//return string
function correctTemp(tempBool, weatherData){
    if(tempBool){
        return weatherData.current.temp_f + " degrees F";
    }else{
        return weatherData.current.temp_c + " degrees C";
    }
}

//returns a json object
async function callWeatherApi(city){
    let constructedURL = constructURL(city);
    console.log(constructedURL);
    let request = await fetch(constructURL(city));
    let jsonData = await request.json()
    return jsonData;
}


//returns a fully working string URL
function constructURL(city){
    return BASE_URL + "key="+API_KEY+"&q="+city;
}









