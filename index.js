const express = require("express");
const axios = require("axios");
const htmlParser = require("node-html-parser");
const githubParser = require("github-calendar-parser");

const app = express();

app.get("/:user_name", function(req, res) {
  const userName = req.params.user_name;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  axios
    .get(
      `https://urlreq.appspot.com/req?method=GET&url=https://github.com/users/${userName}/contributions`
    )
    .then(resp => {
      const parsedHTML = htmlParser.parse(resp.data);
      const graph = parsedHTML.querySelector(".js-calendar-graph-svg");
      const extractedData = githubParser(graph.innerHTML);

      const longestStreakStartDate = new Date(
        extractedData.longest_streak_range[0]
      );
      const longestStreakEndDate = new Date(
        extractedData.longest_streak_range[1]
      );

      const currentStreakStartDate = new Date(
        extractedData.current_streak_range[0]
      );
      const currentStreakEndDate = new Date(
        extractedData.current_streak_range[1]
      );

      const response = {
        longestStreak: {
          days: extractedData.longest_streak,
          from: `${longestStreakStartDate.getDate()} ${
            months[longestStreakStartDate.getMonth()]
          } ${longestStreakStartDate.getFullYear()}`,
          to: `${longestStreakEndDate.getDate()} ${
            months[longestStreakEndDate.getMonth()]
          } ${longestStreakEndDate.getFullYear()}`
        },
        currentStreak: {
          days: extractedData.current_streak,
          from: `${currentStreakStartDate.getDate()} ${
            months[currentStreakStartDate.getMonth()]
          } ${currentStreakStartDate.getFullYear()}`,
          to: `${currentStreakEndDate.getDate()} ${
            months[currentStreakEndDate.getMonth()]
          } ${currentStreakEndDate.getFullYear()}`
        }
      };

      return response;
    })
    .then(response => res.send(response))
    .catch(() => res.send({ message: "Wrong Username" }));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);
