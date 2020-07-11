let currentIndex = 0;
let menus = [];
const options = document.querySelectorAll('.option');

const optionImages = [];
options.forEach(option => optionImages.push(option.querySelector('img')));

const cardBody = document.querySelector('.card__body');

function showMenu(id) {
    cardBody.innerHTML = '';
    cardBody.innerHTML = menus[id];
    currentIndex = id;
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
    optionImages.forEach(
        (img, index) => {
            if (id !== index) {
                img.classList.add('transparent');
            } else {
                img.classList.remove('transparent');
            }
        });
}

function start() {
    for (let i = 0; i < cardBody.children.length; i++) {
        menus.push(cardBody.children[i].innerHTML);
    }

    showMenu(0);
    assignClicks();
    setOpacity(0);
}

start();
