const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");

app.use(express.json());

const { getTopics, getArticleById , getArticles, getCommentsByArticleID, postComment} = require("./controllers");

//Respond a list of all available endpoints from endpoint.json
app.get("/api", (req, res, next) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getCommentsByArticleID)

app.post("/api/articles/:article_id/comments", postComment);

//Error Handling Middleware
app.all("*", (req, res) => {
  res.status(404).send("Invalid Endpoint");
});

app.use((err, req, res, next) => {
    //Non-existent ID
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID Type" });
  }

  if(err.code === "23503"){
    res.status(404).send({msg:"Non-existent Article ID / Username"})
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
