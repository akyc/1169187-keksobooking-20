'use strict';

// Переменные HTML страницы
// Область карты
var map = document.querySelector('.map');
// Область для меток объявлений
var mapPins = map.querySelector('.map__pins');
// Образец метки объявления
var pinMain = document.querySelector('.map__pin--main');

// Переменные Template
// Шамблон метки на карте
var templatePin = document.querySelector('#pin').content;
// Элемент метки
var elementPin = templatePin.querySelector('button');
// Шаблон карточки объявления
var templateCard = document.querySelector('#card').content;

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
  var rezult = [];
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
    rezult.push(newPin);
  }
  return rezult;
}

// Массив сгенерированных объектов
var pinsList = createPinsList(8);

// Убираем класс по ТЗ
map.classList.remove('map--faded');

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

renderPinsList(pinsList);

//
function declination(number, words) {
  var n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return words[3];
  }
  n %= 10;
  if (n === 1) {
    return words[1];
  }
  if (n >= 2 && n <= 4) {
    return words[2];
  }
  return words[3];
}

// Создает карточки объявлений из сгенерированного массива
function createCards(ad) {
  var card = templateCard.querySelector('article');
  var newCard = card.cloneNode(true);
  newCard.querySelector('.popup__title').textContent = ad.offer.title;
  newCard.querySelector('.popup__text--address').textContent = ad.offer.address;
  newCard.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  var rusOfferTypes = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  newCard.querySelector('.popup__type').textContent = rusOfferTypes[ad.offer.type];
  var rusRoomsDeclination = declination(ad.offer.rooms, ['комната', 'комнаты', 'комнат']);
  var rusGuestsDeclination = declination(ad.offer.guests, ['гость', 'гостя', 'гостей']);
  newCard.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' ' + rusRoomsDeclination + ' для ' + ad.offer.guests + ' ' + rusGuestsDeclination;
  newCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  newCard.querySelector('.popup__features').textContent = ad.offer.features.join(', ');
  newCard.querySelector('.popup__description').textContent = ad.offer.description;

// В блок .popup__description выведите описание объекта недвижимости offer.description.
// В блок .popup__photos выведите все фотографии из списка offer.photos. Каждая из строк массива photos должна записываться как src соответствующего изображения.
// Замените src у аватарки пользователя — изображения, которое записано в .popup__avatar — на значения поля author.avatar отрисовываемого объекта.
}

createCards(pinsList[0]);
console.log('pinsList[0]: ', pinsList[0]);
