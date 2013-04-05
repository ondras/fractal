importScripts("formula.js", "evaluator.js");

var evaluator = new Evaluator(function(result) { postMessage(JSON.stringify(result)); });

onmessage = function(event) {
	evaluator.compute.apply(evaluator, JSON.parse(event.data));
}
