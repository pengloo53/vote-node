var express = require('express');
var util = require('util');
var router = express.Router();
var db = require('../db/db.js');

function displayAllMessage(res,info){
  db.getAllMessage(function(errs,rows){
    if(!errs){
      res.render('index',{
        title: '评分首页',
        messages: rows,
        info: info
      })
    }else{
      res.render('error', {
        message: errs.message,
        error: errs
      });
    }
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  displayAllMessage(res,null);
});

/* GET show page */
router.get('/show/:id', function(req,res,next){
  var Id = req.params.id;
  console.log("-------------------:" + Id);
  db.getVotes(Id, function (errs, rows) {
    console.log('-----------------------getVotes: ' + errs + ', ' + Id);
    if (!errs){
      db.getVotesNum(Id,function(errs,rows_num){
        var voteNum = rows_num[0].voteNum;
        if (req.session.username && req.session.username == 'admin'){
          console.log('-------------------------------------------------------user = admin');
          res.render('show',{
            title: '显示评分详情',
            votes: rows,
            voteNum: voteNum,
            isAdmin: true
          });
        }else{
          res.render('show', {
            title: '显示评分详情',
            votes: rows,
            voteNum: voteNum,
            isAdmin: false
          });
        }
      });
    }else{
      res.render('error', {
        message: errs,
        error: {}
      });
    }
  });
});

/* POST show : del vote */
router.post('/show/:id', function(req,res,next){
  var voteId = req.params.id;
  var titleId = req.body.titleId;
  db.delVote(voteId,function(result){
    console.log('-------------------------del vote: ' + result);
    if(result == 'success'){
      db.getAverage( titleId, function(errs,rows){
        console.log(rows[0].average);
        if(rows){
          var average = rows[0].average;
          db.updateAverage(titleId, average, function(result1){
            console.log('---------update average: ' + result1);
            if(result1 == 'success'){
              // res.redirect('/');
              res.redirect('/show/'+ titleId);
            }else{
              res.render('error', {
                message: result1,
                error: {}
              });
            }
          });
        }
      });
    }else{
      res.render('error', {
        message: errs,
        error: {}
      });
    }
  });
});

/* POST vote */
router.post('/', function(req,res,next){
  var titleId = req.body.titleId;
  var voteScore = req.body.voteOptions;
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth()+1;
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var voteTime = year+'年'+month+'月'+day+'日 '+hour+':'+minute;
  var voteIp = req.ip.match(/\d+\.\d+\.\d+\.\d+/)?req.ip.match(/\d+\.\d+\.\d+\.\d+/):'127.0.0.1';
  console.log(titleId + ',' + voteIp + ','+ voteTime + ',' + voteScore);
  if(voteScore){
    db.isVote(titleId,voteIp,function(result){
      console.log('------------------------isVote: ' + result);
      if(util.isBoolean(result) && result){
        db.addVote(titleId,voteIp,voteTime,voteScore,function(result){
          console.log('---------vote: ' + result);
          if(result == 'success'){
            db.getAverage( titleId, function(errs,rows){
              console.log(rows[0].average);
              if(rows){
                var average = rows[0].average;
                db.updateAverage(titleId, average, function(result){
                  console.log('---------update average: ' + result);
                  if(result == 'success'){
                    // res.redirect('/');
                    displayAllMessage(res,'评分成功');
                  }else{
                    res.render('error', {
                      message: result,
                      error: {}
                    });
                  }
                });
              }
            });
          }else{
            res.render('error', {
              message: result,
              error: {}
            });
          }
        });
      }else if(util.isBoolean(result) && !result){
        displayAllMessage(res,'请不要重复评分');
      }else{
        displayAllMessage(res,result);
      }
    });
  }else{
    displayAllMessage(res,'请选择评分');
  }


});

/* GET login */
router.get('/login', function(req,res,next){
  res.render('login',{
    title: "后台登陆",
    info: null
  });
});

/* POST login */
router.post('/login',function(req,res,next){
  var username = req.body.username;
  var password = req.body.password;
  db.getAdmin( function(errs,rows){
    console.log("----------------rows:" + util.inspect(rows));
    if(!errs){
      console.log(util.inspect(req.session));
      console.log("-------------------rows: " + rows[0].username);
      if(rows[0].username == username && rows[0].password == password){
        req.session.username = username;
        req.session.password = password;
        console.log(util.inspect(req.session));
        res.redirect('/admin');
      }else{
        res.render('login',{
          title: '后台登陆',
          info: '用户名或者密码不对，请重新登陆'
        });
      }
    }else{
      res.render('error', {
        message: errs,
        error: {}
      });
    }
  });
});

/* Ajax 前台请求 for vote */
/*router.get('/voteajax' , function(req,res,next){
  var titleId = req.params.Id;
  var voteIp = req.ip.match(/\d+\.\d+\.\d+\.\d+/)?req.ip.match(/\d+\.\d+\.\d+\.\d+/):'127.0.0.1';
  db.isVote( titleId, voteIp, function(result){
    console.log('--------------------isVote:' + result);
    if(util.isBoolean(result) && result){
      res.end('请不要重复评分');
    }else if(util.isBoolean(result) && !result){
      res.end('评分成功');
    }else{
      res.render('error', {
        message: result,
        error: {}
      });
    }
  });
});*/

module.exports = router;
