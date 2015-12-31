var soql2json = require("soql2json");

var sqlQuery 
= 'SELECT Amount, Id, Name, (SELECT Quantity, ListPrice, UnitPrice, PricebookEntry FROM OpportunityLineItems) FROM Opportunity';

soql2json.convert(sqlQuery, function(data) {
	console.log(data);
	console.log(data.children);
});