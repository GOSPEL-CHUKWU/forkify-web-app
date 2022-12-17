import icons from 'url:../../img/icons.svg'; //Parcel 2
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _currentPage;

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    this._currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);
    // Page 1, and there are other pages
    if (this._currentPage === 1 && numPages > 1) {
      return this.nextButton();
    }

    // Last page
    if (this._currentPage === numPages && numPages > 1) {
      return this.previousButton();
    }

    // Other page
    if (this._currentPage < numPages) {
      return this.previousButton() + this.nextButton();
    }

    // Page 1, and there are NO other pages
    return '';
  }

  previousButton() {
    return `
      <button data-goto="${
        this._currentPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${this._currentPage - 1}</span>
      </button>`;
  }
  nextButton() {
    return `
      <button data-goto="${
        this._currentPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${this._currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button> `;
  }
}

export default new PaginationView();
