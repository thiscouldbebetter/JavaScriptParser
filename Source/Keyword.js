
class Keyword
{
	constructor(symbol)
	{
		this.symbol = symbol;
	}

	static Instances()
	{
		if (Keyword._instances == null)
		{
			Keyword._instances = new Keyword_Instances();
		}
		return Keyword._instances;
	}


	static isStringAKeyword(stringToTest)
	{
		var returnValue;

		returnValue = (Keyword.Instances()._SymbolToKeywordLookup[stringToTest] != null)

		return returnValue;
	}
}

class Keyword_Instances
{
	constructor()
	{
		this.Break 		= new Keyword("break");
		this.Else		= new Keyword("else");
		this.For		= new Keyword("for");
		this.Function 	= new Keyword("function");
		this.If 		= new Keyword("if");
		this.Import 	= new Keyword("import");
		this.Return		= new Keyword("return");
		this.This		= new Keyword("this");
		this.Var 		= new Keyword("var");
		this.While		= new Keyword("while");

		this.BraceClose		= new Keyword("}");
		this.BraceOpen		= new Keyword("{");
		this.Dot			= new Keyword(".");
		this.Equals 		= new Keyword("==");
		this.Gets			= new Keyword("=");
		this.ParenthesisClose  	= new Keyword(")");
		this.ParenthesisOpen  	= new Keyword("(");
		this.Semicolon		= new Keyword(";");

		this._All = [
			this.Break,
			this.Else,
			this.For,
			this.Function,
			this.If,
			this.Import,
			this.Return,
			this.This,
			this.Var,
			this.While
		];

		this._SymbolToKeywordLookup = [];

		for (var i = 0; i < this._All.length; i++)
		{
			var keyword = this._All[i];

			this._SymbolToKeywordLookup[keyword.symbol] = keyword; 
		}
	}
}
