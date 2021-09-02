
class Operator
{
	constructor(name, symbol, priority, evaluate)
	{
		this.name = name;
		this.symbol = symbol;
		this.priority = priority;
		this.evaluate = evaluate;
	}

	// static methods

	static getBySymbol(symbolToGet)
	{
		var returnValue = Operator.Instances()._SymbolToOperatorLookup[symbolToGet];

		return returnValue;
	}

	// evaluate() implementations for "subclasses"

	static evaluate_Decrement(codeRun, node, expression) { return null; }
	static evaluate_DividedBy(codeRun, node, expression) { return null; }

	static evaluate_Dot(codeRun, node, expression) 
	{
		var parentIdentifier = node.children[0].attributeByIndex(1).value;
		var childIdentifier = node.children[1].attributeByIndex(1).value;

		var parent = codeRun.variableLookup.getByKey(parentIdentifier);
		var child = parent[childIdentifier];

		return child; 
	}

	static evaluate_Equals(codeRun, node, expression) { return null; }
	static evaluate_FunctionCall(codeRun, node, expression) { return null; }
	static evaluate_FunctionPointer(codeRun, node, expression) { return null; }

	static evaluate_Gets(codeRun, node, expression) 
	{ 
		-- todo

		return null;
	}

	static evaluate_GreaterThan(codeRun, node, expression) { return null; }
	static evaluate_GreaterThanOrEqualTo(codeRun, node, expression) { return null; }
	static evaluate_Identifier(codeRun, node, expression) { return null; }
	static evaluate_Increment(codeRun, node, expression) { return null; }
	static evaluate_LessThan(codeRun, node, expression) { return null; }
	static evaluate_LessThanOrEqualTo(codeRun, node, expression) { return null; }
	static evaluate_LiteralNull(codeRun, node, expression) { return null; }
	static evaluate_LiteralNumber(codeRun, node, expression) { return null; }
	static evaluate_LiteralString(codeRun, node, expression) { return null; }
	static evaluate_NotEqualTo(codeRun, node, expression) { return null; }
	static evaluate_Minus(codeRun, node, expression) { return null; }
	static evaluate_Plus(codeRun, node, expression) { return null; }
	static evaluate_Return(codeRun, node, expression) { return null; }
	static evaluate_Times(codeRun, node, expression) { return null; }

	static evaluate_Var(codeRun, node, expression) 
	{ 
		-- todo

		var variableName = node.children[0].attributeByIndex(1); // hack - assuming indices
		var variable = new Variable(variableName, null)
		codeRun.variableLookup.add(variable);

		return variable.value; 
	}

	// instances

	static Instances()
	{
		if (Operator._instances == null)
		{
			Operator._instances = new Operator_Instances();
		}
		return Operator._instances;
	}
}

class Operator_Instances
{
	constructor()
	{
		this.FunctionPointer 	= new Operator("FunctionPointer",	"[function pointer]", 	0, Operator.evaluate_FunctionPointer);
		this.LiteralString 		= new Operator("StringLiteral",		"[string literal]", 	0, Operator.evaluate_LiteralString);
		this.LiteralNumber 		= new Operator("NumberLiteral",		"[number literal]", 	0, Operator.evaluate_LiteralNumber);
		this.LiteralNull		= new Operator("LiteralNull",		"null",					0, Operator.evaluate_LiteralNull);
		this.Identifier 		= new Operator("Identifier",		"[identifier]", 		0, Operator.evaluate_Identifier);		

		this.Var				= new Operator("Var",				"var", 		0, Operator.evaluate_Var);
		this.Dot				= new Operator("Dot", 				".", 		0, Operator.evaluate_Dot);

		this.FunctionCall 		= new Operator("FunctionCall",		"(", 		1, Operator.evaluate_FunctionCall);

		this.Times				= new Operator("Times", 			"*", 		2, Operator.evaluate_Times);
		this.DividedBy			= new Operator("DividedBy", 		"/", 		2, Operator.evaluate_DividedBy);

		this.Decrement 			= new Operator("Decrement", 		"--", 		3, Operator.evaluate_Decrement);
		this.Increment 			= new Operator("Increment", 		"++", 		3, Operator.evaluate_Increment);
		this.Minus				= new Operator("Minus", 			"-", 		3, Operator.evaluate_Minus);
		this.Plus 				= new Operator("Plus", 				"+", 		3, Operator.evaluate_Plus);

		this.Equals 			= new Operator("Equals", 			"==", 		4, Operator.evaluate_Equals);
		this.GreaterThan		= new Operator("GreaterThan", 		">", 		4, Operator.evaluate_GreaterThan);
		this.GreaterThanOrEqualTo = new Operator("GreaterThanOrEqualTo", ">=", 	4, Operator.evaluate_GreaterThanOrEqualTo);
		this.LessThan 			= new Operator("LessThan", 			"<", 		4, Operator.evaluate_LessThan);
		this.LessThanOrEqualTo 	= new Operator("LessThanOrEqualTo", "<=", 		4, Operator.evaluate_LessThanOrEqualTo);
		this.NotEqualTo			= new Operator("NotEqualTo",		"!=", 		4, Operator.evaluate_NotEqualTo);

		this.Gets				= new Operator("Gets", 				"=", 		5, Operator.evaluate_Gets);

		this.Return				= new Operator("Return", 			"return", 	6, Operator.evaluate_Return);

		this._All = 
		[
			this.Decrement,
			this.DividedBy,
			this.Dot,
			this.Equals,
			this.FunctionCall,
			this.FunctionPointer,
			this.Gets,
			this.GreaterThan,
			this.GreaterThanOrEqualTo,
			this.Identifier,
			this.Increment,
			this.LessThan,
			this.LessThanOrEqualTo,
			this.LiteralNull,
			this.LiteralNumber,
			this.LiteralString,
			this.NotEqualTo,
			this.Minus,
			this.Plus,
			this.Return,
			this.Times,
			this.Var,
		];

		this._SymbolToOperatorLookup = [];

		for (var i = 0; i < this._All.length; i++)
		{
			var operator = this._All[i];

			this._SymbolToOperatorLookup[operator.symbol] = operator; 
		}
	}
}
