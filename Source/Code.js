
class Code
{
	constructor(codeAsString)
	{
		this.codeAsString = codeAsString;
	}

	parseStringIntoCodeTree()
	{
		var nodeDefns = CodeNodeDefn.Instances();
		var keywords = Keyword.Instances();

		this.nodeRoot = new CodeNode(nodeDefns.Program.name, null);

		this.nodeCurrent = new CodeNode(nodeDefns.CodeBlock.name, this.nodeRoot);

		this.tokens = Code.tokenizeCodeString(this.codeAsString);

		this.token = null;
		this.t = 0;

		var numberOfTokens = this.tokens.length;

		while (this.t < numberOfTokens)
		{
			this.token = this.tokens[this.t];

			this.parseStringIntoCodeTree_ProcessToken();
		}

		return this.nodeRoot;
	}

	parseStringIntoCodeTree_ProcessToken()
	{
		var nodeCurrent = this.nodeCurrent;

		var nodeDefn = this.nodeCurrent.defn();
		var nodeDefnName = nodeDefn.name;
		var nodeDefns = CodeNodeDefn.Instances();
		var token = this.tokens[this.t];
		var keywords = Keyword.Instances();

		// This block should be split out into the various nodeDefns.

		if (nodeDefnName == nodeDefns.Expression.name)
		{
			nodeDefn.parse(this);
		}
		else if (nodeDefnName == nodeDefns.Statement.name)
		{
			nodeDefn.parse(this);
		}
		else if (nodeDefnName == nodeDefns.CodeBlock.name)
		{
			nodeDefn.parse(this);
		}
		/*
		else if (nodeDefn == nodeDefns.VariableDeclaration)
		{
			nodeCurrent.attributeAdd("name", token);
			nodeCurrent = parent;
			t++;
		}
		*/
		else if (nodeDefnName == nodeDefns.FunctionDeclaration.name)
		{
			if (token == keywords.ParenthesisOpen.symbol)
			{
				this.nodeCurrent = new CodeNode
				(
					nodeDefns.ParameterNameList.name, nodeCurrent
				);
				this.t++;
			}
			else if (token == keywords.BraceOpen.symbol)
			{
				this.nodeCurrent = new CodeNode
				(
					nodeDefns.CodeBlock.name, nodeCurrent
				);
				this.t++;
			}
			else if (nodeCurrent.children.length == 0)
			{
				this.nodeCurrent.attributeAdd("name", token);
				this.t++;
			}
			else
			{
				this.nodeCurrent = this.nodeCurrent.parent;
			}
		}
		else if (nodeDefnName == nodeDefns.ParameterNameList.name)
		{
			if (token == keywords.ParenthesisClose.symbol)
			{
				this.nodeCurrent = this.nodeCurrent.parent;
			}
			else
			{
				var nodeChild = new CodeNode
				(
					nodeDefns.ParameterName.name, nodeCurrent
				);
				nodeChild.attributeAdd("value", token);
			}

			this.t++;
		}
		else if (nodeDefnName == nodeDefns.If.name)
		{
			if (token == keywords.ParenthesisOpen.symbol)
			{
				this.nodeCurrent = new CodeNode
				(
					nodeDefns.Expression.name, nodeCurrent
				);
				this.t++;
			}
			else if (token == keywords.BraceOpen.symbol)
			{
				this.nodeCurrent = new CodeNode
				(
					nodeDefns.CodeBlock.name, nodeCurrent
				);
				this.t++;
			}
			else if (token == keywords.Else.symbol)
			{
				// ignore it - This presumes braces will always be used.
				this.t++;
			}
			else
			{
				this.nodeCurrent = this.nodeCurrent.parent;
			}
		}
		else if (nodeDefnName == nodeDefns.For.name)
		{
			if (token == keywords.ParenthesisOpen.symbol)
			{
				this.nodeCurrent = new CodeNode
				(
					nodeDefns.ForConditions.name, nodeCurrent
				);
				this.t++;
			}
			else if (token == keywords.BraceOpen.symbol)
			{
				this.nodeCurrent = new CodeNode
				(
					nodeDefns.CodeBlock.name, nodeCurrent
				);
				this.t++;
			}
			else
			{
				this.nodeCurrent = this.nodeCurrent.parent;
			}
		}
		else if (nodeDefnName == nodeDefns.ForConditions.name)
		{
			if (nodeCurrent.children.length == 0)
			{
				this.nodeCurrent = new CodeNode
				(
					nodeDefns.Statement.name, nodeCurrent
				);
			}
			else if (nodeCurrent.children.length == 1)
			{
				this.nodeCurrent = new CodeNode
				(
					nodeDefns.Expression.name, nodeCurrent
				);
			}
			else if (nodeCurrent.children.length == 2)
			{
				this.nodeCurrent = new CodeNode
				(
					nodeDefns.Expression.name, nodeCurrent
				);
				this.t++;
			}
			else
			{
				this.nodeCurrent = this.nodeCurrent.parent;
			}
		}
		else 
		{
			this.nodeCurrent = new CodeNode
			(
				nodeDefns.Unknown.name, nodeCurrent
			);
			this.nodeCurrent.attributeAdd("text", token);
			this.t++;
		}
	}

	static tokenizeCodeString(stringToTokenize)
	{
		var returnTokens = [];

		var lengthOfStringToTokenize = stringToTokenize.length;
		var tokenInProgress = "";
		var charFromString = "";

		var inStringLiteral = false;

		for (var i = 0; i < lengthOfStringToTokenize; i++)
		{
			var charFromStringPrev = charFromString;
			charFromString = stringToTokenize[i];

			if (inStringLiteral)
			{
				tokenInProgress += charFromString

				if (charFromString == "\"")
				{
					if (charFromStringPrev != "\\")
					{
						inStringLiteral = false;
					}
				}	
			}
			else if (StringHelper.isCharWhitespace(charFromString))
			{
				// do nothing
			}
			else if (charFromString == "\"")
			{
				returnTokens.push(tokenInProgress);
				tokenInProgress = "" + charFromString;
				inStringLiteral = true;
			}
			else if (StringHelper.isCharALetterOrNumeral(charFromString))
			{
				if (StringHelper.isCharALetterOrNumeral(charFromStringPrev))
				{
					tokenInProgress += charFromString;
				}
				else
				{
					returnTokens.push(tokenInProgress);
					tokenInProgress = "" + charFromString;
				}
			}
			else if (StringHelper.isCharASymbol(charFromString))
			{
				if (StringHelper.isCharASymbol(charFromStringPrev))
				{
					// hack - To prevent "()" from being one symbol, etc. 
					if (StringHelper.isCharABreakingSymbol(charFromString))
					{
						returnTokens.push(tokenInProgress);
						tokenInProgress = "" + charFromString;
					}
					else
					{
						tokenInProgress += charFromString;
					}
				}
				else
				{
					returnTokens.push(tokenInProgress);
					tokenInProgress = "" + charFromString;
				}
			}
		}

		return returnTokens;
	}
}
