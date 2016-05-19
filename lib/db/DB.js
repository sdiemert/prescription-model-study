"use strict";
/**
 * Created by sdiemert on 2016-05-11.
 */

/**
 * @callback QueryCallback
 * @param err {string}
 * @param data {object}
 */

var sqlite3 = require("sqlite3").verbose();
var User    = require("../shared/User");
var Factory = require("../shared/Factory");
var Event   = require("../shared/Event");
var fs      = require('fs');
var async   = require('async');

class DBInterface {
    constructor(name) {
        this._name = name;
        this._db   = null;
        this.data  = null;
    }

    connect(cb) {
        this._db = new sqlite3.Database(this._name, sqlite3.OPEN_READWRITE, cb);
    }

    /**
     * Initializes the database with data from the file
     * at path. Deletes everything that was in that file.
     *
     * @param path {string}
     */
    init(path, cb) {

        var f     = JSON.parse(fs.readFileSync(path, 'utf-8'));
        this.data = f;

        var users     = this.extractUsers(f);
        var sequences = this.extractSequences(f);

        if (process.env.ARCHIVE !== "false") {
            this.__save(this._name, "database/archive");
        } else {
            console.log("process.ENV.ARCHIVE='false', NOT ARCHIVING ANY DATA");
        }

        var that = this;

        this.__emptyAll(function (err) {

            that.addUsers(users, function () {
                console.log("Users added to DB");
                that.addSequences(sequences, function () {
                    console.log("Sequences added to DB");

                    if (cb) cb();
                })
            });

        });

    }

    extractUsers(obj) {

        var toReturn = [];
        for (var i = 0; i < obj.users.length; i++) {
            toReturn.push(User.userFactory({name: obj.users[i]}));
        }
        return toReturn;

    }

    extractSequences(obj) {

        console.log(obj);
        
        var toReturn = [];

        for (var i = 0; i < obj.sequences.length; i++) {
            toReturn.push({rx : obj.sequences[i].rx, data : []});
            for (var j = 0; j < obj.sequences[i].data.length; j++) {
                toReturn[i].data.push(Factory.createEvent(obj.sequences[i].data[j]));
            }
        }

        return toReturn;
    }

    /**
     * Deletes all data from the respective table
     *
     * @param t {string} table name to delete from.
     * @param callback {QueryCallback} call when delete is done, has
     *
     * @private
     */
    __empty(t, callback) {
        if (!t) return;
        this._db.run("DELETE FROM " + t, callback);
    }

    /**
     *
     * @param cb {QueryCallback}
     *
     * @private
     */
    __emptyAll(cb) {

        var that = this;

        async.eachSeries(['users', 'events', 'responses', 'rx', 'sequences'],
            function (item, next) {
                that.__empty(item, next)
            },
            function (err) {
                cb(err);
            }
        );
    }

    /**
     * Saves contents of curr to an archive in targetDir. Used for saving copies
     * of DB before they are deleted on server restart.
     *
     * @param curr {string} the path to the current db file.
     * @param targetDir {string} path to a directory to save this file in, no backslash on end.
     * @private
     */
     __save(curr, targetDir) {

        var d           = new Date();
        var newFileName = "backup-" + (d.getTime()) + ".db";
        fs.createReadStream(curr).pipe(fs.createWriteStream(targetDir + "/" + newFileName));

    }

    /**
     * @param users {User[]}
     * @param cb {QueryCallback}
     */
    addUsers(users, cb) {

        var that = this;

        async.eachSeries(users,
            /**
             * @param item  {User}
             * @param next {function}
             */
            function (item, next) {

                if (!item._secret) {
                    item._secret = that._makeSecret();
                    console.log(item);
                }

                that._db.run(
                    "INSERT INTO users (name, secret) VALUES($name, $secret);",
                    {$name: item._name, $secret: item._secret},
                    function (err) {
                        // this object contains lastID field which is the 
                        // id that was appended to the table
                        if (err) console.log(err);
                        next();
                    }
                )

            }, function (err) {

                if (err) console.log(err);

                cb(err, null);
            }
        );
    }

    /**
     * @param seqs {object}
     */
    addSequences(seqs, cb) {

        var that = this;

        var i = 0;

        async.eachSeries(seqs,
            function (seq, nextSeq) {

                // set id of sequences so that we can query them in order.

                that._db.run(
                    "INSERT INTO sequences (ID, rx) VALUES($id, $rx)", {$id: i, $rx : seq.rx},
                    function (err) {

                        i++;

                        var seqId = this.lastID;

                        async.eachSeries(seq.data, function (event, nextEvent) {

                            var q   = "";
                            var obj = {$sid: seqId, $time: event.time};

                            if (event instanceof Event.AdministrationEvent) {

                                q         = "INSERT INTO events (sequence, type, time, substance, dose, unit) VALUES($sid, $type, $time, $subs, $dose, $unit)"
                                obj.$type = "AdministrationEvent";
                                obj.$subs = event.substance;
                                obj.$dose = event.dose;
                                obj.$unit = event.unit;

                            } else {
                                q = "INSERT INTO events (sequence, type, time) VALUES($sid, $type, $time)";
                                if (event instanceof Event.FoodEvent) obj.$type = "FoodEvent";
                                if (event instanceof Event.AwakeEvent) obj.$type = "AwakeEvent";
                                if (event instanceof Event.SleepEvent) obj.$type = "SleepEvent";
                            }

                            that._db.run(
                                q, obj, function (err) {
                                    nextEvent(err);
                                }
                            )

                        }, function (err) {
                            nextSeq(err);
                        });
                    }
                );

            }, function (err) {
                cb(err);
            }
        );

    }

    /**
     * Returns all of the user in the database.
     *
     * @param cb {function} to be called with the query is complete.
     */
    getUsers(cb) {

        var toReturn = [];

        this._db.each(
            "SELECT * FROM users",
            function (err, row) {
                toReturn.push(new User.User(row.ID, row.name, row.secret));
            },
            function () {
                cb(toReturn);
            }
        );
    }

    /**
     *
     * @param id {number} the sequence id
     *
     * @returns {Event[]}
     */
    getSequence(id, cb) {

        var toReturn = [];

        var that = this;
        
        var lastRow = null; 

        this._db.each(
            "SELECT * FROM sequences LEFT JOIN events ON events.sequence=sequences.ID WHERE sequences.ID=$id",
            {$id: id},
            function (err, row) {
                toReturn.push(that.__eventFromDBRow(row));
                lastRow = row; 
            }, function () {
                if (cb) cb(toReturn, lastRow ? lastRow.rx : null);
            }
        )

    }

    __eventFromDBRow(row) {
        row.datetime = row.time;
        row.units    = row.unit;
        return Factory.createEvent(row);
    }

    /**
     *
     * @param seq {number}
     * @param adherent {boolean}
     * @param user {number}
     * @param cb {QueryCallback}
     */
    recordResponse(seq, adherent, user, cb) {

        console.log(seq, adherent);

        user = user || 0;

        var d = new Date();

        this._db.run(
            "INSERT INTO responses (sequence, answer, user, time) VALUES($seq, $answer, $user, $date)",
            {$seq: seq, $answer: (adherent ? 1 : 0), $user: user, $date: d},
            function (err) {
                if (err) console.log(err);
                cb(err);
            }
        )

    }

    authUser(u, p, cb) {
        this._db.get(
            "SELECT * FROM users WHERE name=$u AND secret=$p",
            {$u: u, $p: p},
            function (err, row) {
                cb(row || null);
            }
        )
    }

    close() {
        this._db.close();
    }

    _makeSecret() {
        var text     = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }
}

var d = new DBInterface('database/study.db');

d.connect(function (err) {
    if (err) {
        console.log("DB ERROR: " + err);
        process.exit(1);
    }
});

d.init("database/data.json");

module.exports = d; 
