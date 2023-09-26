// Custom scripts
// Мобильное меню бургер
function burgerMenu() {
  const burger = document.querySelector('.burger')
  const menu = document.querySelector('.menu')
  const body = document.querySelector('body')
  burger.addEventListener('click', () => {
    if (!menu.classList.contains('active')) {
      menu.classList.add('active')
      burger.classList.add('active-burger')
      body.classList.add('locked')
    } else {
      menu.classList.remove('active')
      burger.classList.remove('active-burger')
      body.classList.remove('locked')
    }
  })
  //снять классы при клике на элементы меню
  const menuItems = document.querySelectorAll('.menu__item')

  menuItems.forEach(item => {
    item.addEventListener('click', function () {
      menu.classList.remove('active')
      burger.classList.remove('active-burger')
      body.classList.remove('locked')
    })
  });

  // Вот тут мы ставим брейкпоинт навбара
  window.addEventListener('resize', () => {
    if (window.innerWidth > 991.98) {
      menu.classList.remove('active')
      burger.classList.remove('active-burger')
      body.classList.remove('locked')
    }
  })
}
burgerMenu()


// Вызываем эту функцию, если нам нужно зафиксировать меню при скролле.
function fixedNav() {
  const nav = document.querySelector('nav')

  // тут указываем в пикселях, сколько нужно проскроллить что бы наше меню стало фиксированным
  const breakpoint = 1
  if (window.scrollY >= breakpoint) {
    nav.classList.add('fixed__nav')
  } else {
    nav.classList.remove('fixed__nav')
  }
}
window.addEventListener('scroll', fixedNav)















function aboutSlider() {
  const container = document.querySelector('.about');

  if (!container) {
    return null
  }

  var swiper = new Swiper(".about__partners-slider", {
    spaceBetween: 24,
    slidesPerView: 4,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".about__partners-arrow--next",
      prevEl: ".about__partners-arrow--prev",
    },

    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 12,
        slidesPerView: 2,
      },
      // when window width is >= 480px
      767: {
        spaceBetween: 16,
        slidesPerView: 3,
      },
      // when window width is >= 640px
      992: {
        spaceBetween: 24,
        slidesPerView: 4,
      }
    }
  });

}

aboutSlider();
















function restaurantPicturesSlider() {
  const container = document.querySelector('.restaurant');

  if (!container) {
    return null
  }

  var swiper = new Swiper(".restaurant__slider ", {
    spaceBetween: 6,
    slidesPerView: 1,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".restaurant__slider-arrow-next",
      prevEl: ".restaurant__slider-arrow-prev",
    },
    pagination: {
      el: ".restaurant__slider-paginations",
    },
  });

}

restaurantPicturesSlider();









const filterInputs = document.querySelectorAll('[data-search-input]');
const filterContainers = document.querySelectorAll('[ data-search-wrapper]');

filterInputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    if (input.value.trim() !== '') {
      filterContainers[index].classList.add('open-list');
    } else {
      filterContainers[index].classList.remove('open-list');
    }
  });
});

document.addEventListener('click', (event) => {
  filterContainers.forEach(container => {
    if (!container.contains(event.target)) {
      container.classList.remove('open-list');
      const input = container.querySelector('[data-search-input]');
      if (input) {
        input.value = ''; // Clear the input field
      }
    }
  });
});














function tabs(headerSelector, tabSelector, contentSelector, activeClass, display = 'flex') {
  const header = document.querySelector(headerSelector),
    tab = document.querySelectorAll(tabSelector),
    content = document.querySelectorAll(contentSelector)
  function hideTabContent() {
    content.forEach(item => {
      item.style.display = 'none'
    });
    tab.forEach(item => {
      item.classList.remove(activeClass)
    });
  }
  function showTabContent(i = 0) {
    content[i].style.display = display
    tab[i].classList.add(activeClass)
  }
  hideTabContent()
  showTabContent()
  header.addEventListener('click', e => {
    const target = e.target
    if (target.classList.contains(tabSelector.replace(/\./, '')) ||
      target.parentNode.classList.contains(tabSelector.replace(/\./, ''))) {
      tab.forEach((item, i) => {
        if (target == item || target.parentNode == item) {
          hideTabContent()
          showTabContent(i)
        }
      });
    }
  })
}

// ПЕРВЫЙ аргумент - класс всего нашего хедера табов.
// ВТОРОЙ аргумент - класс конкретного элемента, при клике на который будет переключатся таб.
// ТРЕТИЙ аргумент - класс того блока, который будет переключаться.
// ЧЕТВЕРТЫЙ аргумент - класс активности, который будет добавлятся для таба, который сейчас активен.
tabs('.tabs__header', '.tabs__header-item', '.tabs__content-item', 'active')











const openModalBtns = document.querySelectorAll('.open-modal-btn');
const closeModalBtns = document.querySelectorAll('.close-modal-btn');
const modals = document.querySelectorAll('.modal');

openModalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.dataset.modalId;
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
  });
});

closeModalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal');
    modal.classList.remove('show');
  });
});

window.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('show');
  }
});
