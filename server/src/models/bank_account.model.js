const mongoose = require('mongoose');
const validator = require('validator');

const BankAccount = mongoose.model('BankAccount', {
    passportID: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (value.length !== 9 || !validator.isInt(value, { allow_leading_zeroes: false })) {
                throw new Error('Invalid passport ID!');
            }
        }
    },
    credit: {
        type: String,
        required: false,
        default: 0,
        trim: true,
        validate(value) {
            if (!validator.isInt(value, { allow_leading_zeroes: false, gt: 0 })) {
                throw new Error('Invalid credit number!');
            }
        }
    },
    cash: {
        type: String,
        required: false,
        default: 0,
        trim: true,
        validate(value) {
            if (!validator.isInt(value, { allow_leading_zeroes: false })) {
                throw new Error('Invalid credit number!');
            }
        }
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true,
        validate(value) {
            if (!validator.isBoolean(value)) {
                throw new Error('Invalid isActive type!');
            }
        }
    }
})



module.exports = BankAccount;