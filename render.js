import { state, addBookmark, removeBookmark } from "./state.js";

const newsContainer = document.getElementById("news-container");
const loadingSection = document.getElementById("loading");
const errorBox = document.getElementById("error-box");



export function renderNews() {

    loadingSection.style.display =
        state.isLoading ? "flex" : "none";

    errorBox.textContent = state.error;

    newsContainer.innerHTML = "";

    if (
        !state.isLoading &&
        state.articles.length === 0
    ) {

        newsContainer.innerHTML = `
        <h2 style="text-align:center">
            📭 No articles found
        </h2>
        `;

        return;

    }

    state.articles.forEach(article => {

        const isBookmarked =
            state.bookmarks.some(
                item => item.url === article.url
            );

        const card =
            document.createElement("div");

        card.className = "news-card";

        const date =
            new Date(
                article.publishedAt
            ).toLocaleDateString();

        const readTime =
            estimateReadTime(
                article.description
            );

        card.innerHTML = `

        <img
        src="${article.urlToImage}"
        alt="news image"
        >

        <div class="news-content">

            <h3>
                ${article.title}
            </h3>

            <p>
                ${article.description}
            </p>

            <small>
                📅 ${date}
            </small>

            <br><br>

            <small>
                ⏱ ${readTime}
            </small>

            <br><br>

            <div class="card-buttons">

                <button
                class="bookmark-btn"
                >
                    ${isBookmarked
                ? "💔 Remove"
                : "❤️ Save"
            }
                </button>

                <a
                class="read-btn"
                href="${article.url}"
                target="_blank"
                >
                    Read More
                </a>

            </div>

        </div>
        `;



        card.querySelector(
            ".bookmark-btn"
        ).addEventListener(
            "click",
            () => {

                if (isBookmarked) {

                    removeBookmark(
                        article.url
                    );

                } else {

                    addBookmark(
                        article
                    );

                }

                renderNews();

            }
        );

        newsContainer.appendChild(
            card
        );

    });

}



function estimateReadTime(text) {

    if (!text)
        return "1 min read";

    const words =
        text.split(" ").length;

    const minutes =
        Math.max(
            1,
            Math.ceil(words / 200)
        );

    return `${minutes} min read`;

}
