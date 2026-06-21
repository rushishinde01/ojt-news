import {
    state,
    addArticles,
    setLoading,
    setError
} from "./state.js";

// ─────────────────────────────────────────────────────────────
// GNews API — free tier, CORS-friendly, works from the browser
// Sign up for a free key at: https://gnews.io
// Free plan: 100 req/day, max 10 articles per request
// ─────────────────────────────────────────────────────────────
const API_KEY = "YOUR_GNEWS_API_KEY_HERE";
const BASE    = "https://gnews.io/api/v4";

// GNews free plan caps results at 10 per request
const MAX_PER_PAGE = 10;

export async function fetchNews(reset = false) {

    try {

        setLoading(true);
        setError("");

        const pageSize = Math.min(state.pageSize, MAX_PER_PAGE);
        let url = "";

        // SEARCH MODE
        if (state.searchQuery.trim() !== "") {

            url =
                `${BASE}/search?q=${encodeURIComponent(state.searchQuery)}` +
                `&lang=en&max=${pageSize}&page=${state.page}&token=${API_KEY}`;

        }

        // CATEGORY / TOP-HEADLINES MODE
        else {

            url =
                `${BASE}/top-headlines?category=${state.category}` +
                `&country=${state.country}&lang=en&max=${pageSize}&page=${state.page}&token=${API_KEY}`;

        }

        const response = await fetch(url);

        if (!response.ok) {

            // GNews returns 403 when key is invalid/missing
            if (response.status === 403) {
                throw new Error("Invalid API key. Get a free key at gnews.io and update api.js.");
            }

            throw new Error("Failed to fetch news. Please try again.");

        }

        const data = await response.json();

        // Normalize GNews article shape to match render.js expectations:
        // GNews uses `article.image`; render.js expects `article.urlToImage`
        const articles = (data.articles || [])
            .map(article => ({
                ...article,
                urlToImage: article.image || null
            }))
            .filter(
                article =>
                    article.title &&
                    article.urlToImage &&
                    article.description
            );

        if (reset) {

            state.articles = articles;

        } else {

            addArticles(articles);

        }

    }

    catch (error) {

        setError(error.message);

        console.error(error);

    }

    finally {

        setLoading(false);

    }

}
