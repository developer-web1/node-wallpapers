var router = require('express').Router();
var sqlite = require('sqlite-sync');
var functions = require('../libs/functions');
var db = null;

/* GET wide alert page. */
router.post('/', function (req, res) {
	sqlite.connect('db/wallpapers.db');

	var categoris = [];

	var root_categoris = sqlite.run("SELECT * FROM categories WHERE parent_id=0 ORDER BY name");
	if (root_categoris.length === 0) {
		sqlite.close();
		
		functions.responseJSON(res, categoris);
		return;
	}

	for (var i = 0; i < root_categoris.length; i++) {
		var root_cat = {
			"id": root_categoris[i].id,
			"name": root_categoris[i].name,
			"url": root_categoris[i].url,
			"sub_cats": []
		};

		var sub_categoris = sqlite.run("SELECT * FROM categories WHERE parent_id=" + root_categoris[i].id + " ORDER BY name");
		if (sub_categoris.length === 0) {
			continue;
		}

		for (var j = 0; j < sub_categoris.length; j++) {
			root_cat.sub_cats.push({
				"id": sub_categoris[j].id,
				"name": sub_categoris[j].name,
				"url": sub_categoris[j].url
			});
		}

		categoris.push(root_cat);
	}
	
	sqlite.close();
	functions.responseJSON(res, categoris);
});

module.exports = router;