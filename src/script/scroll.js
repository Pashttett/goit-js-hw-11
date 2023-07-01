export default function smoothScroll() {
  const galleryElement = document.querySelector(".gallery");
  const cardElement = galleryElement.firstElementChild;
  const cardHeight = cardElement.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}
