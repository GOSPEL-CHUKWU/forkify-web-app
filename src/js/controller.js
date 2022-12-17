import * as model from './module.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import { search } from 'core-js/fn/symbol';

// if (module.hot) {
//   module.hot.accept();
// }

// console.log(icons);

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//Loading a Recipe from API
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update Results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //3) Updating bookmark view
    bookmarksView.update(model.state.bookmarks);

    // 1) loading recipe
    await model.loadRecipe(id);
    // const { recipe } = model.state;

    ///////////////////////////////////////
    // 2) Rendering the recipe
    recipeView.render(model.state.recipe);

    //creating the object here
    // const recipeView = new recipeView(model.state.recipe)
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    // console.log(resultsView);

    //Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //Load search results
    await model.loadSearchResult(query);

    //Render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    // console.log(model.getSearchResultsPage(1));
    resultsView.render(model.getSearchResultsPage());

    //Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};
// controlSearchResult();

const controlPagination = function (goToPage) {
  //Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2) Update recipe view
  recipeView.update(model.state.recipe);

  //3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    console.log(newRecipe);
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //automatically going back just like the back arrow in web browsers
    // window.history.back()

    //Success message
    addRecipeView.renderSuccessMessage();

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error('⚠', error);
    addRecipeView.renderError(error.message);
  }
};

// controlRecipes();
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

// // Personal challenge 1
// // A pure function that takes in only a number string and converts it ot a regular number
// const convertStringToNumber = function (string) {
//   if (!string) return 'Enter A Value';
//   if (typeof string !== 'string') return 'Not A String';
//   if (typeof string === 'string') {
//     const connvertToNumber = +string;
//     return isNaN(connvertToNumber) ? 'Not A Number' : connvertToNumber;
//   }
// };
// console.log(convertStringToNumber('5555'));

// //Personal challenge 2
// // A program that prints the numbers from 1 to 100, followed by a new line. But for multiples of three print Fizz instead of the number and for the multiples of five print Buzz. For numbers which are multiples of both three and five print FizzBuzz
// let input = prompt(`Enter Number to know it's FizzBuzz`);
// let num = '';

// const fizzBuzz = function () {
//   if (!input) return 'No Input';

//   for (let i = 1; i <= input; i++) {
//     if (i % 3 === 0 && i % 5 === 0) num += 'FizzBuzz, ';
//     if (i % 3 === 0) num += 'Fizz, ';
//     if (i % 5 === 0) num += 'Buzz, ';
//     if (i % 3 !== 0 && i % 5 !== 0) num += `${i}, `;
//   }
//   return num.slice(0, -2);
// };
// console.log(fizzBuzz());
