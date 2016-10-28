var connect = require('./connect.js');

/* --------------------------BEGIN Message----------------------------------- */
// 根据Message ID查找数据
exports.getMessageById = function(Id,callback){
  var client = connect.getConn();
  var statement = 'select * from message where Id = ' + Id;
  client.query(statement, function(errs, rows, fields){
    callback(errs,rows);
  });
  connect.endConn(client);
};

// 按id倒序查找所有的Message
exports.getAllMessage = function(callback){
  var client = connect.getConn();
  var statement = 'select * from message order by Id desc';
  client.query(statement, function(errs,rows,fields){
    callback(errs,rows);
  });
  connect.endConn(client);
};

// 新建一条Message
exports.addMessage = function(title,author,average,status,createTime,callback){
  var client = connect.getConn();
  var statement = 'insert into message (title,author,average,status,createTime) values ("'
      + title + '","'
      + author + '",'
      + average + ',"'
      + status + '","'
      + createTime + '")';
  client.query(statement, function(errs,rows,fields){
    callback(errs,rows);
  });
  connect.endConn(client);
};

// 根据id删除Message
exports.delMessage = function(Id,callback){
  var client = connect.getConn();
  var statement = 'delete from message where Id = ' + Id;
  client.query(statement, function(errs,rows,fields){
    callback(errs,rows);
  });
  connect.endConn(client);
};

// 根据id修改Message
exports.editMessage = function(Id,title,author,status,callback){
  var client = connect.getConn();
  var statement = 'update message set title = "' + title + '",author = "' + author + '",status = ' + status + ' where Id = ' + Id;
  client.query(statement, function(errs,rows,fields){
    callback(errs,rows);
  });
  connect.endConn(client);
};
/* --------------------------END Message----------------------------------- */