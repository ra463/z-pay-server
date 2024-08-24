const User = require("../models/User");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

exports.addComment = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new ErrorHandler("Blog not found", 404));

  const { text } = req.body;
  if (!text) return next(new ErrorHandler("Please enter text", 400));

  const comment = await Comment.create({
    user: user._id,
    blog: blog._id,
    text,
  });

  res.status(200).json({ success: true, comment, message: "Comment added" });
});

exports.getComments = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new ErrorHandler("Blog not found", 404));

  const comments = await Comment.find({ blog: blog._id }).populate(
    "user",
    "name"
  );
  res.status(200).json({ success: true, comments });
});

exports.deleteComment = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const comment = await Comment.findById(req.params.id);
  if (!comment) return next(new ErrorHandler("Comment not found", 404));

  if (comment.user.toString() !== user._id.toString())
    return next(
      new ErrorHandler("You are not authorized to delete this comment", 403)
    );

  await comment.deleteOne();
  res.status(200).json({ success: true, message: "Comment deleted" });
});
