import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
        name: {
                type: String,
                required: true
        },

        email: {
                type: String,
                required: true
        },

        phone: {
                type: String,
                required: true
        },

        password: {
                type: String,
                required: true
        },

        image: {
                type: String
        },

        verifystatus: {
                type: Boolean,
                default: false
        },

        verifycode: {
                type: Number
        },

        verifycodeexp: {
                type: Date
        },

        resetpasscode: {
                type: Number
        },

        resetpasscodeexp: {
                type: Date
        },

        role: {
                type: String,
                default: "user"
        }

});

const User = mongoose.model("User", UserSchema);

export default User;