var mysql = require('mysql');

var options = {
  host: 'localhost',
  user: 'lupeng',
  password: '080910',
  database: 'vote'
}

// 获取数据库对象
function getConn (){
  var client = mysql.createConnection(options);
  return client;
}

/* --------------------------BEGIN USER----------------------------------- */
// 查找所有用户
exports.findUser = function (callback){
  var client = getConn();
  var selectstatement = 'select * from user';
  client.query(selectstatement, function(errs,rows,fields){
    callback(errs,rows);
  });
  client.end();
}

// 得到管理员帐户
exports.getAdmin = function(callback){
  var client = getConn();
  var statement = 'select username,password from user where Id = 1';
  client.query(statement, function(errs,rows,fields){
    callback(errs,rows);
  });
  client.end();
}

/* --------------------------END USER----------------------------------- */

/* --------------------------BEGIN Message----------------------------------- */
// 根据Message ID查找数据
exports.getMessageById = function(Id,callback){
  var client = getConn();
  var statement = 'select * from message where Id = ' + Id;
  client.query(statement, function(errs, rows, fields){
    callback(errs,rows);
  });
  client.end();
}

// 按id倒序查找所有的Message
exports.getAllMessage = function(callback){
  var client = getConn();
  var statement = 'select * from message order by Id desc';
  client.query(statement, function(errs,rows,fields){
    callback(errs,rows);
  });
  client.end();
}

// 新建一条Message
exports.addMessage = function(title,author,average,status,createTime,callback){
  var client = getConn();
  var statement = 'insert into message (title,author,average,status,createTime) values ("'
        + title + '","' 
        + author + '",' 
        + average + ',"' 
        + status + '","' 
        + createTime + '")';
  client.query(statement, function(errs,rows,fields){
    if (errs) {
      callback(errs);
    }else{
      callback('success');
    }
  });
  client.end();
}

// 根据id删除Message
exports.delMessage = function(Id,callback){
  var client = getConn();
  var statement = 'delete from message where Id = ' + Id;
  client.query(statement, function(errs,rows,fields){
    if (errs) {
      callback(errs);
    }else{
      callback('success');
    }
  });
  client.end();
}

// 根据id修改Message
exports.editMessage = function(Id,title,author,status,callback){
  var client = getConn();
  var statement = 'update message set title = "' + title + '",author = "' + author + '",status = ' + status + ' where Id = ' + Id;
  client.query(statement, function(errs,rows,fields){
    if(errs){
      callback(errs);
    }else{
      callback('success');
    }
  });
  client.end();
}
/* --------------------------END Message----------------------------------- */


/* --------------------------BEGIN 评分----------------------------------- */
// 插入评分记录
exports.addVote = function(titleId, voteIp, voteTime, voteScore, callback){
  var client = getConn();
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
  client.end();
}

// 删除评分记录
exports.delVote = function(voteId, callback){
  var client = getConn();
  var statement = 'delete from vote where Id = ' + voteId;
  client.query(statement, function(errs,result){
    if (errs) {
      callback(errs);
    }else{
      callback('success');
    }
  });
  client.end();
}

// 获取评分平均值
exports.getAverage = function(titleId,callback){
  var client = getConn();
  var statement = 'select avg(voteScore) average from vote v , message m where v.titleId = m.Id and v.titleId = ' + titleId;
  client.query(statement, function(errs,rows,fields){
    callback(errs,rows);
  });
  client.end();
}

// 更新平均分
exports.updateAverage = function (Id , average, callback){
  var client = getConn();
  var statement = 'update message set average = ' + average + ' where Id = ' + Id;
  client.query(statement, function(errs,rows,fields){
    if(errs){
      callback(errs);
    }else{
      callback('success');
    }
  });
  client.end();
}

// 获取评分记录
exports.getVotes = function(Id, callback){
  var client = getConn();
  var statement = 'select m.Id Id, m.title, m.author, m.average, m.status, v.Id voteId, v.voteIp, v.voteScore, v.voteTime from message m, vote v where m.Id = v.titleId and m.Id=' + Id + ' order by v.Id desc';
  client.query(statement, function (errs, rows) {
    callback(errs,rows);
  });
  client.end();
}

// 获取评分数量
exports.getVotesNum = function(Id, callback){
  var client = getConn();
  var statement = 'select count(*) voteNum from vote where titleId=' + Id;
  client.query(statement, function (errs, rows) {
    callback(errs,rows);
  });
  client.end();
}

// 查看是否已经评分
exports.isVote = function (titleId, voteIp, callback){
  var client = getConn();
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
  client.end();
}

/* --------------------------END 评分----------------------------------- */


/* --------------------------BEGIN Ajax----------------------------------- */

/* --------------------------END Ajax----------------------------------- */