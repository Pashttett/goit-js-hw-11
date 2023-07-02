import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import createMarkup from './js/photo-markup';
import smoothScroll from './js/scroll';
import fetchData from './js/axios';

const searchForm = document.querySelector('.search-form');
const searchList = document.querySelector('.search-list-js');
const searchInput = document.querySelector('input[name="searchQuery"]');
const targetElement = document.querySelector('.js-guard');

const itemsPerPage = 80;
let gallerySlider;

const options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0
};

let observer;
let currentPage = 1;
let totalPages = 0;

searchForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  currentPage = 1;
  totalPages = 0;
  getImages(1, itemsPerPage);
}

async function getImages(page, perPage) {
  if (searchInput.value.trim() === '') {
    return Notiflix.Notify.failure(`Request cannot be empty`);
  }

  try {
    const response = await fetchData(page, perPage, searchInput.value.trim());
    
    if (response.hits.length === 0) {
      Notiflix.Notify.failure(`Oooops! No images found for query <i>'${searchInput.value}</i>'`);
      searchList.innerHTML = `<p>Oooops! No images found for query <i>'${searchInput.value}</i>'. Try again!</p>`;
      return;
    }
    
    totalPages = Math.ceil(response.totalHits / itemsPerPage);
    Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images`);
    
    console.log(response);
    
    searchList.innerHTML = createMarkup(response.hits);
    
    observer = new IntersectionObserver(onLoad, options);
    observer.observe(targetElement);
        
    gallerySlider = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 950,
      navText: ['❮', '❯']
    });

  } catch (error) {
    console.error(error);
  }
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log(entries);
      currentPage += 1;
      if (currentPage > totalPages) {
        observer.unobserve(targetElement);
        setTimeout(() => {
          Notiflix.Notify.info(`We're sorry, but you've reached the end of search results`);
        }, 2000);
        return;
      }
      fetchData(currentPage, itemsPerPage, searchInput.value.trim())
        .then(response => {
          console.log(response);
          searchList.insertAdjacentHTML('beforeend', createMarkup(response.hits));
          gallerySlider.refresh();
          
          observer.observe(targetElement);
          
          smoothScroll();
          
        })
        .catch(error => console.log(error));
    }
  });
}
