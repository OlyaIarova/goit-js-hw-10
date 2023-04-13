import './css/styles.css';
import { fetchCountries } from './fetchCountries';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

//dom посилання, отримання доступу
const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// поле пошуку
searchBox.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

const cleanMarkup = ref => (ref.innerHTML = ''); // очищує вміст HTML-елемента

//запит
function inputHandler(event) {
  event.preventDefault(); // відміна перезавантаження (станд. поведінки браузера)
  const Input = event.target.value.trim();

  if (!Input) {
    [countryList, countryInfo].forEach(cleanMarkup);
    return;
  }

  //оброблення промісу
  fetchCountries(Input)
    .then(data => {
      data.length > 10
        ? Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name'
          )
        : renderMarkup(data);
    })
    .catch(() => {
      [countryList, countryInfo].forEach(cleanMarkup);
      Notiflix.Notify.failure('Oops, there is no country with that name'); // Обробка помилки.
    });
}

// рендерення розмітки
function renderMarkup(data) {
  if (data.length === 1) {
    cleanMarkup(countryList);
    countryInfo.innerHTML = createInfoMarkup(data);
  } else {
    cleanMarkup(countryInfo);
    countryList.innerHTML = createListMarkup(data);
  }
}

//створення розмітка списку
function createListMarkup(data) {
  return data
    .map(
      ({ name, flags }) => `
  <li>
    <img src="${flags.svg}" alt="${name.official}" width="80" height="50">
    ${name.official}
  </li>
`
    )
    .join('');
} //створення інформаційнщї розмітки
function createInfoMarkup(data) {
  return data
    .map(
      ({ name, capital, population, flags, languages }) => `
  <img src="${flags.svg}" alt="${name.official}" width="80" height="50">
  <h2>${name.official}</h2>
  <p>Capital: ${capital}</p>
  <p>Population: ${population}</p>
  <p>Languages: ${Object.values(languages)}</p>`
    )
    .join('');
}



// ! Завдання - пошук країн
// ? 1.Створи фронтенд частину програми пошуку даних про країну за її частковою або повною назвою. Подивися демо-відео роботи програми.
// ? 2.HTTP-запит. Використовуй публічний API Rest Countries v2, а саме ресурс name, який повертає масив об'єктів країн, що задовольнили критерій пошуку. Додай мінімальне оформлення елементів інтерфейсу.
// Напиши функцію fetchCountries(name), яка робить HTTP-запит на ресурс name і повертає проміс з масивом країн - результатом запиту. Винеси її в окремий файл fetchCountries.js і зроби іменований експорт.
// ? 3. Фільтрація полів. У відповіді від бекенду повертаються об'єкти, велика частина властивостей яких, тобі не знадобиться. Щоб скоротити обсяг переданих даних, додай рядок параметрів запиту - таким чином цей бекенд реалізує фільтрацію полів. Ознайомся з документацією синтаксису фільтрів.
// name.official - повна назва країни
// capital - столиця
// population - населення
// flags.svg - посилання на зображення прапора
// languages - масив мов
// ? 4. Поле пошуку. Назву країни для пошуку користувач вводить у текстове поле input#search-box. HTTP-запити виконуються при введенні назви країни, тобто на події input. Але робити запит з кожним натисканням клавіші не можна, оскільки одночасно буде багато запитів і вони будуть виконуватися в непередбачуваному порядку.
// Необхідно застосувати прийом Debounce на обробнику події і робити HTTP-запит через 300мс після того, як користувач перестав вводити текст. Використовуй пакет lodash.debounce.
// Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується, а розмітка списку країн або інформації про країну зникає.
// Виконай санітизацію введеного рядка методом trim(), це вирішить проблему, коли в полі введення тільки пробіли, або вони є на початку і в кінці рядка.
// ? 5. Інтерфейс. Якщо у відповіді бекенд повернув більше ніж 10 країн, в інтерфейсі з'являється повідомлення про те, що назва повинна бути специфічнішою. Для повідомлень використовуй бібліотеку notiflix і виводь такий рядок "Too many matches found. Please enter a more specific name.".
// Якщо бекенд повернув від 2-х до 10-и країн, під тестовим полем відображається список знайдених країн. Кожен елемент списку складається з прапора та назви країни.
// Якщо результат запиту - це масив з однією країною, в інтерфейсі відображається розмітка картки з даними про країну: прапор, назва, столиця, населення і мови.
// Достатньо, щоб застосунок працював для більшості країн. Деякі країни, як-от Sudan, можуть створювати проблеми, оскільки назва країни є частиною назви іншої країни - South Sudan. Не потрібно турбуватися про ці винятки.
// ? 6. Обробка помилки. Якщо користувач ввів назву країни, якої не існує, бекенд поверне не порожній масив, а помилку зі статус кодом 404 - не знайдено. Якщо це не обробити, то користувач ніколи не дізнається про те, що пошук не дав результатів. Додай повідомлення "Oops, there is no country with that name" у разі помилки, використовуючи бібліотеку notiflix.
// Не забувай про те, що fetch не вважає 404 помилкою, тому необхідно явно відхилити проміс, щоб можна було зловити і обробити помилку.
