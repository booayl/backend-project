const comments = require("./db/data/test-data/comments");
const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleID,
  checkArticleExists,
  createComment,
  updatedArticle,
} = require("./model");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  fetchArticles(sort_by, order).then((articles) => {
    res.status(200).send({ allArticles: articles });
  });
};

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  Promise.all([
    fetchCommentsByArticleID(article_id, sort_by, order),
    checkArticleExists(article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ allComments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  createComment(article_id, newComment)
    .then((comments) => {
      res.status(201).send({ postedComment: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updatedArticle(article_id, inc_votes).then((article) => {
    res.status(200).send({ updatedArticle: article });
  }).catch((err) => {
    next(err);
  });;
};
