import {
    state,
    addArticles,
    setLoading,
    setError
} from "./state.js";

// ─────────────────────────────────────────────────────────────
// The Guardian Open Platform API — free, CORS-friendly for browsers
// Built-in "test" key works immediately (rate-limited but functional)
// For production: get your own free key at:
// https://open-platform.theguardian.com/access/
// ─────────────────────────────────────────────────────────────
const API_KEY = "39489881-beb9-4bbd-ac8e-b06fc7703ace";
const BASE    = "https://content.guardianapis.com";
const FIELDS  = "show-fields=thumbnail,trailText";

// Map app category names → Guardian section identifiers
const SECTION_MAP = {
    general:       "",
    business:      "business",
    technology:    "technology",
    sports:        "sport",
    entertainment: "culture",
    health:        "lifeandstyle",
    science:       "science"
};

// Normalise a Guardian article to the shape render.js expects
function normalise(article) {
    return {
        title:       article.webTitle,
        description: article.fields?.trailText  || null,
        urlToImage:  article.fields?.thumbnail  || null,
        url:         article.webUrl,
        publishedAt: article.webPublicationDate,
        source:      { name: article.sectionId || "The Guardian" }
    };
}

export async function fetchNews(reset = false) {

    try {

        setLoading(true);
        setError("");

        const pageSize = Math.min(state.pageSize, 10);
        const baseParams =
            `${FIELDS}&page-size=${pageSize}&page=${state.page}` +
            `&order-by=newest&api-key=${API_KEY}`;

        let url = "";

        // SEARCH MODE
        if (state.searchQuery.trim() !== "") {

            url =
                `${BASE}/search?q=${encodeURIComponent(state.searchQuery)}` +
                `&${baseParams}`;

        }

        // CATEGORY / TOP-HEADLINES MODE
        else {

            const section = SECTION_MAP[state.category] || "";

            url = section
                ? `${BASE}/search?section=${section}&${baseParams}`
                : `${BASE}/search?${baseParams}`;

        }

        const response = await fetch(url);

        if (!response.ok) {

            if (response.status === 401 || response.status === 403) {
                throw new Error(
                    "Invalid API key. Get a free key at open-platform.theguardian.com"
                );
            }

            throw new Error("Failed to fetch news. Please try again.");

        }

        const data = await response.json();

        if (data.response?.status !== "ok") {
            throw new Error(
                data.response?.message || "Something went wrong."
            );
        }

        // Normalise and filter: only keep articles with all three fields
        const articles = (data.response.results || [])
            .map(normalise)
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
