/**
 * Created by 118663 on 2016/10/27.
 */
/* --------------------------BEGIN USER----------------------------------- */
var connect = require('./connect.js');

// 查找所有用户
exports.findUser = function (callback){
  var client = connect.getConn();
  var selectstatement = 'select * from user';
  client.query(selectstatement, function(errs,rows,fields){
    callback(errs,rows);
  });
  connect.endConn(client);
};

// 得到管理员帐户
exports.getAdmin = function(callback){
  var client = connect.getConn();
  var statement = 'select username,password from user where Id = 1';
  client.query(statement, function(errs,rows,fields){
    callback(errs,rows);
  });
  connect.endConn(client);
};

/* --------------------------END USER----------------------------------- */