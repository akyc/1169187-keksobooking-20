'use strict';

// Переменные HTML страницы
// Область карты
var map = document.querySelector('.map');
// Область для меток объявлений
var mapPins = map.querySelector('.map__pins');
// Образец главной метки объявления
var pinMain = document.querySelector('.map__pin--main');
// Ширина главной метки
var PIN_MAIN_WIDTH = pinMain.offsetWidth;
// Высота главной метки
var PIN_MAIN_HEIGHT = pinMain.offsetHeight;

// Переменные фильтров меток на карте
// Контейнер фильтров
var mapFilters = document.querySelector('.map__filters');

// Переменные формы "Ваше объявление"
// Форма
var adForm = document.querySelector('.ad-form');
// Поле адрсес
var address = adForm.querySelector('#address');

// Переменные Template
// Шамблон метки на карте
var templatePin = document.querySelector('#pin').content;
// Элемент метки
var elementPin = templatePin.querySelector('button');

// Переменные для генерации объекта
// Массив типов помещений
var typesList = ['palace', 'flat', 'house', 'bungalo'];
// Массив времени выезда/заезда
var checkList = ['12:00', '13:00', '14:00,'];
// Массив особенностей
var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
// Массив фотографий помещения
var photosList = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
// Интервал значений координат маркета по горизонтали
var xLimits = {min: pinMain.offsetWidth / 2, max: map.offsetWidth - pinMain.offsetWidth / 2};
// Интервал значений координат маркета по вертикали
var yLimits = {min: 130, max: 600};

// Добавляет или убирает атрибут disabled элементам формы по флагу
// @param {object} parent форма
// @param {boolean} disabled флаг
function toggleAblingForm(parent, disabled) {
  var elements = parent.querySelectorAll('button, fieldset, select, textarea, input');
  elements.forEach(function (element) {
    element.disabled = false;
    if (disabled) {
      element.disabled = true;
    }
  });
}
toggleAblingForm(mapFilters, true);
toggleAblingForm(adForm, true);

// Возвращает случайный элемент массива / массив случайных членов исходного
// @param {array} arr исходный массив
// @param {int} count число итераций в новом массиве
// @return {string/array}
function randomItem(arr, count) {
  var randIndex;
  if (count) {
    var rezult = [];
    for (var i = 0; i < count; i++) {
      randIndex = randomItem(arr);
      if (rezult.indexOf(randIndex) === -1) {
        rezult.push(randIndex);
      }
    }
    return rezult;
  }
  randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
}

// Возвращает случайнное целое число из возможного диапозона
// @param {object{min,max}} limits объект с концами интервала
// @return {int}
function randomIntegers(limits) {
  return Math.floor(limits.min + Math.random() * (limits.max - limits.min));
}

// Возвращает массив сгенерированных объектов
// @param {int} count число генерируемых объектор
// @return {array}
function createPinsList(count) {
  var result = [];
  for (var i = 1; i <= count; i++) {
    var newPin = {
      author: {
        avatar: 'img/avatars/user0' + i + '.png'
      },
      location: {
        x: randomIntegers(xLimits),
        y: randomIntegers(yLimits),
      },
      offer: {
        title: 'Заголовок ' + i,
        address: randomIntegers(xLimits) + ',' + randomIntegers(yLimits),
        price: Math.floor(Math.random() * 10000),
        type: randomItem(typesList),
        rooms: Math.floor(Math.random() * 4),
        guests: Math.floor(Math.random() * 5),
        checkin: randomItem(checkList),
        checkout: randomItem(checkList),
        features: randomItem(featuresList, 4),
        description: 'Описание ' + i,
        photos: randomItem(photosList),
      }
    };
    result.push(newPin);
  }
  return result;
}

// Добавляет в DOM элементы меток на основе массива сгенерированных объектов
// @param {array} arr массив объектов
function renderPinsList(arr) {
  for (var i = 0; i < arr.length; i++) {
    var newElement = elementPin.cloneNode(true);
    var image = newElement.querySelector('img');
    newElement.style.left = arr[i].location.x - (newElement.offsetWidth / 2) + 'px';
    newElement.style.top = arr[i].location.y - newElement.offsetHeight + 'px';
    image.src = arr[i].author.avatar;
    image.alt = arr[i].offer.title;
    mapPins.appendChild(newElement);
  }
}

// Массив событий и условий для активации страницы
var activeConditions = [
  {
    action: 'mousedown',
    condition: 0,
  },
  {
    action: 'keydown',
    condition: 'Enter',
  },
];

// Добавляет слушатели событий по условиям активации
activeConditions.forEach(function (item) {
  pinMain.addEventListener(item.action, function (evt) {
    if (evt.button === item.condition || evt.key === item.condition) {
      activatePage();
      writeCoords(pinMain);
      toggleAblingForm(mapFilters, false);
      toggleAblingForm(adForm, false);
    }
  });
});

// Редактирует списов классов элементов страницы для ее активации, генерация и отрисовка случайных точек
function activatePage() {
  if (map.classList.contains('map--faded')) {
    map.classList.remove('map--faded');
    var pinsList = createPinsList(8);
    renderPinsList(pinsList);
  }
  adForm.classList.remove('ad-form--disabled');
}

// Возвращает координаты указанной метки
// @param {var} target метка
// @return {object}
function getCoords(target) {
  var result = {};
  var coordX = Math.floor(target.offsetLeft + PIN_MAIN_WIDTH / 2);
  var coordY = Math.floor(target.offsetTop + PIN_MAIN_HEIGHT);
  if (map.classList.contains('map--faded')) {
    coordY = Math.floor(target.offsetTop + PIN_MAIN_HEIGHT / 2);
  }
  result.x = coordX;
  result.y = coordY;
  return result;
}

// Записывает кооринаты метки в поле адрес
// @param {var} target метка
function writeCoords(target) {
  var coords = getCoords(target);
  address.value = coords.x + ',' + coords.y;
}

writeCoords(pinMain);
