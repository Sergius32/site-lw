// Текущий язык по умолчанию
let currentLang = localStorage.getItem('lang') || 'ru';

// Элемент переключателя языка
const langToggle = document.getElementById('lang-toggle');

// Загружаем переводы
async function loadTranslations(lang) {
  const response = await fetch(`locales/${lang}.json`);
  if (!response.ok) {
    console.error(`Не удалось загрузить перевод для языка: ${lang}`);
    return {};
  }
  return await response.json();
}

// Применяем переводы к элементам с атрибутом data-i18n
function applyTranslations(translations) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      if (el.tagName === 'TITLE') {
        document.title = translations[key];
      } else {
        el.textContent = translations[key];
      }
    }
  });
}

// Переключение языка
async function toggleLanguage() {
  currentLang = currentLang === 'ru' ? 'en' : 'ru';
  localStorage.setItem('lang', currentLang);
  const translations = await loadTranslations(currentLang);
  applyTranslations(translations);
}

// Инициализация
(async () => {
  const translations = await loadTranslations(currentLang);
  applyTranslations(translations);
})();

// Обработчик клика
langToggle.addEventListener('click', (e) => {
  e.preventDefault();
  toggleLanguage();
});