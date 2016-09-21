
var bm_expressionManager = (function () {
    'use strict';
    var ob = {};

    // Expression Example
    // comp("Color Palettes").layer("Twitter BG 02").content("Rectangle 1").content("Fill 1").color

    function splitExpression(expressionString){
    	return expressionString.split(".");
    }

    function getPropertyName(string){
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    function parseExpression(string){
        string = string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    	// confirm("parse " + string);

        var regExEffect = /([^)"]+)\(\"([^)"]+)\"\)\(\"([^)"]+)\"\)/;
        if (regExEffect.exec(string) != null){
            return {"type":"effect"}
        }

    	var regEx = /([^)"]+)\(\"([^)"]+)\"\)/;
		var matches = regEx.exec(string);
		if(matches != null && matches.length > 2){
			var type = matches[1];
			var name = matches[2];
			// confirm("type = item | itemType = " + type + " | name = "+ name);
			return {"type":"item", "itemType": type, "name": name}
		}
		else{
			// confirm("type = property | name = "+ string);
			return {"type":"property", "name": getPropertyName(string)};
		}
    }

    function evaluate(expressionStr, obj){
    	var info = parseExpression(expressionStr);
    	if(info.type == "item"){
    		return getItem(info.itemType, info.name, obj);
    	}
        else if(info.type == "effect"){
            return bm_effectsHelper.evaluateEffectsExpression(expressionStr, obj);
        }
    	else if(info.type == "property"){
            property = obj.property(info.name);
            // confirm(property);
            var value = bm_keyframeHelper.getPropertyValueOf(property, property.valueAtTime(0, true), true);
            return value;
    	}
    }

    function getItem(itemType, itemName, obj){
    	var item = null;

    	switch (itemType) {
        case "comp":
            item = bm_projectManager.getComposition(itemName);
            // confirm ("found comp " + item.name);
            break;
        case "layer":
            item = bm_projectManager.getLayer(obj, itemName);
            // confirm ("found layer " + item.name);
            break;
        case "content":
            item = obj.property('Contents').property(itemName);
            break;
        case "effect":
            item = bm_projectManager.getEffect(obj, itemName);
            confirm ("found effect " + item.name);
            break;
        default:
            break;
        }

        return item;
    }

    function evaluateExpression(prop, returnOb){
        if (prop.expressionEnabled && !prop.expressionError) {
            expressionStr = prop.expression;
        	// confirm ("evaluating " + expressionStr);
        	var expressionParts = splitExpression(expressionStr);
    		obj = null;	
    		while (expressionParts.length > 0){
    			obj = evaluate(expressionParts.shift(), obj);
    		}
            returnOb.k = obj;
        }

    	
    }

    ob.evaluateExpression = evaluateExpression;
	return ob;
}());