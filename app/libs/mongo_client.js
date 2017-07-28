/**
 * Custom node module for mongodb.
 * 
 * @author WenZhe.
 */

var functions = require("./functions");

var MongoDB = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var mongoClient = new MongoDBClient();
module.exports = mongoClient;

var dbConfig = functions.getConfigs("mongodb");
mongoClient.init(dbConfig.host, dbConfig.port, dbConfig.dbname);

function MongoDBClient() {
  return {
    db_host: "",
    db_port: "",
    db_name: "",

    db_con: null,

    tables: {
      'users': 'users',
    },
    init: function (db_host, db_port, db_name) {
      this.db_host = db_host;
      this.db_port = db_port;
      this.db_name = db_name;
    },
    connect: function (call_back) {      
      MongoDB.connect("mongodb://" + mongoClient.db_host + ":" + mongoClient.db_port + "/" + mongoClient.db_name, function (err, db) {

        if (err)
          throw err;

        mongoClient.db_con = db;

        call_back();
      });
    },
    close: function () {      
      if (mongoClient.db_con) {
        mongoClient.db_con.close();
        mongoClient.db_con = null;
      }
    },
    collection: function (table, callback_func) {
      if (mongoClient.db_con) {
        mongoClient.db_con.collection(table, function (err, collection) {
          if (err) {
            mongoClient.close();
            throw err;
          }

          callback_func(collection);
        });
      } else {
        mongoClient.connect(function () {
          mongoClient.collection(table, callback_func);
        });
      }
    },
    count: function (table, where, callback_func) {
      mongoClient.collection(table, function (collection) {
        if (where) {
          collection.count(where, function (err, count) {
            if (err) {
              mongoClient.close();
              throw err;
            }

            callback_func(count, collection);
          });
        } else {
          collection.count(function (err, count) {
            if (err) {
              mongoClient.close();
              throw err;
            }

            callback_func(count, collection);
          });
        }
      });
    },
    count1: function (table, where, callback_func) {
      mongoClient.count(table, where, function (count, collection) {
        mongoClient.close();
        callback_func(count);
      });
    },
    get_new_id: function (table, callback_func) {
      mongoClient.collection(table, function (collection) {
        collection.find({}, {sort: [["id", "desc"]], limit: 1}).toArray(function (err, result) {
          if (err) {
            mongoClient.close();
            throw err;
          }

          if (result && result.length > 0) {
            callback_func(result[0].id + 1, collection);
          } else {
            callback_func(1, collection);
          }
        });
      });
    },
    get_new_id1: function (table, where, callback_func) {
      mongoClient.get_new_id(table, where, function (newid, collection) {
        mongoClient.close();
        callback_func(newid);
      });
    },
    get_by_id: function (table, id, callback_func) {
      mongoClient.collection(table, function (collection) {
        collection.find({_id: new ObjectID(id)}).toArray(function (err, result) {
          if (err) {
            mongoClient.close();
            throw err;
          }

          if (result.length === 0) {
            callback_func(false, collection);
          } else {
            callback_func(result[0], collection);
          }
        });
      });
    },
    get_by_id1: function (table, id, callback_func) {
      mongoClient.get_by_id(table, id, function (result, collection) {
        mongoClient.close();
        callback_func(result);
      });
    },
    find: function (table, query, options, callback_func) {
      mongoClient.collection(table, function (collection) {
        collection.find(query, options).toArray(function (err, result) {
          if (err) {
            mongoClient.close();
            throw err;
          }

          callback_func(result, collection);
        });
      });
    },
    find1: function (table, query, options, callback_func) {
      mongoClient.find(table, query, options, function (result, collection) {
        mongoClient.close();
        callback_func(result);
      });
    },
    clear_table: function (table, callback_func) {
      mongoClient.collection(table, function (collection) {
        collection.remove(function (err, result) {
          if (err) {
            mongoClient.close();
            throw err;
          }

          callback_func(collection);
        });
      });
    },
    clear_table1: function (table, callback_func) {
      mongoClient.clear_table(table, function (collection) {
        mongoClient.close();

        if (callback_func) {
          callback_func();
        }
      });
    },
    insert: function (table, values, callback_func) {
      mongoClient.collection(table, function (collection) {
        collection.insert(values, function (err, res) {
          if (err) {
            mongoClient.close();
            throw err;
          }

          callback_func(res);
        });
      });
    },
    insert1: function (table, values, callback_func) {
      mongoClient.insert(table, values, function (res) {
        mongoClient.close();

        if (callback_func) {
          callback_func(res.insertedIds);
        }
      });
    },
    update: function (table, where, values, callback_func) {
      mongoClient.collection(table, function (collection) {
        var newvalues = {
          $set: values
        };

        collection.update(where, newvalues, function (err, res) {
          if (err) {
            mongoClient.close();
            throw err;
          }

          callback_func(res, collection);
        });
      });
    },
    update1: function (table, values, callback_func) {
      mongoClient.udpate(table, values, function (res) {
        mongoClient.close();

        if (callback_func) {
          callback_func(res);
        }
      });
    },
    delete: function (table, where, callback_func) {
      mongoClient.collection(table, function (collection) {
        collection.remove(where, function (err, res) {
          if (err) {
            mongoClient.close();
            throw err;
          }

          callback_func(res, collection);
        });
      });
    },
    delete1: function (table, where, callback_func) {
      mongoClient.delete(table, where, function (res) {
        mongoClient.close();

        if (callback_func) {
          callback_func(res);
        }
      });
    },
    import_csv: function (table, data, callback_func) {
      mongoClient.get_new_id(table, function (collection, new_id) {
        var _index = 0;
        var imported_count = 0;

        var importedOne = function () {
          _index++;

          if (_index == data.length) {
            callback_func(imported_count);

            return;
          }

          var item = data[_index];
          if (item.id) {
            item.id = item.id * 1;
            var where = {id: item.id};
            collection.count(where, function (error, count) {
              if (count == 0) {
                collection.insert(item, function (err, result) {
                  if (err) {

                  } else {
                    imported_count++;
                  }

                  importedOne();
                });
              } else {
                collection.update(where, item, function (err, result) {
                  if (err) {

                  } else {
                    imported_count++;
                  }

                  importedOne();
                });
              }
            });
          } else {
            item.id = new_id;
            collection.insert(item, function (err, result) {
              if (err) {

              } else {
                imported_count++;
              }

              new_id++;
              importedOne();
            });
          }

        };

        importedOne();
      });
    }
  };
}