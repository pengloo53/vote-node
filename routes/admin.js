var express = require('express');
var router = express.Router();
var db = require('../db/vote.js');

/* 登陆权限 */
router.use(function (req, res, next) {
  db.getAdmin(function (errs, rows) {
    if (errs) {
      res.render('error', {
        message: errs,
        error: {}
      });
    } else {
      var username = rows[0].username;
      var password = rows[0].password;
      if (req.session && req.session.username == username && req.session.password == password) {
        next();
      } else {
        res.render('login', {
          title: '后台登陆',
          info: '请登陆'
        });
      }
    }
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  db.getAllMessage(function(errs,rows){
    if(!errs){
      res.render('admin',{
        title: '后台首页',
        messages: rows
      });
    }
  });
});

/* GET add page */
router.get('/add',function(req,res,next){
  res.render('add',{
    title: '后台-add'
  });
})

/* GET edit page */
router.get('/edit',function(req,res,next){
  var editId = req.query.Id;
  db.getMessageById(editId, function(errs,rows){
    if(!errs){
      res.render('edit',{
        title: '后台-edit',
        message: rows[0]
      });
    }
  });
})


/* POST add page, add new message */
router.post('/add',function(req,res,next){
  var title = req.body.title;
  var author = req.body.author;
  var status = 1; // 状态1代表可投票状态，2代表关闭状态
  var average = 0; // 新建Message评分为0
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth()+1;
  var day = now.getDate();
  var createTime = year+'年'+month+'月'+day+'日';
  db.addMessage(title,author,average,status,createTime,function(result){
    console.log('---------add: ' + result);
    if(result == 'success'){
      res.redirect('/admin');
    }else{
      res.render('error', {
        message: result,
        error: {}
      });
    }
  });
});

/* POST del  */
router.post('/del', function(req,res,next){
  var delId = req.body.Id;
  db.delMessage(delId,function(result){
    console.log('---------del: ' + result);
    if(result == 'success'){
      res.redirect('/admin');
    }else{
      res.render('error', {
        message: result,
        error: {}
      });
    }
  });
});

/* POST edit */
router.post('/edit',function(req,res,next){
  var editId = req.body.Id;
  var title = req.body.title;
  var author = req.body.author;
  var status = req.body.status;
  db.editMessage(editId,title,author,status,function(result){
    console.log('---------edit: ' + result);
    if(result == 'success'){
      res.redirect('/admin');
    }else{
      res.render('error', {
        message: result,
        error: {}
      });
    }
  });
});

module.exports = router;