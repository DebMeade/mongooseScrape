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
  let article = $("<p>")
  let title = $("<h3>").text(articleData.title)
  let link = $("<a>").attr("href", articleData.link)
  let summary = $(".wsj-summary").text(articleData.summary)
  // result.summary = $(".wsj-summary").text();
  link.append(title)
  article.append(link)
  article.append(summary)
  return article
}