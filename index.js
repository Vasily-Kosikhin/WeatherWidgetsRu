"use strict"

  const townUrl = `https://raw.githubusercontent.com/pensnarik/russian-cities/master/russian-cities.json`;

  async function f() { 


    let responseTowns = await fetch(townUrl);
    let russianTowns = await responseTowns.json();
    
    russianTowns.sort((a, b) => {
      if (a.name.trim() > b.name.trim()) {
        return 1
      } else {
        return -1
      }
    })
  
    console.log(russianTowns)
    let entryField = document.querySelector(`#entryField`)
    let townsTips = document.querySelector(`#townsTips`)
    let entryFieldCoords = entryField.getBoundingClientRect()
    let townForm = document.querySelector(`#townForm`)
    let test;


    townsTips.style.top = entryFieldCoords.bottom + 10 + `px`
    townsTips.style.left = entryFieldCoords.left + `px`
    entryField.addEventListener(`input`, createTips)
  
    function createTips() {
  
    clearTips();
      
      let usersInput = entryField.value;
      let tipsArray = [];
      
      for (let part of russianTowns) {
        if (part.name.toUpperCase().startsWith(usersInput.toUpperCase())) {
          tipsArray.push(part.name)
        }
      }
  
      for (let i = 0; i < 3; i++) {
        if (usersInput == ``) {
          break;
        } else {
          if (tipsArray[i]) {
            let newTip = document.createElement(`li`);
            newTip.innerHTML = tipsArray[i];
            townsTips.append(newTip)
          }
        }
      }
  
      
  
      if (!townsTips.querySelector(`li`) && usersInput != ``) {
        let newTip = document.createElement(`li`);
          newTip.innerHTML = `Такого города нет!`;
          newTip.style.textAlign = `center`; 
          townsTips.append(newTip)
          
      }
      if(document.querySelector(`li`)) {
        document.querySelector(`li`).style.backgroundColor = `#f2c200`
      }
      
    }
    townsTips.addEventListener(`click`, askForWearher) 
    townsTips.addEventListener(`click`, clearTips)
    townsTips.addEventListener(`pointerover`, () => (event.target.style.backgroundColor = `#f2c200`))
    townsTips.addEventListener(`pointerout`, () => (event.target.style.backgroundColor = ``))
    townForm.addEventListener(`submit`, askForWearher)

    

    

    function askForWearher() {

      if (event.type == `click`) {
        entryField.value = event.target.innerHTML
        console.log(`CLICK`)
        clearTips()
      }

      if(event.type == `submit` || event.type == `blur`) {
        if(townsTips.querySelector(`li`).innerHTML && townsTips.querySelector(`li`).innerHTML != `Такого города нет!`) {
          entryField.value = townsTips.querySelector(`li`).innerHTML
          clearTips()
        }
      }
     

      test = russianTowns.find(item => item.name == `${entryField.value}`)
      console.log(`test`,test)
      
      
      let lat = test.coords.lat
      let lon = test.coords.lon
      
      getWeatherAPI(lat, lon)

      event.preventDefault()
    }


    async function getWeatherAPI(lat, lon) {
      
  
      const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=ru&units=metric&appid=fb37c7b6bfeb4b3368e4e5ccb1ccf167`;
      let weatherRespose = await fetch(weatherAPI);
      let weatherTown = await weatherRespose.json();

      // entryField.value = weatherTown.name
      let temperature = document.querySelector(`#temperature`)
      let weatherIcon = document.querySelector(`#weatherIcon`)
      let weatherStatus = document.querySelector(`#weatherStatus`)
      let windStatus = document.querySelector(`#windStatus`)
      console.log(weatherTown)
      if(weatherTown.main.temp > 0) {
        temperature.innerHTML = `+` + parseInt(Math.round(weatherTown.main.temp))
      } else {
        temperature.innerHTML = `-` + parseInt(Math.round(weatherTown.main.temp))
      }
      
      weatherIcon.src = `http://openweathermap.org/img/wn/${weatherTown.weather[0].icon}@2x.png`;
      weatherStatus.innerHTML = weatherTown.weather[0].description[0].toUpperCase() + weatherTown.weather[0].description.slice(1);
      windStatus.innerHTML = `Ветер ${parseInt(Math.round(weatherTown.wind.speed))} м/c`
    }

    function position() {
      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true
      })
      
      function success({ coords }) {
        const { latitude, longitude } = coords
        const position = [latitude, longitude]

        getWeatherAPI(latitude, longitude)
      }
      
      function error({ message }) {
        console.log(message) // при отказе в доступе получаем PositionError: User denied Geolocation
      }
    }

    let currentTown = document.querySelector(`#currentTown`)
    currentTown.addEventListener(`click`, selectTown)

    function selectTown() {
      position();
    }

    function clearTips() {
      for (let tips of townsTips.querySelectorAll(`li`)) {
        tips.remove()
      }
    }
  } 
  
  f()

  

  
  
  // let lat = russianTowns[55].coords.lat
  // let lon = russianTowns[55].coords.lon


  // const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=ru&units=metric&appid=fb37c7b6bfeb4b3368e4e5ccb1ccf167`;

  // let weatherRespose = await fetch(weatherAPI);
  // let weatherTown = await weatherRespose.json();
  // console.log(weatherTown)