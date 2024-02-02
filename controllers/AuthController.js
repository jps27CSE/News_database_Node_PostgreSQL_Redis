import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { loginSchema, registerSchema } from "../validations/authValidaiton.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/mailer.js";
import logger from "../config/logger.js";
import { emailQueue, emailQueueName } from "../jobs/SendEmailJob.js";

class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);

      // check if email exist
      const findUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (findUser) {
        return res.status(400).json({
          error: {
            email: "Email already taken, please try with another email",
          },
        });
      }

      //ecrypt the password
      const salt = bcrypt.genSaltSync(10);
      payload.password = bcrypt.hashSync(payload.password, salt);

      const user = await prisma.users.create({
        data: payload,
      });

      return res.json({
        status: 200,
        messages: "User Created Successfully",
        user,
      });
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

  static async login(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(loginSchema);
      const payload = await validator.validate(body);

      //find user
      const findUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (findUser) {
        if (!bcrypt.compareSync(payload.password, findUser.password)) {
          return res.status(400).json({
            error: {
              email: "Invalid Credentials",
            },
          });
        }

        // issue user token

        const payloadData = {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
          profile: findUser.profile,
        };

        const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
          expiresIn: "365d",
        });

        return res.json({
          message: "Logged In",
          access_token: `Bearer ${token}`,
        });
      }

      return res.status(400).json({
        error: {
          email: "no user found with this email",
        },
      });

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

  // send test mail
  static async sendTestMail(req, res) {
    try {
      const { email } = req.query;

      const payload = {
        toEmail: email,
        subject: "Hey i am just testing",
        body: "<h1>Hey i am just testing</h1>",
      };

      // await sendEmail(payload.toEmail, payload.subject, payload.body);

      await emailQueue.add(emailQueueName, payload);

      return res.json({ status: 200, message: "Job Added Successfully" });
    } catch (error) {
      logger.error({ type: "Email Error", body: error });
      return res
        .status(500)
        .json({ message: "Something went wrong, please try again later" });
    }
  }
}

export default AuthController;
