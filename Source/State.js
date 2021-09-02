
class State
{
	constructor(name)
	{
		this.name = name;
	}

	static Instances()
	{
		if (State._instances == null)
		{
			State._instances = new State_Instances();
		}
		return State._instances;
	}
}

class State_Instances
{
	constructor()
	{
		this.Default = new State("Default");
	}
}
