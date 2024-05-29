module.exports = class Controller {
  static async createCategory(req, res, next) {
    try {
      res.status(200).json("masuk");
    } catch (error) {}
  }
};
