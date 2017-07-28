module.exports = {
  responseJSON: function (res, data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
  }
}