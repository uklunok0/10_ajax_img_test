document.addEventListener("DOMContentLoaded", () => {
  const requestCounter = document.getElementById("requestCounter");
  const next = document.querySelector(".offer__slider-next > img");

  let offset = 0;

  // Функция для инициализации слайдера
  function initializeSlider() {
    const slidesWrapper = document.querySelector(".offer__slider-wrapper");
    const slidesField = document.querySelector(".offer__slider-inner");
    const slides = document.querySelectorAll(".offer__slide");

    const width = window.getComputedStyle(slidesWrapper).width;

    slidesField.style.width = 100 * slides.length + "%";
    slidesField.style.display = "flex";
    slidesField.style.transition = "transform 2s ease";

    slidesWrapper.style.overflow = "hidden";

    slides.forEach((item) => {
      item.style.width = width; // Ширина слайда соответствует ширине контейнера
    });
  }

  // Загрузка и добавление нового слайда
  async function addNewSlide() {
    try {
      next.classList.add("disabled"); // заблокировать кнопку

      const response = await axios.post("/api/images", { requestCounter: localStorage.getItem("requestCounter") });
      const responseData = response.data;

      // const newSlide = document.createElement("div");
      // newSlide.classList.add("offer__slide");
      // newSlide.innerHTML = `<img id="imageSlider" src="${responseData.imgUrl}" alt="Image will appear here" />`;
      // document.querySelector(".offer__slider-inner").appendChild(newSlide);

      function btnBlocked() {
        // пока изображение не загрузится - блокировать кнопку
        return new Promise((resolve, reject) => {
          const imgUrl = responseData.imgUrl;
          // Создаем новое изображение и ждем, пока оно полностью загрузится
          const img = new Image();
          img.src = imgUrl;

          img.onload = () => {
            // Когда изображение загружено, добавляем его в слайд
            const newSlide = document.createElement("div");
            newSlide.classList.add("offer__slide");
            newSlide.appendChild(img);
            document.querySelector(".offer__slider-inner").appendChild(newSlide);

            // Обновление счётчика
            requestCounter.innerText = `Request counter: ${responseData.requestCounter - 1}`;
            localStorage.setItem("requestCounter", responseData.requestCounter);

            // Реинициализация слайдера после добавления нового слайда
            initializeSlider();

            // Перемещение к новому слайду
            moveSlider();

            resolve();
          };
          img.onerror = () => {
            console.error("Error loading image");
          };
        });
      }
      btnBlocked().then(() => {
        next.classList.remove("disabled"); // разблокировать кнопку
      });
    } catch (error) {
      console.error("Error fetching image", error);
    }
  }

  // Перемещение слайдера
  function moveSlider() {
    const slidesWrapper = document.querySelector(".offer__slider-wrapper");
    const slidesField = document.querySelector(".offer__slider-inner");
    const slides = document.querySelectorAll(".offer__slide");
    const width = parseInt(window.getComputedStyle(slidesWrapper).width, 10);

    if (offset === width * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += width;
    }

    slidesField.style.transform = `translateX(-${offset}px)`;
  }

  function ListenerMethods() {
    // Адаптивная логика на ресайз окна
    this.resizeSlider = () => {
      window.addEventListener("resize", () => {
        offset = 0; // Сбрасываем offset при ресайзе
        initializeSlider(); // Реинициализируем слайдер
      });
    };
    // Обнуление requestCounter при обновлении страницы
    this.resetLocalStorage = () => {
      window.addEventListener("beforeunload", () => {
        localStorage.setItem("requestCounter", 1);
      });
    };
    // Обработчик клика на кнопку "Next"
    this.nextSlideShow = () => {
      next.addEventListener("click", async () => {
        await addNewSlide(); // Ждём загрузку слайда
      });
    };
  }

  const listeners = new ListenerMethods();

  listeners.resizeSlider();
  listeners.resetLocalStorage();
  listeners.nextSlideShow();

  // Обработчик клика на кнопку "Next"
  // next.addEventListener("click", async () => {
  //   await addNewSlide(); // Ждём загрузку слайда
  // });

  // Адаптивная логика на ресайз окна
  // window.addEventListener("resize", () => {
  //   offset = 0; // Сбрасываем offset при ресайзе
  //   initializeSlider(); // Реинициализируем слайдер
  // });

  // Обнуление requestCounter при обновлении страницы
  // window.addEventListener("beforeunload", () => {
  //   localStorage.setItem("requestCounter", 1);
  // });
});
