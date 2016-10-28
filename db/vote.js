var connect = require('./connect.js');

/* --------------------------BEGIN 评分----------------------------------- */
// 插入评分记录
exports.addVote = function(titleId, voteIp, voteTime, voteScore, callback){
  var client = connect.getConn();
  var statement = 'insert into vote (titleId,voteIp,voteTime,voteScore) values (' 
      + titleId + ',"'
      + voteIp + '","'
      + voteTime + '",'
      + voteScore + ')';
  client.query(statement, function(errs,rows,fields){
    if(errs){
      callback(errs);
    }else{
      callback('success');
    }
  });
  connect.endConn(client);
};

// 删除评分记录
exports.delVote = function(voteId, callback){
  var client = connect.getConn();
  var statement = 'delete from vote where Id = ' + voteId;
  client.query(statement, function(errs,result){
    if (errs) {
      callback(errs);
    }else{
      callback('success');
    }
  });
  connect.endConn(client);
};

// 获取评分平均值
exports.getAverage = function(titleId,callback){
  var client = connect.getConn();
  var statement = 'select avg(voteScore) average from vote v , message m where v.titleId = m.Id and v.titleId = ' + titleId;
  client.query(statement, function(errs,rows,fields){
    callback(errs,rows);
  });
  connect.endConn(client);
};

// 更新平均分
exports.updateAverage = function (Id , average, callback){
  var client = connect.getConn();
  var statement = 'update message set average = ' + average + ' where Id = ' + Id;
  client.query(statement, function(errs,rows,fields){
    if(errs){
      callback(errs);
    }else{
      callback('success');
    }
  });
  connect.endConn(client);
};

// 获取评分记录
exports.getVotes = function(Id, callback){
  var client = connect.getConn();
  var statement = 'select m.Id Id, m.title, m.author, m.average, m.status, v.Id voteId, v.voteIp, v.voteScore, v.voteTime from message m, vote v where m.Id = v.titleId and m.Id=' + Id + ' order by v.Id desc';
  client.query(statement, function (errs, rows) {
    callback(errs,rows);
  });
  connect.endConn(client);
};

// 获取评分数量
exports.getVotesNum = function(Id, callback){
  var client = connect.getConn();
  var statement = 'select count(*) voteNum from vote where titleId=' + Id;
  client.query(statement, function (errs, rows) {
    callback(errs,rows);
  });
  connect.endConn(client);
};

// 查看是否已经评分
exports.isVote = function (titleId, voteIp, callback){
  var client = connect.getConn();
  var statement = 'select count(*) voteNum from vote where titleId=' + titleId + ' and voteIp="' + voteIp + '"'; 
  client.query(statement, function(errs, rows, fields){
    if(errs){
      callback(errs);
    }else{
      if(rows[0].voteNum == 0){
        callback(true);
      }else{
        callback(false);
      }
    }
  });
  connect.endConn(client);
};

/* --------------------------END 评分----------------------------------- */


/* --------------------------BEGIN Ajax----------------------------------- */

/* --------------------------END Ajax----------------------------------- */