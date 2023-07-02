export default function createMarkup(arr) {
  return arr
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
      <li class="search-item photo-card">
        <a class="gallery-link" href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" class="search-image">
        </a>
        <div class="info">
          <p class="info-item">
            <strong>Likes:</strong> ${likes}
          </p>
          <p class="info-item">
            <strong>Views:</strong> ${views}
          </p>
          <p class="info-item">
            <strong>Comments:</strong> ${comments}
          </p>
          <p class="info-item">
            <strong>Downloads:</strong> ${downloads}
          </p>
        </div>
      </li>
    `)
    .join('');
}