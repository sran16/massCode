import express from "express";
import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserValidator from "../../validators/UserValidator.js";
import LoginValidator from "../../validators/LoginValidator.js";

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const prisma = new PrismaClient();

router.post("/register", async (req, res, next) => {
  let data;
  try {
    data = UserValidator.parse(req.body);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }

  const { email, password, photo } = data;

  // check if the user exist
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    return next(createError(400, "User already exists"));
  }

  const SALT = 10;
  const hashedPassword = bcrypt.hashSync(password, SALT);

  // create
  const entry = await prisma.user.create({
    data: {
      email,
      photo,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    id: entry.id,
    email: entry.email,
  });
});

//Login
router.post("/login", async (req, res, next) => {
  let data;
  try {
    data = LoginValidator.parse(req.body);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }

  const { email, password } = data;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return next(createError(403, "Wrong email or password"));
  }

  // check the password is right
  const isGoodPassword = bcrypt.compareSync(password, user.password);

  if (!isGoodPassword) {
    return next(createError(403, "Wrong email or password"));
  }

  // puis on renvoie le token
  res.json({
    token: jwt.sign(
      {
        id: user.id,
      },
      // clef pour signer le token
      process.env["JWT_KEY"],
      // durée du token
      {
        expiresIn: "30m",
      }
    ),
  });
});

// const authMiddleware = (req, res, next) => {
//   // Check for the presence of a valid JWT token in the request header
//   const token = req.headers["Authorization"];

//   // If the token is not present, return an error response
//   if (!token) {
//     return res.status(401).json({
//       error: "Unauthorized",
//     });
//   }

//   // Try to parse the token
//   try {
//     const decodedToken = jwt.verify(token, process.env["JWT_KEY"]);

//     // Get the user ID from the token
//     const userId = decodedToken.payload.userId;

//     // Find the user by ID
//     const user =  prisma.user.findOne({
//       where: {
//         id: userId,
//       },
//     });

//     // If the user is not found, return an error response
//     if (!user) {
//       return res.status(401).json({
//         error: "Unauthorized",
//       });
//     }

//     // Add the user to the request context
//     req.user = user;

//     next();
//   } catch (error) {
//     // The token is invalid, return an error response
//     return res.status(401).json({
//       error: "Unauthorized",
//     });
//   }
// };

export default router;
