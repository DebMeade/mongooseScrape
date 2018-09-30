// $.getJSON("/articles", function(data) {
//   for (var i = 0; i < data.length; i++) {
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//   }
// });

scrapeArticles()


function scrapeArticles () {
  const url = "/scrape"
  fetch(url)
  .then((response) => {
    return response.json()
  })
  .then((articles)=> {
    processArticleData(articles)
  })
  .catch((err) => {
    console.log(err)
  })
}

//step1: loop through article data and create html elements for each collection of data
//step2: clear scraped articles container
//step3: append articles to page
function processArticleData (articlesData) {
  console.log(articlesData)
  let articles = articlesData.map(articleData => buildArticleElement(articleData))
  console.log(articles)
  renderScrapedArticles(articles)
}

function renderScrapedArticles (articles) {
  $("#articles").append(articles)
}

function buildArticleElement(articleData) {
  console.log(articleData)
  let article = $("<p class='scrapedArticle'>")
  let title = $("<h3>").text(articleData.title)
  let link = $("<a>").attr("href", articleData.link)
  let summary = $("<span>").text(articleData.summary)
  let button = $("<button class='saveScrapeButton'>").text("Save Article")

  button.on("click", collectScrapedArticleData)
  link.append(title)
  article.append(link)
  article.append(summary)
  article.append(button)
  return article
}

function collectScrapedArticleData(event) {
  let articleNode = $(this).parent()
  let articleObject = {}
  articleObject.title = articleNode.children("a").children("h3").text();
  articleObject.link = articleNode.children("a").attr("href");
  articleObject.summary = articleNode.children("span").text();
  // console.log(articleObject)
}

function saveArticle(articleData) {
  let url = "/articles"
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(articleData),
  }
  fetch (url, request)
  .then(res => res.json())
  .then(response => console.log(response))

} 