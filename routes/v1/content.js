import express from "express";
import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { expressjwt } from "express-jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SnippetValidator from "../../validators/SnippetValidator.js";
import CategoryValidator from "../../validators/CategoryValidator.js";

const auth = expressjwt({
  secret: process.env["JWT_KEY"],
  algorithms: ["HS256"],
});

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const prisma = new PrismaClient();

router.get("/snippets", auth, async (req, res, next) => {
  const categoryId = parseInt(req.query.categoryId);
  const userId = req.auth.id;
  console.log(userId);
  const page = parseInt(req.query.page || 1); // récupère la page depuis la requête
  const snippetsPerPage = 10; // nombre de snippets par page
  const skip = (page - 1) * snippetsPerPage; // calcul du décalage (pagination)
  try {
    const snippets = await prisma.snippet.findMany({
      where: {
        categoryId,
        userId,
      },
      take: snippetsPerPage,
      skip,
    });
    res.json(snippets);
  } catch (error) {
    console.log(error);
    next(createError(500, "erreur du serveur"));
  }
});

router.patch("/snippets/:snippetId", async (req, res, next) => {
  const snippetId = parseInt(req.params.snippetId);
  const { title, content, language } = req.body;

  const snippet = await prisma.snippet.update({
    where: {
      id: snippetId,
    },
    data: {
      title,
      content,
      language,
    },
  });

  res.json(snippet);
});

router.delete("/snippets/:snippetId", async (req, res, next) => {
  const snippetId = parseInt(req.params.snippetId);

  await prisma.snippet.delete({
    where: {
      id: snippetId,
    },
  });

  res.status(204).send();
});

router.get("/categories", async (req, res, next) => {
  const categories = await prisma.category.findMany();

  res.json(categories);
});

router.post("/snippets", async (req, res) => {
  let snippet;

  try {
    snippet = SnippetValidator.parse(req.body);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }

  const entry = await prisma.snippet.create({
    data: {
      title: snippet.title,
      content: snippet.content,
      language: snippet.language,
      categoryId: parseInt(snippet.categoryId),
      userId: parseInt(snippet.userId),
    },
  });

  res.json(entry);
});

router.post("/categories", async (req, res) => {
  let category;

  try {
    category = CategoryValidator.parse(req.body);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }

  const entry = await prisma.category.create({
    data: {
      name: category.name,
    },
  });

  res.json(entry);
});
//modifier

// router.put("/snippets/:snippetId", async (req, res, next) => {
//   const snippetId = parseInt(req.params.snippetId);
//   const { title, content, language } = req.body;

//   const snippet = await prisma.snippet.update({
//     where: {
//       id: snippetId,
//     },
//     data: {
//       title,
//       content,
//       language,
//     },
//   });

//   res.json(snippet);
// });

export default router;
