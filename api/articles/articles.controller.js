const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const config = require("../../config");
const articlesService = require("./articles.service");

class ArticlesController {
  async create(req, res, next) {
    try {
      const article = await articlesService.create(req.body, req.user);
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      if (req.user.role == "admin") {
        const id = req.params.id;
        const data = req.body;
        const articleModified = await articlesService.update(id, data);
        res.json(articleModified);
      } else {
        throw new UnauthorizedError();
      }
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      if (req.user.role == "admin") {
        const id = req.params.id;
        await articlesService.delete(id);
        req.io.emit("article:delete", { id });
        res.status(204).send();
      } else {
        throw new UnauthorizedError();
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
