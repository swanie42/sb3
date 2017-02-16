var mongoose = require("mongoose");

var CouponSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coupon_code: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    limit: {
        type: Number,
        default: 1
    },
    expiration: {
        type: Date,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    company: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    }]
    // user: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    // }]

});

mongoose.model("Coupon", CouponSchema);
