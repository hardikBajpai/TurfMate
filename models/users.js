const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({

    email: String,

    username: String,

    role: {
        type: String,
        enum: ["player", "owner"],
        default: "player"
    }

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

