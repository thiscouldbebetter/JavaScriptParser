
class CodeRun
{
	constructor(codeToRun)
	{
		this.codeToRun = codeToRun;
	}

	execute()
	{
		this.functionLookup = new Lookup("name"); 
		this.variableLookup = new Lookup("name");

		this.nodeCurrent = this.codeToRun.nodeRoot;

		this.nodeCurrent.execute(this);
	}
}
