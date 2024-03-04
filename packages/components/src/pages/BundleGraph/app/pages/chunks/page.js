var app = require('../../app');
var chunksGraph = require('../../graphs/chunks');

module.exports = function () {
  document.title = 'chunks';
  $('.page').html(
    require('./chunks.pug')({
      stats: app.stats,
    }),
  );
  chunksGraph.show();
  return function () {
    chunksGraph.hide();
  };
};
