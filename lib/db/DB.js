"use strict"
/**
 * Created by sdiemert on 2016-05-11.
 */

var sqlite3 = require("sqlite3").verbose();
var Promise = require("promise");
var User = require("../shared/User");
var fs = require('fs');

class DBInterface{
    constructor(name){
        this._name = name;
        this._db = null;
        this.data = null;
    }
    
    connect(cb) {
        this._db = new sqlite3.Database(this._name, sqlite3.OPEN_READWRITE, cb);
    }

    /**
     * Initializes the database with data from the file
     * at path.
     *
     * @param path {string}
     */
    init(path){

         var f = JSON.parse(fs.readFileSync(path, 'utf-8'));
        
         console.log(f);
        
        this.data = f; 

    }

    /**
     * Returns all of the user in the database.
     *
     * @param cb {function} to be called with the query is complete.
     */
    getUsers(cb){

        var toReturn = [];

        this._db.each(
            "SELECT * FROM users",
            function(err, row){
                toReturn.push(new User(row.ID, row.name, row.secret));
            },
            function(){
                cb(toReturn);
            }
        );
    }

    close(){
        this._db.close();
    }
}

module.exports = DBInterface; 
