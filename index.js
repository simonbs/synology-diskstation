var http = require('http')
var wol = require('wake_on_lan')

function Synology(ipAddress, port) { 
  this.ipAddress = ipAddress
  this.port = port
}

Synology.prototype.request = function(options, callback) {
  var method = options.method || 'GET'
  var headers = options.headers || {}
  var body = options.body || null
  if (method == 'POST') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if (body != null) {
      headers['Content-Length'] = Buffer.byteLength(options.body)
    }
  } 
  var reqOptions = {
    host: this.ipAddress,
    port: this.port,
    path: options.path,
    method: method,
    headers: headers
  }
  var req = http.request(reqOptions, function(res) {
    if (res.statusCode != 200) {
      return callback({
        type: 'http',
        code: res.statusCode
      })
    }
    res.setEncoding('utf8')
    res.on('data', function(data) {
      var json = JSON.parse(data)
      if (json.error != null) {
        return callback({
          type: 'api',
          code: json.error.code
        })
      }
      callback(null, json)
    })
  })
  req.on('error', function(err) {
    callback({
      type: 'network',
      code: -1,
      message: err.message
    })
  })
  if (body != null) {
    req.write(body)
  }
  req.end()
}

Synology.prototype.login = function(account, password, callback) {
  var options = {
    path: '/webapi/auth.cgi?api=SYNO.API.Auth&version=2&method=login&account='+account+'&passwd='+password+'&format=cookie'
  }
  this.request(options, function(err, body) {
    if (err) {
      return callback(err)
    }
    callback(null, body.data.sid)
  })
}

Synology.prototype.shutdown = function(sid, callback) {
  var options = {
    path: '/webapi/entry.cgi',
    method: 'POST',
    headers: {
      'Cookie': 'id='+sid
    },
    body: 'api=SYNO.Core.System&method=shutdown&version=1'
  }
  this.request(options, function(err, body) {
    if (err) {
      return callback(err)
    }
    callback(null)
  })
}

Synology.prototype.wol = function(macAddress, callback) {
  wol.wake(macAddress, callback)
}

Synology.prototype.isOn = function(callback) {
  var options = {
    path: '/webman/pingpong.cgi'
  }
  this.request(options, function(err, body) {
    if (err) {
      return callback(err, false)
    }
    callback(null, body['boot_done'])
  })
}

module.exports = Synology

