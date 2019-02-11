const express = require("express");
const router = express.Router();
const passport = require("passport");

//Load Model
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//Validation
const validatePostInput = require("../../validation/post");

//@route  GET api/posts/test
//@desc  TEST post route
//@access public
router.get("/test", (req, res) => {
    res.json({msg: "Posts works"});
});

//@route  POST api/posts/
//@desc   Create Post
//@access private
router.post(
    "/",
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const {errors, isValid} = validatePostInput(req.body);
        if (!isValid) {
            res.status(400).json(errors);
        }
        const newPost = new Post({
            text: req.body.text,
            name: req.body.name,
            user: req.body.user,
            avatar: req.body.avatar
        });
        newPost.save().then(post => {
            res.json(post);
        });
    }
);

//@route  GET api/posts/
//@desc   Get Posts
//@access public
router.get("/", (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({msg: "No posts found"}));
});

//@route  GET api/posts/:post_id
//@desc   Get Post by id
//@access public
router.get("/:post_id", (req, res) => {
    Post.findById(req.params.post_id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({msg: "No post found with the id"}));
});

//@route  DELETE api/posts/:post_id
//@desc   Delete Post by id
//@access private
router.delete(
    "/:post_id",
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        Profile.findOne({user: req.user.id}).then(profile => {
            Post.findById(req.params.post_id).then(post => {
                //check post owner
                if (post.user.toString() !== req.user.id) {
                    res.status(401).json({msg: "User not authorized"});
                }
                post
                    .remove()
                    .then(() => res.json({msg: "Success"}))
                    .catch(err => res.status(404).json({msg: "Post not found"}));
            });
        });
    }
);

//@route  POST api/posts/like/:post_id
//@desc   Like post
//@access private
router.post(
    "/like/:post_id",
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        Profile.findOne({user: req.user.id}).then(profile => {
            Post.findById(req.params.post_id).then(post => {
                if (
                    post.likes.filter(like => like.user.toString() === req.user.id)
                        .length > 0
                ) {
                    res
                        .status(400)
                        .json({alreadyLiked: "User already liked this post"});
                }
                // Add user to likes
                post.likes.unshift({user: req.user.id});
                post.save().then(post => res.json(post));
            });
        });
    }
);

//@route  POST api/posts/unlike/:post_id
//@desc   Unlike post
//@access private
router.post(
    "/unlike/:post_id",
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        Profile.findOne({user: req.user.id}).then(profile => {
            Post.findById(req.params.post_id).then(post => {
                if (
                    post.likes.filter(like => like.user.toString() === req.user.id)
                        .length === 0
                ) {
                    res.status(400).json({notLiked: "User has not liked this post"});
                }
                // Add user to likes
                const removeIndex = post.likes
                    .map(item => item.user.toString())
                    .indexOf(req.user.id);

                post.likes.splice(removeIndex, 1);
                post.save().then(post => res.json(post));
            });
        });
    }
);

//@route  POST api/posts/comment/:post_id
//@desc   Add comment to a post
//@access private
router.post('/comment/:post_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);
    if (!isValid) {
        res.status(400).json(errors);
    }

    Post.findById(req.params.post_id).then(post => {
        const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        };
        //Add comments to array
        post.comments.unshift(newComment);

        //save
        post.save().then(post => res.json(post))
    }).catch(err => res.status(404).json({postNotFound: 'No post found with this id'}));
});

//@route  DELETE api/posts/comment/:post_id/:comment_id
//@desc   Remove comment from a post
//@access private
router.delete('/comment/:post_id/:comment_id'
    , passport.authenticate('jwt', {session: false})
    , (req, res) => {

        Post.findById(req.params.post_id).then(post => {
            //Check if comment exists
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                res.status(404).json({commentNotExists: 'Comment does not exist'});
            }
            //Get remove index
            const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);
            //Splice
            post.comments.splice(removeIndex, 1);
            post.save().then(post => res.json(post));
        }).catch(err => res.status(404).json({postNotFound: 'No post found with this id'}));
    });

module.exports = {
    router
};
