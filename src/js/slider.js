export function slider() {
  const slides = document.querySelectorAll(".offer__slide"),
    prev = document.querySelector(".offer__slider-prev"),
    next = document.querySelector(".offer__slider-next"),
    total = document.querySelector("#total"),
    current = document.querySelector("#current"),
    slidesWrapper = document.querySelector(".offer__slider-wrapper"),
    slidesField = document.querySelector(".offer__slider-inner"),
    width = window.getComputedStyle(slidesWrapper).width;

  console.log(slides);

  let slideIndex = 1,
    offset = 1;

  slidesField.style.width = 100 * slides.length + "%";
  slidesField.style.display = "flex";
  slidesField.style.transition = "0.3s all";

  slidesWrapper.style.overflow = "hidden";

  slides.forEach((item) => {
    item.style.width = width;
  });

  next.addEventListener("click", () => {
    if (offset == Number(width.slice(0, width.length - 2)) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += Number(width.slice(0, width.length - 2));
      console.log(offset);
    }

    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    if (slides.length < 10) {
      total.textContent = `0${slides.length}`;
      current.textContent = `0${slideIndex}`;
    } else {
      total.textContent = slides.length;
      current.textContent = slideIndex;
    }
  });

  prev.addEventListener("click", () => {
    if (offset == 0) {
      offset = Number(width.slice(0, width.length - 2)) * (slides.length - 1);
    } else {
      offset -= Number(width.slice(0, width.length - 2));
      console.log(offset);
    }

    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }

    if (slides.length < 10) {
      total.textContent = `0${slides.length}`;
      current.textContent = `0${slideIndex}`;
    } else {
      total.textContent = slides.length;
      current.textContent = slideIndex;
    }
  });
}
