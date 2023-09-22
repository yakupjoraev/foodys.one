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