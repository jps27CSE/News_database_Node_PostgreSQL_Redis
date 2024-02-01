import { newsSchema } from "../validations/newsValidation.js";
import vine, { errors } from "@vinejs/vine";
class NewsController {
  static async index(req, res) {}
  static async store(req, res) {
    try {
      const user = req.user;
      const body = req.body;

      const validator = vine.compile(newsSchema);
      const payloadd = await validator.validate(body);
      return res.json({ payload });
    } catch (error) {
      console.log("error is", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        // console.log(error.messages);
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "something went wrong,, please try again later",
        });
      }
    }
  }
  static async show(req, res) {}
  static async update(req, res) {}
  static async destroy(req, res) {}
}

export default NewsController;
