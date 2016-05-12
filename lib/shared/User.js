"use strict";
/**
 * Created by sdiemert on 2016-05-11.
 */

class User{
    constructor(id, name, secret){
        this._id = id; 
        this._name = name;
        this._secret = secret; 
    }
}

function userFactory(obj){
    return new User(null, obj.name, obj.secret || null); 
}

module.exports = {User : User, userFactory : userFactory} ; 

