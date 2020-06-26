"use strict";

const express = require("express");
const router = express.Router();
const logger = require("../middlewares/loggerHandler");

const multer = require("multer");
const upload = multer({dest: "public/images/postsGallery"});
const type = upload.array("photos");
const middlewares = require("../middlewares/middlewares");
const PostController = require("../controllers/post");
// multer for multiple file upload
const ImageUploader = require("../middlewares/ImageUploader");

router.post("/create", logger, ImageUploader.multiFileUpload, middlewares.checkAuthentication, type, PostController.create);
router.get("/view", logger, PostController.ViewPostDetails);
router.put("/update", logger, ImageUploader.multiFileUpload, middlewares.checkAuthentication, type, PostController.update);
router.delete("/delete", logger, middlewares.checkAuthentication, PostController.remove);
router.get("/view/all", logger, middlewares.checkAuthentication, PostController.ViewAll);
router.get("/search", logger, PostController.searchPosts);

module.exports = router;
