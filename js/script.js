document.addEventListener('DOMContentLoaded', async () => {
  // Вспомогательная функция: преобразует вложенный объект в плоский с ключами через точку
  function flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, key) => {
      const pre = prefix.length ? prefix + '.' : '';
      const value = obj[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(acc, flattenObject(value, pre + key));
      } else {
        acc[pre + key] = value;
      }
      return acc;
    }, {});
  }

  // Текущий язык
  let currentLang = localStorage.getItem('lang') || 'ru';

  // Элементы
  const langToggle = document.getElementById('lang-toggle');
  const langToggleMobile = document.getElementById('lang-toggle-mobile');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  // Загрузка переводов
  async function loadTranslations(lang) {
    try {
      const templatePath = window.templatePath || '';
      const url = `${templatePath}/locales/${lang}.json`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const nestedTranslations = await response.json();
      return flattenObject(nestedTranslations);
    } catch (err) {
      console.error(`Failed to load translations for language "${lang}":`, err);
      return {};
    }
  }

  // Применение переводов ко всем элементам с data-i18n
  function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && translations.hasOwnProperty(key)) {
        el.textContent = translations[key];
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

  // Инициализация: загружаем и применяем перевод
  const translations = await loadTranslations(currentLang);
  applyTranslations(translations);

  // Обработчики переключения языка
  if (langToggle) {
    langToggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggleLanguage();
    });
  }

  if (langToggleMobile) {
    langToggleMobile.addEventListener('click', (e) => {
      e.preventDefault();
      toggleLanguage();
    });
  }

  // Мобильное меню
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Закрытие мобильного меню при изменении размера (на десктопе)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu) {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});