document.addEventListener("DOMContentLoaded", () => {
  class SlideShow {
    constructor(requestCounterSelector, nextSlideSelector, slidesWrapperSelector, slidesFieldSelector, slidesSelector) {
      this.requestCounter = document.getElementById(requestCounterSelector);
      this.nextSlide = document.querySelector(nextSlideSelector);
      this.slidesWrapper = document.querySelector(slidesWrapperSelector);
      this.slidesField = document.querySelector(slidesFieldSelector);
      this.slides = document.querySelectorAll(slidesSelector);
      this.offset = 0;

      // // Вызываем методы для привязки событий
      // this.initializeListeners();
    }

    initializeSlider() {
      const width = window.getComputedStyle(this.slidesWrapper).width;

      this.slidesField.style.width = 100 * this.slides.length + "%";
      this.slidesField.style.display = "flex";
      this.slidesField.style.transition = "transform 2s ease";
      this.slidesWrapper.style.overflow = "hidden";

      this.slides.forEach((item) => {
        item.style.width = width; // Ширина слайда соответствует ширине контейнера
      });
    }

    moveSlider() {
      const width = parseInt(window.getComputedStyle(this.slidesWrapper).width, 10);

      // Проверяем значение offset
      if (this.offset >= width * (this.slides.length - 1)) {
        this.offset = 0;
      } else {
        this.offset += width;
      }

      // Применяем стиль трансформации с обновленным значением offset
      this.slidesField.style.transform = `translateX(-${this.offset}px)`;
    }

    async addNewSlide() {
      try {
        this.nextSlide.classList.add("disabled"); // заблокировать кнопку

        const response = await axios.post("/api/images", { requestCounter: localStorage.getItem("requestCounter") });
        const responseData = response.data;
        const imgUrl = responseData.imgUrl;

        // Функция для блокировки кнопки до полной загрузки изображения
        const btnBlocked = () => {
          return new Promise((resolve, reject) => {
            // Создаем новое изображение и ждем, пока оно полностью загрузится
            const img = new Image();
            img.src = imgUrl;
            console.log(imgUrl);
            console.log(img);

            img.onload = () => {
              // Когда изображение загружено, добавляем его в слайд
              const newSlide = document.createElement("div");
              newSlide.classList.add("offer__slide");
              newSlide.appendChild(img);
              this.slidesField.appendChild(newSlide);

              // Обновление списка слайдов
              this.slides = document.querySelectorAll(".offer__slide");

              // Применяем ширину для нового слайда
              const width = window.getComputedStyle(this.slidesWrapper).width;
              newSlide.style.width = width; // Применение ширины к новому слайду

              // Обновление счётчика
              this.requestCounter.innerText = `Request counter: ${responseData.requestCounter - 1}`;
              localStorage.setItem("requestCounter", responseData.requestCounter);

              // Реинициализация слайдера после добавления нового слайда
              this.initializeSlider();
              // Перемещение к новому слайду
              this.moveSlider();

              resolve();
            };
            img.onerror = () => {
              console.error("Error loading image");
              reject();
            };
          });
        };

        await btnBlocked();
      } catch (error) {
        console.error("Error fetching image", error);
      } finally {
        this.nextSlide.classList.remove("disabled"); // разблокировать кнопку
      }
    }

    resizeSlider() {
      window.addEventListener("resize", () => {
        this.offset = 0; // Сбрасываем offset при ресайзе
        this.initializeSlider(); // Реинициализируем слайдер
      });
    }

    resetLocalStorage() {
      window.addEventListener("beforeunload", () => {
        localStorage.setItem("requestCounter", 1);
      });
    }

    nextSlideShow() {
      this.nextSlide.addEventListener("click", async () => {
        await this.addNewSlide(); // Ждём загрузку слайда
      });
    }

    // Метод для инициализации всех слушателей
    // initializeListeners() {
    //   this.resizeSlider();
    //   this.resetLocalStorage();
    //   this.nextSlideShow();
    // }
  }

  const newSlide = new SlideShow(
    "requestCounter",
    ".offer__slider-next > img",
    ".offer__slider-wrapper",
    ".offer__slider-inner",
    ".offer__slide"
  );
  newSlide.nextSlideShow();
  newSlide.resizeSlider();
  newSlide.resetLocalStorage();
});
