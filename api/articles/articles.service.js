const Article = require("./articles.schema");
const mongoose = require("mongoose");
class ArticleService {
  create(data, user) {
    const article = new Article(data);
    article.user = user.id;
    return article.save();
  }
  update(id, data) {
    return Article.findOneAndUpdate({ _id: id }, data, { new: true });
  }

  delete(id) {
    return Article.deleteOne({ _id: id });
  }

  getArticlesByUser(userId) {
    try {
      const articles = Article.find({ user: userId })
        .populate({
          path: "user",
          select: "-password",
        })
        .exec();
      return articles;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new ArticleService();
