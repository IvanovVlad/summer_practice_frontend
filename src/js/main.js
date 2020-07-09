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
openMenu(2);

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

    constructor(name, icon, role) {
        this.name = name;
        this.icon = icon;
        this.role = role;
    }

    assign() {
        team.get(this.role).push(this);
    }
}

const members = [];

const personContainer = document.querySelector('#team-compilation .person-container');

personContainer.querySelectorAll('input').forEach(chk => {
    members.push(new TeamMember(
        chk.previousElementSibling.innerText,
        chk.previousElementSibling.previousElementSibling.src,
        findRole(chk.parentElement.parentElement.parentElement.previousElementSibling.innerText)));

    // chk.addEventListener('click', (click) => console.log(click));
});

function findRole(name) {
    switch (name) {
        case 'Капитан':
            return role.Commander;
        case 'Борт инженер':
            return role.Engineer;
        case 'Врач':
            return role.Medic;
        case 'Космодесантник':
            return role.Spacetrooper;
        default:
            return null;
    }
}

const capitanHolder = document.querySelector('#capitan-holder');
const engenieerHolder = document.querySelector('#engenieer-holder');
const medicHolder = document.querySelector('#medic-holder');
const spacetrooperHolder = document.querySelector('#spacetrooper-holder');
