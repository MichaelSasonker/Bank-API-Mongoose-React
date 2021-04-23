const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const bankAccountController = require('../controllers/bank_account.controller');
const transactionController = require('../controllers/transaction.controller');


router.get('/getUsers', (req, res) => userController.getUsers(req, res))
.get('getUserByID/:passportID', (req, res) => userController.getUserByPassportID(req, res))
.post('/addUser', (req, res) => userController.addUser(req, res));

module.exports = router;