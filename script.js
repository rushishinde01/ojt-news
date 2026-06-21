const API_KEY = "7da4ebae6e2a4ad89948ad474f82d01a";

const container = document.getElementById("news-container");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");

let currentCategory = "general";

/* ---------------- LOADING ---------------- */
function showLoading() {
    loading.classList.remove("hidden");
}

function hideLoading() {
    loading.classList.add("hidden");
}

/* ---------------- FETCH NEWS ---------------- */
async function fetchNews(url) {
    try {
        showLoading();
        container.innerHTML = "";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch news");
        }

        const data = await response.json();

        if (!data.articles || data.articles.length === 0) {
            container.innerHTML = "<h3>No news found</h3>";
            return;
        }

        displayNews(data.articles);

    } catch (error) {
        container.innerHTML = `
            <div class="error">
                <h2>⚠️ ${error.message}</h2>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

/* ---------------- DISPLAY NEWS ---------------- */
function displayNews(articles) {
    container.innerHTML = "";

    articles.forEach(article => {
        const div = document.createElement("div");
        div.classList.add("card");

        const image =
            article.urlToImage ||
            "https://via.placeholder.com/400x200?text=No+Image";

        div.innerHTML = `
            <img src="${image}" alt="news image" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'"/>

            <div class="card-content">
                <h3>${article.title || "No title available"}</h3>

                <p>${article.description || "No description available"}</p>

                <a href="${article.url}" target="_blank">
                    Read More →
                </a>
            </div>
        `;

        container.appendChild(div);
    });
}

/* ---------------- BUILD URL ---------------- */
function buildURL({ category = "general", query = "" }) {
    if (query) {
        return `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;
    }

    return `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;
}

/* ---------------- INITIAL LOAD ---------------- */
fetchNews(buildURL({ category: currentCategory }));

/* ---------------- SEARCH ---------------- */
document.getElementById("searchBtn").addEventListener("click", () => {
    const q = searchInput.value.trim();

    if (!q) return;

    fetchNews(buildURL({ query: q }));
});

/* Enter key support */
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.getElementById("searchBtn").click();
    }
});

/* ---------------- CATEGORY FILTER ---------------- */
document.querySelectorAll(".category").forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelectorAll(".category")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        currentCategory = btn.dataset.category;

        fetchNews(buildURL({ category: currentCategory }));
    });
});