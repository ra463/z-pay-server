const express = require("express");
const {
  addComment,
  deleteComment,
  getComments,
} = require("../controllers/commentController");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/add-comment/:id", auth, addComment);
router.get("/get-comments/:id", getComments);
router.delete("/delete-comment/:id", auth, deleteComment);

module.exports = router;
