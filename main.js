import {
    state,
    setSearch,
    setCategory,
    setCountry,
    nextPage,
    resetPage
} from "state.js";

import { fetchNews } from "api.js";
import { renderNews } from "render.js";

const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const countrySelect = document.getElementById("country-select");
const loadMoreBtn = document.getElementById("load-more");
const themeBtn = document.getElementById("theme-btn");

const topicButtons =
    document.querySelectorAll(".topic");



// INITIAL LOAD

async function init() {

    await fetchNews(true);

    renderNews();

}

init();



// SEARCH

let debounce;

searchInput.addEventListener(
    "input",
    () => {

        clearTimeout(debounce);

        debounce = setTimeout(
            async () => {

                resetPage();

                setSearch(
                    searchInput.value
                );

                await fetchNews(true);

                renderNews();

            },
            500
        );

    }
);



// CATEGORY

categorySelect.addEventListener(
    "change",
    async () => {

        resetPage();

        setCategory(
            categorySelect.value
        );

        await fetchNews(true);

        renderNews();

    }
);



// COUNTRY

countrySelect.addEventListener(
    "change",
    async () => {

        resetPage();

        setCountry(
            countrySelect.value
        );

        await fetchNews(true);

        renderNews();

    }
);



// TRENDING TOPICS

topicButtons.forEach(button => {

    button.addEventListener(
        "click",
        async () => {

            searchInput.value =
                button.textContent;

            resetPage();

            setSearch(
                button.textContent
            );

            await fetchNews(true);

            renderNews();

        }
    );

});



// LOAD MORE

loadMoreBtn.addEventListener(
    "click",
    async () => {

        nextPage();

        await fetchNews();

        renderNews();

    }
);



// DARK MODE

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );

        localStorage.setItem(
            "theme",
            document.body.classList.contains(
                "dark"
            )
        );

    }
);



// RESTORE THEME

const darkMode =
    localStorage.getItem(
        "theme"
    );

if (darkMode === "true") {

    document.body.classList.add(
        "dark"
    );

}
