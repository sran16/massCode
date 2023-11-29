import express from "express";
import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SnippetValidator from "../../validators/SnippetValidator.js";

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const prisma = new PrismaClient();


router.get("/snippets/:categoryId/page/:pageNumber", async (req, res, next) => {
  const categoryId = parseInt(req.params.categoryId);
  const pageNumber = parseInt(req.params.pageNumber);
  const pageSize = 10; // Set the desired page size

  const snippets = await prisma.snippet.findMany({
    where: {
      categoryId: categoryId,
    },
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
  });

  res.json(snippets);
});

router.post("/snippets", async (req, res, next) => {
  const { title, content, language, categoryId } = req.body;

  const snippet = await prisma.snippet.create({
    data: {
      title,
      content,
      language,
      categoryId: parseInt(categoryId),
    },
  });

  res.json(snippet);
});

router.put("/snippets/:snippetId", async (req, res, next) => {
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


///////////////////////////////

// Create a snippet 
router.post("/snippets", async (req, res, next) => {
  const { title, content, language, categoryId } = req.body;

  // Validate the snippet data
  const validationResult = SnippetValidator.parse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      errors: validationResult.errors,
    });
  }

  const snippet = await prisma.snippet.create({
    data: {
      title,
      content,
      language,
      categoryId: parseInt(categoryId),
    },
  });

  res.json(snippet);
});
//modifier 

router.put("/snippets/:snippetId", async (req, res, next) => {
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

















export default router;