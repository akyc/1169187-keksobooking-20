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
var checkList = ['12:00', '13:00', '14:00'];
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
        rooms: randomIntegers({min: 1, max: 6}),
        guests: randomIntegers({min: 1, max: 8}),
        checkin: randomItem(checkList),
        checkout: randomItem(checkList),
        features: randomItem(featuresList, 4),
        description: 'Описание ' + i,
        photos: randomItem(photosList, 4),
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

// Создает карточки объявлений из сгенерированного массива по шаблону
// @param {object} ad объявление
function createCards(ad) {
  var card = templateCard.querySelector('article');
  var newCard = card.cloneNode(true);

  addTextContent(newCard, '.popup__title', ad.offer.title);
  addTextContent(newCard, '.popup__text--address', ad.offer.address);
  addTextContent(newCard, '.popup__text--price', ad.offer.price);
  addTextContent(newCard, '.popup__type', ad.offer.type);
  addTextContentCapacity(newCard, '.popup__text--capacity', ad.offer.rooms, ad.offer.guests);
  newCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  addPopupFeatures(newCard, ad.offer.features);
  addTextContent(newCard, '.popup__description', ad.offer.description);
  addPopupPhoto(newCard, ad.offer.photos);
  newCard.querySelector('.popup__avatar').src = ad.author.avatar;
  map.querySelector('.map__filters-container').before(newCard);
}

// Создает текстовое содержимое по селектору
// @param {Node} target клонированный родитель
// @param {string} selector селектор для поиска в клоне
// @param {string} info свойство из объявления
function addTextContent(target, selector, info) {
  target.querySelector(selector).textContent = info || '';
  if (selector === '.popup__text--price') {
    target.querySelector(selector).textContent = info + '₽/ночь' || '';
  }
  if (selector === '.popup__type') {
    var rusOfferTypes = {
      flat: 'Квартира',
      bungalo: 'Бунгало',
      house: 'Дом',
      palace: 'Дворец'
    };
    target.querySelector(selector).textContent = rusOfferTypes[info] || '';
  }
}

// Возвращает правильное склонение существительного к заданному числительному
// @param {int} number числительное
// @param {array} words варианты склонений
// @return {string}
function declination(number, words) {
  var n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return words[2];
  }
  n %= 10;
  if (n === 1) {
    return words[0];
  }
  if (n >= 2 && n <= 4) {
    return words[1];
  }
  return words[2];
}

// Создает текстовое содержимое
// @param {Node} target клонированный родитель
// @param {string} selector селектор для поиска в клоне
// @param {string} rooms свойство из объявления
// @param {string} guests свойство из объявления
function addTextContentCapacity(target, selector, rooms, guests) {
  var rusRoomsDeclination = declination(rooms, ['комната', 'комнаты', 'комнат']);
  var rusGuestsDeclination = declination(guests, ['гостя', 'гостей', 'гостей']);
  target.querySelector(selector).textContent = rooms + ' ' + rusRoomsDeclination + ' для ' + guests + ' ' + rusGuestsDeclination || '';
}

// Создает список по шаблону из массива
// @param {Node} target клонированный родитель
// @param {array} features массив из свойства объявления
function addPopupFeatures(target, features) {
  var popupFeatures = target.querySelector('.popup__features');
  popupFeatures.innerHTML = '';
  features.forEach(function (feature) {
    var featureClass = 'popup__feature popup__feature--' + feature;
    var newFeature = document.createElement('li');
    newFeature.className = featureClass;
    popupFeatures.append(newFeature);
  });
}

// Добавляет фотографии в карточку объявления
// @param {Node} target клонированный родитель
// @param {array} photos массив из свойства объявления
function addPopupPhoto(target, photos) {
  var imageTemplate = target.querySelector('.popup__photo');
  photos.forEach(function (item) {
    var newImage = imageTemplate.cloneNode(true);
    newImage.src = item;
    var popupPhotos = target.querySelector('.popup__photos');
    popupPhotos.append(newImage);
  });
  imageTemplate.remove();
}
createCards(pinsList[0]);
