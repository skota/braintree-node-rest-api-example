var request = require('request');
var base_url = "http://localhost:3000";

describe("Test Braintree REST API end points ", function() {
	describe("Get /client_token", function() {
		it("returns a status code of 200", function() {
			request.get(base_url+'/client_token', function(error, response, body) {
				expect(response.statusCode.toBe(200));
				
			})	
		})
		
	});

	// //should return a 400 if required paramters are not present
	describe("POST /customer", function() {
		it("Returns a 400 if all paramaters are not present", function() {
			request.post(base_url+'/customer', function(error, response, body) {
				expect(response.statusCode.toBe(400));
			})	
		})
		
	});


});