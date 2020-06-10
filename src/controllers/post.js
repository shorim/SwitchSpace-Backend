"use strict";

//const multer = require("multer");
//const upload = multer({ dest: "public/images/postsGallery" });
//const type = upload.array("photos");
//const fs = require("fs");
const PostModel = require("../models/schema/post");
const PostValidator = require("../models/validations/post");

// ********************************************************************************************************* //

// cretae a post
const create = async (req, res) => {
  req.body.creatorID = req.userId;
  // validate the post form
  const validationVerdict = PostValidator.validate(req.body);
  // check whether the form is incomplete
  if (validationVerdict.error) {
    return res.status(400).json({
      message: validationVerdict.error.details[0].message,
    });
  }

  // create post with its complete attributes
  try {
    let post = await PostModel.create(req.body);
    return res.status(201).json({
      data: post,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ********************************************************************************************************* //

// view a specific post
const ViewPostDetails = async (req, res) => {
  try {
    let post = await PostModel.findById(req.headers.id).exec();

    if (!post)
      return res.status(404).json({
        message: "Post not found",
      });

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ********************************************************************************************************* //

// update a post
const update = async (req, res) => {
  // validate post form
  const validationVerdict = PostValidator.validate(req.body);
  // check whether the form is incomplete
  if (validationVerdict.error) {
    return res.status(400).json({
      message: validationVerdict.error.details[0].message,
    });
  }
  // check that there's a post of this onwer
  try {
    let ownerPost = await PostModel.findOne({
      creatorID: req.userId,
      _id: req.headers.id,
    });
    if (!ownerPost) {
      return res.status(403).json({
        message: "Cannot find user and post combination",
      });
    }
  } catch (err) {
    console.log("here");
    return res.status(400).json({
      message: "Internal server error",
    });
  }
  try {
    req.body.creatorID = req.userId;
    let post = await PostModel.findByIdAndUpdate(req.headers.id, req.body, {
      new: true,
      runValidators: true,
    }).exec();
    return res.status(200).json({
      data: post,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ********************************************************************************************************* //

// delete a post
const remove = async (req, res) => {
  // check that there's a post of this onwer
  try {
    await PostModel.find({
      creatorID: req.userId,
      _id: req.headers.id,
    });
  } catch (err) {
    return res.status(403).json({
      message: "Cannot find user and post combination",
    });
  }
  // the owner has this post, delte it
  try {
    await PostModel.findByIdAndRemove(req.headers.id).exec();
    return res.status(200).json({
      message: "Deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const ViewAll = async (req, res) => {
  try {
    let posts = await PostModel.find({ creatorID: req.userId }).exec();
    if (!posts)
      return res.status(404).json({
        message: "Posts not found",
      });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  create,
  ViewPostDetails,
  update,
  remove,
  ViewAll,
};
