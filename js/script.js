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
      // Возвращаем как вложенный объект, так и плоский
      return {
        nested: nestedTranslations,
        flat: flattenObject(nestedTranslations)
      };
    } catch (err) {
      console.error(`Failed to load translations for language "${lang}":`, err);
      return { nested: {}, flat: {} };
    }
  }

  // Применение переводов ко всем элементам с data-i18n и data-i18n-href-key
  function applyTranslations(translations) {
    const { flat: flatTranslations, nested: nestedTranslations } = translations;

    // Применение текста
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && flatTranslations.hasOwnProperty(key)) {
        el.textContent = flatTranslations[key];
      }
    });

    // Применение href
    document.querySelectorAll('[data-i18n-href-key]').forEach(el => {
      const hrefKey = el.getAttribute('data-i18n-href-key');
      if (hrefKey && flatTranslations.hasOwnProperty(hrefKey)) {
        el.href = flatTranslations[hrefKey];
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

  // ============ АВТОМАТИЧЕСКОЕ ВСПЛЫВАЮЩЕЕ ОКНО TELEGRAM ============
  const TELEGRAM_DELAY = 8000; // Задержка в миллисекундах (3 секунды для отладки)
  const TELEGRAM_URL = 'https://t.https://t.me/legend_world_l2'; // Замените на вашу ссылку
  const DEBUG_MODE = true; // Установите false для продакшена

  // Проверяем, показывали ли уже окно в этой сессии
  const telegramShown = sessionStorage.getItem('telegramPopupShown');

  // В режиме отладки показываем всегда, иначе только один раз
  if (DEBUG_MODE || !telegramShown) {
    setTimeout(() => {
      const modal = document.getElementById('modal-telegram-auto');
      if (modal) {
        modal.style.display = 'block';
        if (!DEBUG_MODE) {
          sessionStorage.setItem('telegramPopupShown', 'true');
        }
      }
    }, TELEGRAM_DELAY);
  }
});

// Открытие модалок
document.querySelector('.footer__buttons-container a:nth-child(1)').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('modal-launcher').style.display = 'block';
});

document.querySelector('.footer__buttons-container a:nth-child(2)').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('modal-patch').style.display = 'block';
});

// У кнопки "Клиент" уже есть href — заменим поведение
document.querySelector('.footer__buttons-container a:nth-child(3)').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('modal-client').style.display = 'block';
});

// Закрытие по крестику
document.querySelectorAll('.modal__close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').style.display = 'none';
  });
});

// Закрытие по клику на затемнение
document.querySelectorAll('.modal__overlay').forEach(overlay => {
  overlay.addEventListener('click', () => {
    overlay.closest('.modal').style.display = 'none';
  });
});
// Обратный отсчёт до старта с поддержкой переводов
function initCountdown() {
  // Дата запуска: 12.12.2025 20:00 UTC+3
  const launchDate = new Date('2025-12-12T17:00:00Z'); // 20:00 UTC+3 = 17:00 UTC
  
  const onlineContainer = document.querySelector('.header__online');

  // Функция для получения текущего языка
  function getCurrentLang() {
    return localStorage.getItem('lang') || 'ru';
  }

  // Переводы для времени
  const timeTranslations = {
    ru: {
      beforeStart: 'До старта:',
      online: 'Online',
      days: 'д',
      hours: 'ч',
      minutes: 'м',
      seconds: 'с'
    },
    en: {
      beforeStart: 'Starts in:',
      online: 'Online',
      days: 'd',
      hours: 'h',
      minutes: 'm',
      seconds: 's'
    }
  };

  function updateCountdown() {
    const now = new Date();
    const difference = launchDate - now;
    const lang = getCurrentLang();
    const t = timeTranslations[lang] || timeTranslations.ru;

    // Если время пришло - показываем Online
    if (difference <= 0) {
      onlineContainer.innerHTML = `
        <div class="header__online-icon online"></div>
        <div class="header__online-text inter">
          <span style="color:rgba(87, 215, 80, 1);" data-i18n="countdown.online">${t.online}</span>
        </div>
        <div class="header__online-text inter">
          <span style="color:rgba(87, 215, 80, 1);">365</span>
        </div>
      `;
      clearInterval(countdownInterval);
      return;
    }

    // Вычисляем дни, часы, минуты, секунды
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Форматируем текст с учётом языка
    let countdownText = '';
    if (days > 0) {
      countdownText = `${days}${t.days} ${hours}${t.hours} ${minutes}${t.minutes} ${seconds}${t.seconds}`;
    } else if (hours > 0) {
      countdownText = `${hours}${t.hours} ${minutes}${t.minutes} ${seconds}${t.seconds}`;
    } else if (minutes > 0) {
      countdownText = `${minutes}${t.minutes} ${seconds}${t.seconds}`;
    } else {
      countdownText = `${seconds}${t.seconds}`;
    }

    // Обновляем HTML для обратного отсчёта в колонку
    onlineContainer.innerHTML = `
      <div class="header__online-column">
        <div class="header__online-text gabriela-regular">
          <span style="color: rgba(244, 177, 74, 1);" data-i18n="countdown.beforeStart">${t.beforeStart}</span>
        </div>
        <div class="header__online-text inter">
          <span style="color:rgba(87, 215, 80, 1);">${countdownText}</span>
        </div>
      </div>
    `;
  }

  // Запускаем обновление каждую секунду
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);

  // Слушаем изменение языка
  window.addEventListener('storage', (e) => {
    if (e.key === 'lang') {
      updateCountdown();
    }
  });

  // Также слушаем клики по кнопкам переключения языка
  const langToggle = document.getElementById('lang-toggle');
  const langToggleMobile = document.getElementById('lang-toggle-mobile');

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      setTimeout(updateCountdown, 100);
    });
  }

  if (langToggleMobile) {
    langToggleMobile.addEventListener('click', () => {
      setTimeout(updateCountdown, 100);
    });
  }
}

// Запускаем после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCountdown);
} else {
  initCountdown();
}