'use strict'

let currentIndex = 0;
let menus = [];
const options = document.querySelectorAll('.option');

const optionImages = [];
options.forEach(option => optionImages.push(option.querySelector('img')));

const cardBody = document.querySelector('.card__body');

function showMenu(id) {
    currentIndex = id;

    menus.forEach((el, index) => {
        el.style.display = 'none';
        if (index === currentIndex) {
            el.style.display = 'block';
        }
    })
}

function assignClicks() {
    options.forEach(
        (option, index) => {
            option.addEventListener('click', () => {
                if (currentIndex !== index) {
                    showMenu(index);
                    setOpacity(index);
                }
            });
        });
}

function setOpacity(id) {
    const opacity = { active: 1, inactive: 0.1 };

    optionImages.forEach(
        (img, index) => {
            if (id !== index) {
                img.style.opacity = opacity.inactive;
            } else {
                img.style.opacity = opacity.active;
            }
        });
}

function start() {
    for (let i = 0; i < cardBody.children.length; i++) {
        menus.push(cardBody.children[i]);
    }
    assignClicks();
}

function openMenu(id = 0) {
    showMenu(id);
    setOpacity(id);
}

start();
openMenu(0);

/* ------ */
class Rocket {
    teamNumber;
    speed;
    name;
    icon;

    launch() { }
}

const assembleButton = document.querySelector('#assemble-rocket-button');
let choosenRocket;

assembleButton.addEventListener('click', () => {
    const checkedRadio = document.querySelector('.spaceships-container input[type="radio"]:checked');
    if (checkedRadio) {
        showRocket(rockets[parseInt(checkedRadio.id.replace('ss', ''))]);
    }
});

function showRocket(rocket) {
    choosenRocket = rocket;

    const tile = document.querySelector('#rocket .info-tile__content');
    const tmp = tile.querySelectorAll('span.text');

    tile.querySelector('.info-tile__image').src = rocket.icon;
    tmp[1].innerText = rocket.name;
    tmp[3].innerText = rocket.speed;
    tmp[5].innerText = rocket.teamNumber;
}

const spaceships = document.querySelectorAll('.spaceships-container .info-tile');

function extractParameters(spaceships) {
    const spaceshipsArray = [];

    spaceships.forEach((ss) => {
        const tmp = ss.querySelectorAll('span.text');

        const rocket = new Rocket();
        rocket.name = tmp[1].innerText;
        rocket.speed = tmp[3].innerText;
        rocket.teamNumber = tmp[5].innerText;
        rocket.icon = ss.querySelector('.spaceships-option__image').src;

        spaceshipsArray.push(rocket);
    });
    choosenRocket = spaceshipsArray[0];
    return spaceshipsArray;
}

const rockets = extractParameters(spaceships);

/* ------ */

const role = Object.freeze({ Commander: 'Капитан', Medic: 'Врач', Engineer: 'Борт инженер', Spacetrooper: 'Космодесантник' });

const team = new Map([
    [role.Commander, []],
    [role.Medic, []],
    [role.Engineer, []],
    [role.Spacetrooper, []],
]);

class TeamMember {
    name;
    icon;
    role;
    static count = 0;

    constructor(name, icon, role) {
        this.name = name;
        this.icon = icon;
        this.role = role;
    }

    assign() {
        team.get(this.role).push(this);
        TeamMember.count++;
    }

    disassign() {
        team.set(this.role, team.get(this.role).filter((el) => !el.compare(this)));
        TeamMember.count--;
    }

    compare(tm) {
        return (this.name === tm.name &&
            this.icon === tm.icon &&
            this.role === tm.role);
    }
}

const members = [];

const personContainer = document.querySelector('#team-compilation .person-container');
let counter = 0;
function findRole(name) {
    name = name.replace(/[^A-Za-zА-Яа-я]/g, '');
    switch (name) {
        case 'Капитан':
            return role.Commander;
        case 'Бортинженер':
            return role.Engineer;
        case 'Врач':
            return role.Medic;
        case 'Космодесантник':
            return role.Spacetrooper;
        default:
            return null;
    }
}

personContainer.querySelectorAll('input').forEach(chk => {
    members.push(new TeamMember(
        chk.previousElementSibling.innerText,
        chk.previousElementSibling.previousElementSibling.src,
        findRole(chk.parentElement.parentElement.parentElement.previousElementSibling.textContent)));

    chk.id = 'teamchk-' + counter;
    counter++;
    chk.addEventListener('click', (click) => {
        if (click.target.checked) {
            members[parseInt(click.target.id.replace('teamchk-', ''))].assign();
            showTeamIcons(team);
        } else {
            members[parseInt(click.target.id.replace('teamchk-', ''))].disassign();
            showTeamIcons(team);
        }
    });
});

const capitanHolder = document.querySelector('#capitan-holder');
const engineerHolder = document.querySelector('#engenieer-holder');
const medicHolder = document.querySelector('#medic-holder');
const spacetrooperHolder = document.querySelector('#spacetrooper-holder');

function showTeamIcons(team) {
    function createImg(src) {
        const img = document.createElement('img');
        img.src = src;
        img.classList += 'icon';
        return img;
    }

    capitanHolder.innerHTML = '';
    engineerHolder.innerHTML = '';
    medicHolder.innerHTML = '';
    spacetrooperHolder.innerHTML = '';

    team.forEach(tmArray => {
        tmArray.forEach(tm => {
            switch (tm.role) {
                case role.Commander:
                    capitanHolder.appendChild(createImg(tm.icon));
                    break;
                case role.Engineer:
                    engineerHolder.appendChild(createImg(tm.icon));
                    break;
                case role.Medic:
                    medicHolder.appendChild(createImg(tm.icon));
                    break;
                case role.Spacetrooper:
                    spacetrooperHolder.appendChild(createImg(tm.icon));
                    break;
                default:
                    break;
            };
        });
    });

    checkIsTeamReady(choosenRocket.teamNumber, TeamMember.count);
}

const teamReadyButton = document.querySelector('#team-compilation button');

function checkIsTeamReady(target, current) {
    (target > current) ? teamReadyButton.classList.remove('button--green') : teamReadyButton.classList.add('button--green');
}

/* ------- */

async function getWeatherInfo(cityName) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=64481735fe99ef63f1d9792d2170d77b`)
        .then(response => response.json())
        .catch(error => console.log('error', error));
}

class WeatherInfo {
    static current;

    constructor(location, temperature, humidity, wind, windDirecton) {
        this.location = location;
        this.temperature = temperature;
        this.humidity = humidity;
        this.wind = wind;
        this.windDirecton = windDirecton;
    }

    static degreesToSide(deg) {
        deg = parseInt(deg);

        if (deg > 350 || deg <= 10)
            return 'С'
        if (deg > 10 && deg <= 80)
            return 'СВ'
        if (deg > 80 && deg <= 100)
            return 'В'
        if (deg > 100 && deg <= 170)
            return 'ЮВ'
        if (deg > 170 && deg <= 190)
            return 'Ю'
        if (deg > 190 && deg <= 260)
            return 'ЮЗ'
        if (deg > 260 && deg <= 280)
            return 'З'
        if (deg > 280 && deg <= 350)
            return 'СЗ'
        return '';
    }
}

async function renderWeatherInfo(cityName) {
    if (cityName !== '') {
        const weatherJson = await getWeatherInfo(cityName);

        WeatherInfo.current = new WeatherInfo(
            weatherJson.name,
            weatherJson.main.temp,
            weatherJson.main.humidity,
            weatherJson.wind.speed,
            WeatherInfo.degreesToSide(weatherJson.wind.deg));

        renderWeatherTile(weatherCheckTile.children);
        renderWeatherTile(mainWeatherTile.children);

        readyList[2].firstElementChild.classList.replace('bulletpoint--pink', 'bulletpoint--green');
        checkWeatherButton.classList.add('button--green');
    }
}

function renderWeatherTile(wtChildren) {
    if (!wtChildren[0].lastElementChild.type) {
        wtChildren[0].lastElementChild.innerText = WeatherInfo.current.location;
    }
    wtChildren[1].lastElementChild.innerText = WeatherInfo.current.temperature + ' C';
    wtChildren[2].lastElementChild.innerText = WeatherInfo.current.humidity + '%';
    wtChildren[3].lastElementChild.innerText = `${WeatherInfo.current.wind} м\\с, ${WeatherInfo.current.windDirecton}`;
}

const locationInput = document.querySelector('#location-input');

locationInput.oninput = () => {
    (locationInput.value === '') ? checkWeatherButton.classList.remove('button--green') : checkWeatherButton.classList.add('button--green');
};

const checkWeatherButton = document.querySelector("#weather button");
checkWeatherButton.addEventListener('click', () => renderWeatherInfo(locationInput.value));

const weatherCheckTile = document.querySelector("#weather .info-tile__content");

/* -------- */

const readyList = document.querySelector('#home .info-tile__list').children;

const tmpTiles = document.querySelectorAll("#home .info-tile__content");

const mainWeatherTile = tmpTiles[0];

const mainTeamTile = tmpTiles[1];

