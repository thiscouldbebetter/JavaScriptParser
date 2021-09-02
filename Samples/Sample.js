var result2 = a.b();
var result3 = a.b().c(d.e(arg0)) + f.g(arg1, arg2);
var result = getValue();
var fivish = 1 * 2 + 3;
var nine = 1 + 2 * 3;
var stringValue = "This is a string";

function Test(testParameter)
{
	var result = getValue();

	for (var i = 0; i &lt; 2; i++)
	{
		if (result)
		{
			var one = 1;
		}
		else
		{
			var four = 2 + 2;
			var five = 2 + 3;
			break;
		}
	}
}

function getValue()
{
	return true;
}

function Class(name)
{
	this.name = name;
}
{
	Class.prototype.method = function()
	{
		var returnValue;
		returnValue = 1;

		return returnValue;
	}
}
