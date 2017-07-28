var router = require('express').Router();
var sqlite = require('sqlite-sync');
var functions = require('../libs/functions');
var db = null;

/* GET wide alert page. */
router.post('/', function (req, res) {
	sqlite.connect('db/wallpapers.db');

	var sql = "SELECT * FROM photos WHERE id in (select photo_id from category_photos where category_id=2) ORDER BY `id` DESC LIMIT " + req.body.start + ", " + req.body.count;
	var result = sqlite.run(sql);
	var images = [];
	for (var i = 0; i < result.length; i++) {
		var row = result[i];

		images.push({
			"id": row.id,
			"thumb": "/photos/" + row.id + "." + row.ext,
			"original": "/photos/" + row.id + "." + row.ext
		});
	}

	sqlite.close();
	functions.responseJSON(res, images);
});

module.exports = router;