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
      280: {
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








function dashboardFilters() {
  const container = document.querySelector('.dashboard__filters');

  if (!container) {
    return null
  }

  let dataFilterContainers = document.querySelectorAll('[data-filter-container]');

  dataFilterContainers.forEach(dataFilterContainer => {
    const btn = dataFilterContainer.querySelector('[data-filter-btn]');

    btn.addEventListener('click', () => {
      dataFilterContainer.classList.toggle('active')
    })
  });


  //for mobile filters

  const mobileFilters = document.querySelector('[data-mobile-filters]');
  const mobileFiltersClose = document.querySelector('[data-mobile-filters-close]');

  mobileFilters.addEventListener('click', () => {
    container.classList.add('active')
  })

  mobileFiltersClose.addEventListener('click', () => {
    container.classList.remove('active')
  })
}

dashboardFilters();



function passwordSee() {
  const passwordGroups = document.querySelectorAll('.input__group input[type="password"]');

  passwordGroups.forEach(passwordGroup => {
    const passwordInput = passwordGroup;
    const eyeButton = passwordGroup.parentNode.querySelector('.form-eye');

    // Check if the elements exist before further manipulation
    if (passwordInput && eyeButton) {
      const eyeImage = eyeButton.querySelector('img');

      eyeButton.addEventListener('click', function () {
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          eyeImage.src = './img/eye-open.svg';
        } else {
          passwordInput.type = 'password';
          eyeImage.src = './img/eye-close.svg';
        }
      });
    }
  });
}

passwordSee();










function tabs(headerSelector, tabSelector, contentSelector, activeClass, display = 'flex') {

  const container = document.querySelector('.tabs');

  if (!container) {
    return null
  }

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








const getTemplate = (data = [], placeholder, selectedId) => {
  let text = placeholder ?? 'placeholder не указан'

  const items = data.map(item => {
    let cls = ''
    if (item.id === selectedId) {
      text = item.value
      cls = 'selected'
    }
    return `
          <li class="select__item ${cls}" data-type="item" data-id="${item.id}">${item.value}</li>
      `
  })
  return `
      <input type="hidden" class="hidden__input">
      <div class="select__backdrop" data-type="backdrop"></div>
      <div class="select__input" data-type="input">
          <span data-type="value">${text}</span>
          <img src="./img/icons/arrow-down.svg" alt="arrow" data-type="arrow" class="select__arrow">
      </div>
      <div class="select__dropdown">
          <ul class="select__list">
              ${items.join('')}
          </ul>
      </div>
  `
}
class Select {
  constructor(selector, options) {
    this.$el = document.querySelector(selector)
    this.options = options
    this.selectedId = options.selectedId

    this.render()
    this.setup()
  }

  render() {
    const { placeholder, data } = this.options
    this.$el.classList.add('select')
    this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId)
  }
  setup() {
    this.clickHandler = this.clickHandler.bind(this)
    this.$el.addEventListener('click', this.clickHandler)
    this.$arrow = this.$el.querySelector('[data-type="arrow"]')
    this.$value = this.$el.querySelector('[data-type="value"]')
  }

  clickHandler(event) {
    const { type } = event.target.dataset
    if (type === 'input') {
      this.toggle()
    } else if (type === 'item') {
      const id = event.target.dataset.id
      this.select(id)
    } else if (type === 'backdrop') {
      this.close()
    }
  }

  get isOpen() {
    return this.$el.classList.contains('open')
  }

  get current() {
    return this.options.data.find(item => item.id === this.selectedId)
  }

  select(id) {
    this.selectedId = id
    this.$value.textContent = this.current.value

    this.$el.querySelectorAll(`[data-type="item"]`).forEach(el => el.classList.remove('selected'))
    this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected')

    this.options.onSelect ? this.options.onSelect(this.current) : null
    this.close()
  }

  toggle() {
    this.isOpen ? this.close() : this.open()
  }

  open() {
    this.$el.classList.add('open')
    this.$arrow.classList.add('open')
  }

  close() {
    this.$el.classList.remove('open')
    this.$arrow.classList.remove('open')
  }

  destroy() {
    this.$el.removeEventListener('click', this.clickHandler)
    this.$el.innerHTML = ''
  }
}


// Инициализация плагина
const select1 = new Select('#overview-select1', {
  placeholder: 'Выберите элемент',
  selectedId: '1',
  data: [
    { id: '1', value: 'Элемент списка 1' },
    { id: '2', value: 'Элемент списка 2' },
    { id: '3', value: 'Элемент списка 3' },
    { id: '4', value: 'Элемент списка 4' },
    { id: '5', value: 'Элемент списка 5' },
  ],
  onSelect(item) {
    const input = document.querySelector('.hidden__input')
    input.value = item.value
  }
})

// Инициализация плагина
const select2 = new Select('#overview-select2', {
  placeholder: 'Выберите элемент',
  selectedId: '1',
  data: [
    { id: '1', value: 'Элемент списка 1' },
    { id: '2', value: 'Элемент списка 2' },
    { id: '3', value: 'Элемент списка 3' },
    { id: '4', value: 'Элемент списка 4' },
    { id: '5', value: 'Элемент списка 5' },
  ],
  onSelect(item) {
    const input = document.querySelector('.hidden__input')
    input.value = item.value
  }
})

// Инициализация плагина
const select3 = new Select('#overview-select3', {
  placeholder: 'Выберите элемент',
  selectedId: '1',
  data: [
    { id: '1', value: 'Элемент списка 1' },
    { id: '2', value: 'Элемент списка 2' },
    { id: '3', value: 'Элемент списка 3' },
    { id: '4', value: 'Элемент списка 4' },
    { id: '5', value: 'Элемент списка 5' },
  ],
  onSelect(item) {
    const input = document.querySelector('.hidden__input')
    input.value = item.value
  }
})

// Инициализация плагина
const select4 = new Select('#overview-select4', {
  placeholder: 'Выберите элемент',
  selectedId: '1',
  data: [
    { id: '1', value: 'Элемент списка 1' },
    { id: '2', value: 'Элемент списка 2' },
    { id: '3', value: 'Элемент списка 3' },
    { id: '4', value: 'Элемент списка 4' },
    { id: '5', value: 'Элемент списка 5' },
  ],
  onSelect(item) {
    const input = document.querySelector('.hidden__input')
    input.value = item.value
  }
})




























