const express = require("express");
const bcrypt = require('bcrypt');
const Board = require('../schemas/board');
const User = require("../schemas/user");
const Reply = require('../schemas/reply');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

//로그인 관련 API

router.post('/register', async(req, res) => {
  const {nickname, confirmPassword} = req.body;
  let { password } = req.body;
  if(password !== confirmPassword){
    res.status(400).send({
      errorMessage: '패스워드가 동일하지 않습니다.'
    });
    return;
  }

  const existUsers = await User.find({nickname});
  if(existUsers.length){
    res.status(400).send({
      errorMessage: '이미 동일한 닉네임이 존재합니다.'
    });
    return;
  }
  const encryptedPassowrd = bcrypt.hashSync(password, 10);
  password = encryptedPassowrd;
  const user = new User({nickname, password});
  await user.save();

  res.status(201).send({});
})

router.post('/auth' , async(req, res) => {
  const {nickname, password} = req.body;
  let passCheck = false;
  const user = await User.findOne({nickname}).exec();

  if(!user){
    res.status(400).send({
      errorMessage:'이메일 또는 패스워드가 잘못되었습니다'
    })
    return;
  }

  bcrypt.compare(password, user['password'], function(err, msg){
    if(msg === true){
      const token = jwt.sign({ userId: user.userId }, 'Mcc-Key');
      res.send({
        token,
      })
    }
    else{
      res.status(400).send({
        errorMessage:'이메일 또는 패스워드가 잘못되었습니다.'
      })
      return;
    }
  })
})

router.get('/users/chkLogin', authMiddleware, async(req, res) => {
  const { user } = res.locals;
  res.send({
    user: {
      userId : user.userId,
      nickname: user.nickname,
    }
  })
})

////Board 관련 API

router.get("/lists", async (req, res, next) => {
    try {
      const lists = await Board.find({showing: 1}).sort("-postId");
      res.json({ lists: lists });
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

  //댓글 관련 API
  router.get('/comment/:postId', async(req, res) => {
    const { postId } = req.params;
    let replyed = await Reply.find({ postId }).sort();
    res.json({ replyedlist: replyed });
  });

  router.post('/comment/posting', async(req, res) => {
    const { postId, userId, nickname, comment, showing} = req.body;
    await Reply.create({ postId, userId, nickname, comment, showing});
    res.send({ result: "success" });
  })

  router.patch("/modifyReply", async (req, res) => {
    const { replyId, comment } = req.body;
    await Reply.updateOne({_id: replyId},{$set : {comment}});
    res.send({ result: "success" });
  });

  router.patch("/deleteReply", async (req, res) => {
    const { replyId, showing } = req.body;
    console.log(replyId);
    await Reply.updateOne({_id: replyId},{$set : {showing}});
    res.send({ result: "success" });
  });
  module.exports = router;