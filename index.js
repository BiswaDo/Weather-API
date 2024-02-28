const PORT =  process.env.PORT | 3000;

const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
// const bodyParser = require("body-parser");

const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.get("/", function (req, res) {
//   res.sendFile(__dirname + "/index.html");
// });

app.get("/weather_overview", function (req, res) {
  const articles = [];
  
  const country = req.query.country;
  console.log(country);
  const place = req.query.place;

  axios
    .get("https://www.timeanddate.com/weather/" + country + "/" + place)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const base = "https://www.timeanddate.com";
      var fixedTitle = "";

      const correction = {
        "\t": "",
      };

      $("a:contains('Weather Today/Tomorrow')", html).each(function () {
        Object.keys(correction).forEach((key) => {
          fixedTitle = $(this).text().replaceAll(key, correction[key]);
        });

        // const title = fixedTitle.replaceAll("\n", "");

        const temp = $("#qlook").find(".h1").addBack().text().replaceAll("°C", "°C ");
        const weather = temp.replaceAll("Now", "");
        const weather_Details = weather.replaceAll(".", ". ");
        const headline = $(".headline-banner__content").text();
        const logo = $('#cur-weather').attr('src');
        // const more_details = $(".bk-focus__info").text();
        const source = base + $(this).attr("href");

        articles.push({ headline,logo, weather_Details, source });
      });
      res.json(articles);
    })
    .catch((err) => console.log(err));
});

app.get("/weather_overview/:countryId/:placeId", async (req, res) => {
  const countryId = req.params.countryId;
  const placeId = req.params.placeId;
  const base = "https://www.timeanddate.com";

  console.log(countryId, placeId);

  axios
    .get("https://www.timeanddate.com/weather/" + countryId + "/" + placeId)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      var fixedTitle = "";

      const correction = {
        "\t": "",
      };

      $("a:contains('Weather Today/Tomorrow')", html).each(function () {
        Object.keys(correction).forEach((key) => {
          fixedTitle = $(this).text().replaceAll(key, correction[key]);
        });

        const title = fixedTitle.replaceAll("\n", "");

        const temp = $("#qlook")
          .find(".h1")
          .addBack()
          .text()
          .replaceAll("°C", "°C ");
        const wheather = temp.replaceAll("Now", "");
        const wheather_Details = wheather.replaceAll(".", ".  ");
        const headline = $(".headline-banner__content").text();
        const more_details = $(".bk-focus__info").text();

        const source = base + $(this).attr("href");

        articles.push({ headline, title, wheather_Details, source, more_details });
        
      });
      res.json(articles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, function () {
  console.log(`server is running on port:${PORT}`);
});
