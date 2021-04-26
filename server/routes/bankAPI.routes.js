const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const bankAccountController = require('../controllers/bank_account.controller');
const transactionController = require('../controllers/transaction.controller');

/* Users Routes: */
router.get('/users/getUsers', (req, res) => userController.getUsers(req, res))
.get('/users/getUserByPassportID/:passportID', (req, res) => userController.getUserByPassportID(req, res))
.post('/users/addUser', (req, res) => userController.addUser(req, res));
//delete user?

/* Accounts Routes: */
router.get('/accounts/getAllAcounts', (req, res) => bankAccountController.getAllAcounts(req, res))
.get('/accounts/getUserAccountByPassportID/:passportID', (req, res) => bankAccountController.getAccountBypassportID(req, res))
.post('/accounts/addUserAccount', (req, res) => bankAccountController.addUserAccount(req, res));
//delete account?

/* Transactions Routes: */
router.get('/transactions/getAllTreansactions', (req, res) => transactionController.getAllTransactions(req, res))
.get('/transactions/getTransactionsByPassportID/:passportID', (req, res) => transactionController.getTransactionsByPassportID(req, res))
.post('/transactions/addTransaction', (req, res) => transactionController.addTransaction(req, res))

module.exports = router;