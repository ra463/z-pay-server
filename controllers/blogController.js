const User = require("../models/User");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Blog = require("../models/Blog");
const { getDataUri } = require("../utils/dataUri");
const cloudinary = require("cloudinary");
const Comment = require("../models/Comment");

exports.createBlog = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const { title, description, genure } = req.body;
  if (!title || !description || !genure)
    return next(new ErrorHandler("Please enter title/description", 400));

  const files = req.files;
  if (!files)
    return next(new ErrorHandler("Please add atleast one image", 400));

  let imagesInfo = [];

  for (let i = 0; i < files.length; i++) {
    const newPath = await getDataUri(files[i]);
    const result = await cloudinary.v2.uploader.upload(newPath.content, {
      folder: "zupay",
    });
    imagesInfo.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  const blog = await Blog.create({
    user: user._id,
    title,
    genure,
    description,
    images: imagesInfo,
  });

  user.blogs.push(blog._id);
  await user.save();

  res.status(201).json({ success: true, message: "Blog created successfully" });
});

exports.getBlog = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id)
    .populate("user", "name")
    .lean();
  if (!blog) return next(new ErrorHandler("Blog not found", 404));

  res.status(200).json({ success: true, blog });
});

exports.getAllBlogs = catchAsyncError(async (req, res, next) => {
  const { title, genure, resultPerPage, currentPage } = req.query;
  const query = {};

  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  if (genure) {
    query.genure = { $regex: genure, $options: "i" };
  }

  const blogsCount = await Blog.countDocuments(query);

  const limit = Number(resultPerPage);
  const page = Number(currentPage);
  const skip = (page - 1) * limit;

  const blogs = await Blog.find(query)
    .populate("user", "name")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  const filteredBlogs = blogs.length;

  res.status(200).json({
    success: true,
    blogs,
    blogsCount,
    filteredBlogs,
  });
});

exports.getUserBlogs = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const blogs = await Blog.find({ user: user._id })
    .sort({ createdAt: -1 })
    .lean();
  res.status(200).json({ success: true, blogs });
});

exports.updateBlog = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new ErrorHandler("Blog not found", 404));

  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (blog.user.toString() !== user._id.toString())
    return next(
      new ErrorHandler("You are not authorized to update this blog", 403)
    );

  const { genure, title, description } = req.body;

  const files = req.files;
  let imagesInfo = blog.images;

  if (files) {
    for (let i = 0; i < files.length; i++) {
      const newPath = await getDataUri(files[i]);
      const result = await cloudinary.v2.uploader.upload(newPath.content, {
        folder: "zupay",
      });

      imagesInfo.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }

  if (title) blog.title = title;
  if (genure) blog.genure = genure;
  if (description) blog.description = description;
  if (imagesInfo) blog.images = imagesInfo;

  await blog.save();

  res.status(200).json({ success: true, message: "Blog updated successfully" });
});

exports.deleteBlog = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new ErrorHandler("Blog not found", 404));

  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (blog.user.toString() !== user._id.toString())
    return next(
      new ErrorHandler("You are not authorized to delete this blog", 403)
    );

  if (blog.images.length > 0) {
    for (let i = 0; i < blog.images.length; i++) {
      await cloudinary.v2.uploader.destroy(blog.images[i].public_id);
    }
  }

  const comments = await Comment.find({ blog: blog._id });
  if (comments.length > 0) {
    for (let i = 0; i < comments.length; i++) {
      await comments[i].deleteOne();
    }
  }

  await blog.deleteOne();
  res.status(200).json({ success: true, message: "Blog deleted successfully" });
});
