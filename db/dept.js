var connect = require('./connect.js');

/* dept 数据表操作 */

// 增加
exports.addDept = function(id,deptname,plant){
  var client = connect.getConn();
  var statement = 'insert into dept ()'
};