const url = "https://www.googleapis.com/youtube/v3/search?";
const key = "key=AIzaSyBxWuCAHAvp6F47KDLQwZ93-Km-3632ZU0&";
const part = "part=snippet";
const maxResults = "maxResults=10";
const type = "type=video";

async function fetchYT(q, nextPageToken) {
    let results = await fetch(`${url}${key}&${part}&${maxResults}&${q}&${type}${nextPageToken}`)
        .then(response => response.json())
        .then(data => {return data});
    document.querySelector(".search-results").innerHTML = "";
    if (results.items) {
        results.items.forEach(i => {
            document.querySelector(".search-results").innerHTML += `
            <a href="https://www.youtube.com/watch?v=${i.id.videoId}" target="_blank">
                <img src="${i.snippet.thumbnails.medium.url}"/>
                <p>
                    ${i.snippet.title}
                </p>
            </a>
            `;
        });
    }
    if (results.prevPageToken) {
        let prevPage = document.createElement("button");
        prevPage.innerHTML = "Prev page";
        document.querySelector(".search-results").appendChild(prevPage);
        prevPage.addEventListener("click", () => {
            fetchYT(q, "&pageToken=" + results.prevPageToken);
        });
    }
    if (results.items.length === 10) {
        let nextPage = document.createElement("button");
        nextPage.innerHTML = "Next page";
        document.querySelector(".search-results").appendChild(nextPage);
        nextPage.addEventListener("click", () => {
            fetchYT(q, "&pageToken=" + results.nextPageToken);
        });
    }
}

function searchEvent() {
    document.querySelector("button").addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector(".search-results").innerHTML = "";
        if (document.querySelector("input").value.trim() !== "") {
            fetchYT("q=" + document.querySelector("input").value.trim(), "");
        }
    });
}

function init() {
    searchEvent();
}

init();