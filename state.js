export const state = {

    // News articles
    articles: [],

    // Search text
    searchQuery: "",

    // Selected category
    category: "general",

    // Selected country
    country: "in",

    // Pagination
    page: 1,

    // Articles per request
    pageSize: 12,

    // Loading state
    isLoading: false,

    // Error message
    error: "",

    // Bookmarks
    bookmarks:
        JSON.parse(
            localStorage.getItem("bookmarks")
        ) || []

};



export function resetPage() {

    state.page = 1;

}



export function nextPage() {

    state.page++;

}



export function setSearch(query) {

    state.searchQuery = query;

}



export function setCategory(category) {

    state.category = category;

}



export function setCountry(country) {

    state.country = country;

}



export function clearArticles() {

    state.articles = [];

}



export function addArticles(news) {

    state.articles = [
        ...state.articles,
        ...news
    ];

}



export function setLoading(value) {

    state.isLoading = value;

}



export function setError(message) {

    state.error = message;

}



export function saveBookmarks() {

    localStorage.setItem(
        "bookmarks",
        JSON.stringify(state.bookmarks)
    );

}



export function addBookmark(article) {

    const exists = state.bookmarks.some(
        item => item.url === article.url
    );

    if (!exists) {

        state.bookmarks.push(article);

        saveBookmarks();

    }

}



export function removeBookmark(url) {

    state.bookmarks =
        state.bookmarks.filter(
            article => article.url !== url
        );

    saveBookmarks();

}