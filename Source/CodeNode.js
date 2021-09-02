
class CodeNode
{
	constructor(defnName, parent)
	{
		this.defnName = defnName;
		this.parent = parent;

		this.attributes = {};
		this.children = [];

		if (parent != null)
		{
			parent.children.push(this);
		}
	}

	// static methods

	static setPrototypesOnObjectAndDescendants(objectToSetPrototypeOn)
	{
		objectToSetPrototypeOn.__proto__ = CodeNode.prototype;

		var children = objectToSetPrototypeOn.children;
		if (children != null)
		{
			for (var i = 0; i < children.length; i++)
			{
				var child = children[i];
				CodeNode.setPrototypesOnObjectAndDescendants(child);
			}
		}

		return objectToSetPrototypeOn;
	}

	// instance methods

	attributeAdd(name, value)
	{
		this.attributes[name] = value;
	}

	attributeByIndex(index)
	{
		var attributeName = Object.keys(this.attributes)[index];
		return this.attributes[attributeName];
	}

	defn()
	{
		return CodeNodeDefn.Instances()[this.defnName];
	}

	execute(codeRun)
	{
		this.defn().execute(codeRun, this);
	}

	removeParentsFromDescendants()
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.removeParentsFromDescendants();
		}

		delete this.parent;
	}

	// code

	toStringCode()
	{
		var defn = this.defn();

		var thisAsString = "";

		for (var attributeName in this.attributes)
		{
			var attributeValue = this.attributes[attributeName];
			thisAsString += attributeValue; // todo
		}

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			var childAsString = child.toStringCode();
			thisAsString += childAsString + "\n";
		}

		return thisAsString;
	}

	// serialization

	toStringJSON()
	{
		this.deleteEmptyListsOnSelfAndDescendants();

		var spacesPerIndent = 2;
		var returnValue = JSON.stringify(this, null, spacesPerIndent);

		this.recreateEmptyListsOnSelfAndDescendants();

		return returnValue;
	}

	deleteEmptyListsOnSelfAndDescendants()
	{
		if (Object.keys(this.attributes).length == 0)
		{
			delete this.attributes;
		}

		if (this.children.length == 0)
		{
			delete this.children;
		}
		else
		{
			for (var i = 0; i < this.children.length; i++)
			{
				var child = this.children[i];
				child.deleteEmptyListsOnSelfAndDescendants();
			}
		}
	}

	recreateEmptyListsOnSelfAndDescendants()
	{
		if (this.attributes == null)
		{
			this.attributes = {};
		}

		if (this.children == null)
		{
			this.children = [];
		}
		else
		{
			for (var i = 0; i < this.children.length; i++)
			{
				var child = this.children[i];
				child.recreateEmptyListsOnSelfAndDescendants();
			}
		}
	}
}
