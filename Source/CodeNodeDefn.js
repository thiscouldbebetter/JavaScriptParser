
class CodeNodeDefn
{
	constructor(name, execute, parse)
	{
		this.name = name;
		this.execute = execute;
		this.parse = parse;
	}

	// static methods

	static executeDefault(codeRun, node)
	{
		console.log(this.name);

		for (var i = 0; i < node.children.length; i++)
		{
			var child = node.children[i];
			child.execute(codeRun, child);
		}
	}

	// execute() implementations for "subclasses"

	static execute_Expression(codeRun, node)
	{
		var operatorSymbol = node.attributeByIndex(0); // hack - assume 0
		var operator = Operator.getBySymbol(operatorSymbol); 
		var returnValue = operator.evaluate(codeRun, node);
		return returnValue;
	}

	// instances

	static Instances()
	{
		if (CodeNodeDefn._instances == null)
		{
			CodeNodeDefn._instances = new CodeNodeDefn_Instances();
		}
		return CodeNodeDefn._instances;
	}
}

class CodeNodeDefn_Instances
{
	constructor()
	{
		this.ArrayIndexGet		= new CodeNodeDefn("ArrayIndexGet", 	CodeNodeDefn.executeDefault);
		this.Break				= new CodeNodeDefn("Break", 		CodeNodeDefn.executeDefault);
		this.CodeBlock = new CodeNodeDefn
		(
			"CodeBlock",
			CodeNodeDefn.executeDefault,
			function parse(code)
			{
				var nodeDefns = CodeNodeDefn.Instances();
				var keywords = Keyword.Instances();
				var operators = Operator.Instances();

				var token = code.token;
				var nodeCurrent = code.nodeCurrent;

				if (token == keywords.BraceClose.symbol)
				{
					// todo - build lookups?

					code.nodeCurrent = nodeCurrent.parent;
					code.t++;
				}
				else if (token == keywords.If.symbol)
				{
					code.nodeCurrent = new CodeNode(nodeDefns.If.name, nodeCurrent);
					code.t++;
				}
				else if (token == keywords.While.symbol)
				{
					code.nodeCurrent = new CodeNode(nodeDefns.While.name, nodeCurrent);
					code.t++;
				}
				else if (token == keywords.For.symbol)
				{
					code.nodeCurrent = new CodeNode(nodeDefns.For.name, nodeCurrent);
					code.t++;
				}
				else if (token == keywords.Function.symbol)
				{
					code.nodeCurrent = new CodeNode(nodeDefns.FunctionDeclaration.name, nodeCurrent);
					code.t++;
				}
				else
				{
					code.nodeCurrent = new CodeNode(nodeDefns.Statement.name, nodeCurrent);
				}				
			}
		);

		this.CodeLine 			= new CodeNodeDefn("CodeLine", 		CodeNodeDefn.executeDefault);
		this.Expression 		= new CodeNodeDefn
		(
			"Expression",
			CodeNodeDefn.execute_Expression,
			function parse(code)
			{
				var nodeDefns = CodeNodeDefn.Instances();
				var keywords = Keyword.Instances();
				var operators = Operator.Instances();

				var nodeCurrent = code.nodeCurrent;
				var token = code.token;

				var nodeDefnName = nodeCurrent.defnName;

				if (token == keywords.Semicolon.symbol)
				{
					code.nodeCurrent = code.nodeCurrent.parent;
				}
				else if (token == keywords.ParenthesisClose.symbol)
				{
					code.nodeCurrent = code.nodeCurrent.parent;
					code.t++;
				}
				else if 
				(
					token == keywords.ParenthesisOpen.symbol 
					&& StringHelper.isStringAnIdentifier(code.tokens[code.t - 1]) == false
				)
				{
					code.nodeCurrent = new CodeNode(nodeDefns.Expression.name, nodeCurrent);						
					code.t++;
				}
				else if (Operator.getBySymbol(token) != null)
				{
					if (nodeCurrent.attributes.length > 0)
					{
						var operatorNew = Operator.getBySymbol(token);
						var attribute0Value = nodeCurrent.attributeByIndex(0);
						var operatorExisting = Operator.getBySymbol(attribute0Value);
						var operatorExistingPriority = (operatorExisting == null ? 10000 : operatorExisting.priority);
						var nodeOperandToMoveIndex = nodeCurrent.children.length - 1;

						// lower priority is better
						if (operatorNew.priority <= operatorExistingPriority)
						{
							// 1 + 2 * 3
							var nodeOperandToMove = nodeCurrent.children[nodeOperandToMoveIndex];
							var nodeExpressionHighPriority = new CodeNode(nodeDefns.Expression.name, nodeCurrent);
							nodeCurrent.children.splice(nodeOperandToMoveIndex, 1);
							nodeExpressionHighPriority.children.push(nodeOperandToMove);
							nodeOperandToMove.parent = nodeExpressionHighPriority;

							code.nodeCurrent = nodeExpressionHighPriority;
						}
						else
						{
							// 4 * 5 + 6
							var nodeOperandToMove = nodeCurrent;	
							var nodeParent = nodeCurrent.parent;
							nodeParent.children.splice(nodeOperandToMoveIndex, 1);
							var nodeExpressionLowPriority = new CodeNode(nodeDefns.Expression.name, nodeCurrent.parent);
							nodeOperandToMove.parent = nodeExpressionLowPriority;
							nodeExpressionLowPriority.children.push(nodeOperandToMove);
					
							code.nodeCurrent = nodeExpressionLowPriority;
						}
					}

					nodeCurrent.attributeAdd("operator", token);
					code.t++;
				}
				else if (StringHelper.isStringANumber(token))
				{
					var nodeChild = new CodeNode(nodeDefns.Expression.name, nodeCurrent);
					nodeChild.attributeAdd("operandType", operators.LiteralNumber.symbol);
					nodeChild.attributeAdd("value", token);
					code.t++;
				}
				else if (StringHelper.isStringEnclosedInQuotes(token))
				{
					var nodeChild = new CodeNode(nodeDefns.Expression.name, nodeCurrent);
					nodeChild.attributeAdd("operandType", operators.LiteralString.symbol);
					nodeChild.attributeAdd("value", token);
					code.t++;
				}
				else if (token == keywords.This.symbol || StringHelper.isStringAnIdentifier(token))  
				{
					var nodeChild = new CodeNode(nodeDefns.Expression.name, nodeCurrent);
					nodeChild.attributeAdd("operandType", operators.Identifier.symbol);
					nodeChild.attributeAdd("value", token);
					code.t++;
				}
				else if (token == keywords.Function.symbol)
				{
					var nodeChild = new CodeNode(nodeDefns.FunctionDeclaration.name, nodeCurrent);
					nodeChild.attributeAdd("operandType", operators.FunctionPointer.symbol);
					nodeChild.attributeAdd("value", token);
					code.nodeCurrent = nodeChild;
					code.t++;
				}
				else
				{
					// todo - Error?
				}
			}
		);
		this.For				= new CodeNodeDefn("For", 		CodeNodeDefn.executeDefault);
		this.ForConditions 		= new CodeNodeDefn("ForConditions", 	CodeNodeDefn.executeDefault);
		this.FunctionDeclaration= new CodeNodeDefn("FunctionDeclaration", CodeNodeDefn.executeDefault);
		this.FunctionInvocation = new CodeNodeDefn("FunctionInvocation", CodeNodeDefn.executeDefault);
		this.Identifier			= new CodeNodeDefn("Identifier", 	CodeNodeDefn.executeDefault);
		this.If					= new CodeNodeDefn("If", 		CodeNodeDefn.executeDefault);
		this.NumberLiteral		= new CodeNodeDefn("NumberLiteral", 	CodeNodeDefn.executeDefault);
		this.ParameterNameList 	= new CodeNodeDefn("ParameterNameList", CodeNodeDefn.executeDefault);
		this.ParameterName		= new CodeNodeDefn("ParameterName", 	CodeNodeDefn.executeDefault);
		this.ParameterValueList = new CodeNodeDefn("ParameterValueList", CodeNodeDefn.executeDefault);
		this.Program 			= new CodeNodeDefn("Program", 		CodeNodeDefn.executeDefault);
		this.PropertyGet		= new CodeNodeDefn("PropertyGet", 	CodeNodeDefn.executeDefault);

		this.Statement = new CodeNodeDefn
		(
			"Statement", 
			CodeNodeDefn.executeDefault,
			function parse(code)
			{
				var nodeDefns = CodeNodeDefn.Instances();
				var keywords = Keyword.Instances();
				var nodeCurrent = code.nodeCurrent;

				var token = code.token;

				if (token == keywords.Semicolon.symbol)
				{
					code.nodeCurrent = nodeCurrent.parent;
					code.t++;	
				}
				/*
				else if (token == keywords.Var.symbol)
				{
					nodeCurrent = new CodeNode(nodeDefns.VariableDeclaration, nodeCurrent);	
					t++;	
				}
				*/
				else if (token == keywords.Break.symbol)
				{
					new CodeNode(nodeDefns.Break.name, nodeCurrent);
					code.t++;	
				}
				else if (token == keywords.Return.symbol)
				{
					code.nodeCurrent = new CodeNode(nodeDefns.Expression.name, nodeCurrent);
					code.nodeCurrent.attributeAdd("operator", "return");
					code.t++;
				}
				else
				{
					code.nodeCurrent = new CodeNode(nodeDefns.Expression.name, nodeCurrent);
				}
			}
		);
		this.StringLiteral 		= new CodeNodeDefn("StringLiteral", 	CodeNodeDefn.executeDefault);
		this.Unknown 			= new CodeNodeDefn("Unknown", 		CodeNodeDefn.executeDefault);
		//this.VariableDeclaration= new CodeNodeDefn("VariableDeclaration", CodeNodeDefn.executeDefault);
		this.While				= new CodeNodeDefn("While", 		CodeNodeDefn.executeDefault);
	}
}
