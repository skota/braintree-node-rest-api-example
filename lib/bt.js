(function() {

"use strict";

var braintree = require('braintree');

var environment, BT;

//load env file with braintree settings
require('dotenv').load();


BT = braintree.connect({
  environment: braintree.Environment[process.env.ENVIRONMENT],
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
});

module.exports = BT;
})();