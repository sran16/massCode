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

//Categories

// Création de catégorie

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

// Récupération des catégories

router.get("/categories", async (req, res, next) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

// Mise à jour de category

router.patch("/categories/:categoryId", async (req, res, next) => {
  const categoryId = parseInt(req.params.categoryId);
  const { name } = req.body;

  const category = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name,
    },
  });

  res.json(category);
});

// Suppression de category

router.delete("/categories/:categoryId", async (req, res, next) => {
  const categoryId = parseInt(req.params.categoryId);

  try {
    // Vérifier si la category existe
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!existingCategory) {
      return next(createError(404, "Extrait non trouvé"));
    }

    // supprimer la category
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    res.status(204).send("Extrait supprimé avec succès");
  } catch (error) {
    console.error(error);
    next(createError(500, "Erreur du serveur"));
  }
});

// Snippets routes

// Récupération des snippets

router.get("/snippets", auth, async (req, res, next) => {
  const categoryId = parseInt(req.query.categoryId);
  const userId = req.auth.id;
  console.log(userId);
  const page = parseInt(req.query.page || 1);
  const snippetsPerPage = 10;
  const skip = (page - 1) * snippetsPerPage;
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
// Mise à jour de snippet

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
//récupération d'un snippet par ID

router.get("/:id", async (req, res, next) => {
  const snippet = await prisma.snippet.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!snippet) {
    return next(createError(404, "snippet not found"));
  }

  res.json(snippet);
});

// Création de snippet

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
// Suppression de snippet

router.delete("/snippets/:snippetId", async (req, res, next) => {
  const snippetId = parseInt(req.params.snippetId);

  try {
    // Vérifier si le snippet existe
    const existingSnippet = await prisma.snippet.findUnique({
      where: {
        id: snippetId,
      },
    });

    if (!existingSnippet) {
      return next(createError(404, "Extrait non trouvé"));
    }

    // supprimer le snippet
    await prisma.snippet.delete({
      where: {
        id: snippetId,
      },
    });

    res.status(204).send("Extrait supprimé avec succès");
  } catch (error) {
    console.error(error);
    next(createError(500, "Erreur du serveur"));
  }
});

export default router;
