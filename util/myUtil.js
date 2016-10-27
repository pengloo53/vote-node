exports.getTime = function(date){
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();
  var hour = date.getHours();
  hour = hour<10?'0'+hour:hour;
  var minute = date.getMinutes();
  minute = minute<10?'0'+minute:minute;
  return year+'年'+month+'月'+day+'日 '+hour+':'+minute;
};

exports.getIp = function(req){
  var remoteIp = req.ip.match(/\d+\.\d+\.\d+\.\d+/);
  if(remoteIp){
    return remoteIp;
  }else{
    return '127.0.0.1';
  }
}