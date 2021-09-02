
class Lookup
{
	constructor(nameOfKeyField)
	{
		this.nameOfKeyField = nameOfKeyField;

		this.systemArray = [];
		this.systemLookup = [];
	}

	add(item, nameOfKeyField)
	{
		this.systemArray.push(item);
		this.systemLookup[item[nameOfKeyField]] = item; 
	}

	getByIndex(indexToGet)
	{
		return this.systemArray[indexToGet];
	}

	getByKey(keyToGet)
	{
		return this.systemLookup[keyToGet];
	}
}
