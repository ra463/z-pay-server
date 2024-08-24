const express = require("express");
const {
  createBlog,
  getBlog,
  getAllBlogs,
  getUserBlogs,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { auth } = require("../middlewares/auth");
const upload = require("../middlewares/multer");

const router = express.Router();

router.post("/add-blog", auth, upload, createBlog);
router.get("/get-blog/:id", getBlog);
router.get("/get-all-blogs", getAllBlogs);
router.get("/get-user-blogs", auth, getUserBlogs);
router.put("/update-blog/:id", auth, upload, updateBlog);
router.delete("/delete-blog/:id", auth, deleteBlog);

module.exports = router;
