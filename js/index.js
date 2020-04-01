const url = "https://www.googleapis.com/youtube/v3/search?";
const key = "key=AIzaSyDlj9c6mTCsbY22t52HXyTnzGYm4f6yS0Q&";
const part = "part=snippet";
const maxResults = "maxResults=10";
const type = "type=video";

async function fetchNextPage(q, nextPageToken) {
    let results = await fetch(`${url}${key}&${part}&${maxResults}&${q}&${type}&${nextPageToken}`)
        .then(response => response.json())
        .then(data => {return data});
    document.querySelector(".search-results").innerHTML = "";
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
    if (results.prevPageToken) {
        let prevPage = document.createElement("button");
        prevPage.innerHTML = "Prev page";
        document.querySelector(".search-results").appendChild(prevPage);
        prevPage.addEventListener("click", () => {
            fetchNextPage(q, "pageToken=" + results.prevPageToken);
        });
    }
    if (results.nextPageToken) {
        let nextPage = document.createElement("button");
        nextPage.innerHTML = "Next page";
        document.querySelector(".search-results").appendChild(nextPage);
        nextPage.addEventListener("click", () => {
            fetchNextPage(q, "pageToken=" + results.nextPageToken);
        });
    }
}

async function fetchYT() {
    const q = "q=" + document.querySelector("input").value.trim();
    let results = await fetch(`${url}${key}&${part}&${maxResults}&${q}&${type}`)
        .then(response => response.json())
        .then(data => {return data});
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
    let nextPage = document.createElement("button");
    nextPage.innerHTML = "Next page";
    nextPage.addEventListener("click", () => {
        nextPage.remove();
        fetchNextPage(q, "pageToken=" + results.nextPageToken);
    })
    document.querySelector(".search-results").appendChild(nextPage);
}

function searchEvent() {
    document.querySelector("button").addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector(".search-results").innerHTML = "";
        if (document.querySelector("input").value.trim() !== "") {
            fetchYT();
        }
    });
}

function init() {
    searchEvent();
}

init();