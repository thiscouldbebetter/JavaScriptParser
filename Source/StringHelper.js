
class StringHelper
{
	// constants

	static BreakingSymbols = "()[]{};.";
	static LettersLowercase = "abcdefghijklmnopqrstuvwxyz";
	static LettersUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	static Numerals = "0123456789";
	static Symbols = ".=+-/*<>()[]{};";
	static WhitespaceChars = " \t\r\n";

	static Letters = StringHelper.LettersLowercase + StringHelper.LettersUppercase;

	// static methods

	static isCharALetter(charToTest)
	{
		var returnValue = (StringHelper.Letters.indexOf(charToTest) >= 0);

		return returnValue;
	}

	static isCharALetterOrNumeral(charToTest)
	{
		var returnValue = 
		(
			(StringHelper.Letters.indexOf(charToTest) >= 0)
			|| (StringHelper.Numerals.indexOf(charToTest) >= 0)
		);

		return returnValue;
	}

	static isCharANumeral(charToTest)
	{
		var returnValue = (StringHelper.Numerals.indexOf(charToTest) >= 0);

		return returnValue;
	}

	static isCharASymbol(charToTest)
	{
		var returnValue = (StringHelper.Symbols.indexOf(charToTest) >= 0);
		return returnValue;
	}

	static isCharABreakingSymbol(charToTest)
	{
		var returnValue = (StringHelper.BreakingSymbols.indexOf(charToTest) >= 0);
		return returnValue;
	}

	static isCharWhitespace(charToTest)
	{
		return (StringHelper.WhitespaceChars.indexOf(charToTest) >= 0);
	}

	static isStringAnIdentifier(stringToTest)
	{
		var returnValue;

		if (Keyword.isStringAKeyword(stringToTest))
		{
			returnValue = false;
		}
		else
		{
			returnValue = true;
		
			for (var i = 0; i < stringToTest.length; i++)
			{
				if (StringHelper.isCharALetterOrNumeral(stringToTest[i]) == false)
				{
					returnValue = false;
					break;
				}
			}
		}

		return returnValue;
	}

	static isStringANumber(stringToTest)
	{
		var returnValue = true;

		for (var i = 0; i < stringToTest.length; i++)
		{
			if (StringHelper.isCharANumeral(stringToTest[i]) == false)
			{
				returnValue = false;
				break;
			}
		}

		return returnValue;
	}

	static isStringEnclosedInQuotes(stringToTest)
	{
		// todo - single quotes

		var returnValue = 
		(
			stringToTest[0] == "\"" 
			&& stringToTest[stringToTest.length - 1] == "\""
		);

		return returnValue;
	}
}
