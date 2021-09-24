const express = require("express");
const bcrypt = require('bcrypt');
const Board = require('../schemas/board');
const router = express.Router();

router.get("/lists", async (req, res, next) => {
    try {
      const lists = await Board.find({showing: 1}).sort("-postId");
      res.json({ lists: lists });
      console.log(lists);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  router.get("/lists/:postId", async (req, res) => {
    const { postId } = req.params;
    let posted = await Board.findOne({ postId: postId });
    res.json({ detail: posted });
  });

  router.post("/compare/:postId", async (req, res) => {
    const { postId } = req.params;
    const { password } = req.body;
    let posted = await Board.findOne({ postId: postId });
    let flag = 0;
    console.log(password);
    console.log(posted['password']);
    bcrypt.compare(password, posted['password'], function(err, msg){
        if(msg === true){
          console.log('비번맞음');
          res.send({ result: "success" });
        }
        else{
          res.send({ result: "fail" });
        }
    })
  });


  router.get("/modify/:postId", async (req, res) => {
    const { postId } = req.params;
    let posted = await Board.findOne({ postId: postId });
    res.json({ modify: posted });
  });

  router.patch("/modifying/:postId", async (req, res) => {
    const { postId } = req.params;
    const { title, name, comment, date, showing } = req.body;
    await Board.updateOne({postId},{$set : {title, name, comment, date, showing}});
    res.send({ result: "success" });
  });

  router.patch("/delete/:postId", async (req, res) => {
    const { postId } = req.params;
    const { showing } = req.body;
    await Board.updateOne({postId},{$set : {showing}});
    res.send({ result: "success" });
  });

  router.get('/listsCount', async(req, res, next) => {
    try {
        const lists = await Board.find();
        let listCount = lists.length;
        res.json({ count: listCount });
      } catch (err) {
        console.error(err);
        next(err);
      }
  })

  router.post('/posting', async (req, res) => {
    const { postId, title, name, comment, date, showing } = req.body;
    let { password } = req.body;
    isExist = await Board.find({ postId });
    const encryptedPassowrd = bcrypt.hashSync(password, 10);
    password = encryptedPassowrd;
    if (isExist.length === 0) {
      await Board.create({ postId, title, name, password, comment, date, showing });
    }
    res.send({ result: "success" });
  });

  module.exports = router;