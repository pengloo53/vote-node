/**
 * Created by 118663 on 2016/10/27.
 */
var mysql = require('mysql');

var options = {
  host: '10.20.1.150',
  user: 'lupeng',
  password: 'lupeng123',
  database: 'lupeng'
}

var connCount = 0;

exports.getConn = function(){
  connCount ++;
  return mysql.createConnection(options);
};

exports.endConn = function(conn){
  conn.end(function(err){
    if(!err){
      connCount --;
      console.log('........................................................END a connection, has '+ connCount + ' connection.');
    }
  });
};

function testMysql(){
  mysql.createConnection(options).query('select * from user', function(errs,rows,fields){
    console.log(rows);
    this.end();
  });
}

testMysql();
