import {
    state,
    addArticles,
    setLoading,
    setError
} from "./state.js";

const API_KEY = "7da4ebae6e2a4ad89948ad474f82d01a";

export async function fetchNews(reset = false) {

    try {

        setLoading(true);
        setError("");

        let url = "";

        // SEARCH MODE
        if (state.searchQuery.trim() !== "") {

            url =
                `https://newsapi.org/v2/everything?q=${encodeURIComponent(
                    state.searchQuery
                )}&page=${state.page}&pageSize=${state.pageSize}&sortBy=publishedAt&apiKey=${API_KEY}`;

        }

        // CATEGORY MODE
        else {

            url =
                `https://newsapi.org/v2/top-headlines?country=${state.country}&category=${state.category}&page=${state.page}&pageSize=${state.pageSize}&apiKey=${API_KEY}`;

        }

        const response = await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Failed to fetch news."
            );

        }

        const data = await response.json();

        if (data.status !== "ok") {

            throw new Error(
                data.message || "Something went wrong."
            );

        }

        const articles = data.articles.filter(
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
