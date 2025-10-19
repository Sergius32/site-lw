document.addEventListener('DOMContentLoaded', async () => {
  // Получаем базовый путь из глобальной переменной
  const BASE_PATH = window.BASE_PATH || '';

  // Функция "разглаживания" объекта
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

  let currentLang = localStorage.getItem('lang') || 'ru';

  const langToggle = document.getElementById('lang-toggle');
  const langToggleMobile = document.getElementById('lang-toggle-mobile');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  // Загрузка переводов с учётом BASE_PATH
  async function loadTranslations(lang) {
    try {
      const url = `${BASE_PATH}locales/${lang}.json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const nested = await response.json();
      return flattenObject(nested);
    } catch (err) {
      console.error(`Failed to load translations for "${lang}":`, err);
      return {};
    }
  }

  function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && translations.hasOwnProperty(key)) {
        el.textContent = translations[key];
      }
    });
  }

  async function toggleLanguage() {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('lang', currentLang);
    const translations = await loadTranslations(currentLang);
    applyTranslations(translations);
  }

  // Инициализация
  const translations = await loadTranslations(currentLang);
  applyTranslations(translations);

  // Обработчики
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

  // Мобильное меню (без изменений)
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

  // Закрытие при ресайзе
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu) {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Закрытие мобильного меню при клике по якорной ссылке
  document.querySelectorAll('.mobile-menu a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
});