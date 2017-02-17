simple-diff
===========

Lib for simple diff with detection of moved items in array

[![Build Status](https://travis-ci.org/redexp/simple-diff.svg?branch=master)](https://travis-ci.org/redexp/simple-diff)

```javascript
var oldObject = {
    prop1: 'value1',
    prop2: [
        {
            id: 1,
            name: 'name1'
        },
        {
            id: 2,
            name: 'name2'
        },
        {
            id: 3,
            name: 'name3'
        },
        {
            id: 4,
            name: 'name4'
        }
    ]
};

var newObject = {
    prop1: 'value01',
    prop2: [
        {
            id: 2
        },
        {
            id: 1,
            name: 'name01'
        },
        {
            id: 4,
            name: 'name4'
        },
        {
            id: 5,
            name: 'name5'
        }
    ],
    prop3: 'value3'
};

var changes = diff(oldObject, newObject, {
    idProp: 'id'
});

console.log(changes);
```
Output
```javascript
[
    {
        oldPath: ['prop1'],
        newPath: ['prop1'],
        type: 'change',
        oldValue: 'value1',
        newValue: 'value01'
    },
    {
        oldPath: ['prop2'],
        newPath: ['prop2'],
        type: 'remove-item',
        oldIndex: 2,
        curIndex: 2,
        newIndex: -1,
        oldValue: {
            id: 3,
            name: 'name3'
        }
    },
    {
        oldPath: ['prop2'],
        newPath: ['prop2'],
        type: 'add-item',
        oldIndex: -1,
        curIndex: -1,
        newIndex: 3,
        newValue: {
            id: 5, 
            name: 'name5'
        }
    },
    {
        oldPath: ['prop2'],
        newPath: ['prop2'],
        type: 'move-item',
        oldIndex: 1,
        curIndex: 1,
        newIndex: 0
    },
    {
        oldPath: ['prop2', 1, 'name'],
        newPath: ['prop2', 0, 'name'],
        type: 'remove',
        oldValue: 'name2',
        newValue: undefined
    },
    {
        oldPath: ['prop2', 0, 'name'],
        newPath: ['prop2', 1, 'name'],
        type: 'change',
        oldValue: 'name1',
        newValue: 'name01'
    },
    {
        oldPath: ['prop3'],
        newPath: ['prop3'],
        type: 'add',
        oldValue: undefined,
        newValue: 'value3'
    }
]
```
 
# Installation

`npm i simple-diff`

`bower i simple-diff`

Lib will look for CommonJS or AMD or will be added global function called `simpleDiff()`.

# Options

## `idProp: 'id' || '*'`

Property name with unique value in it array. Default value is `id`. If your arrays do not have unique properties then you should set this option as `*` and lib will compare items one by one without trying to find moved items. 
 
## `idProps: {'path': 'propName' || '*'}` 

Hash where key is path to array and value is id property. Path examples: `users.list`, `user.list.1.friends`, `users.list.*.friends`

## `comparators: [[Class, function (oldValue, newValue, options)], ...]`

Array of comparators to handle comparison of objects which do not have own properties. For example instead of `user.name` you have `user.getName()` or you need to compare `Date` objects or you just know quick way to compare large objects like by `id` property and you do not need full list of changes of those objects. First value of comparator should be some class and second is function which should return `true` if objects are equal and `false` if they not. In `options` will be `oldPath` and `newPath`.
```javascript
var now = new Date();
var prevHour = new Date();
prevHour.setHours(-1);

var changes = diff(
	{
		createdAt: now
	},
	{
		createdAt: prevHour
	},
	{
		comparators: [
			[Date, function(oldValue, newValue, options) {
			    options.oldPath; // ['createdAt']
			    options.newPath; // ['createdAt']
			    
			    return oldValue.toString() === newValue.toString();
			}]
		]
	}
);
```

## `ignore: function (oldValue, newValue, options)`

Function which will be called before each object comparison and if returning value will be `true` then objects will be ignored. In `options` will be `oldPath` and `newPath`. Useful to prevent from traversing through circular references and when you don't want to compare some kind of objects at all.

## `callback: function (event)` 

Function which will be called for each event. If callback is passed then lib will not create array of all changes.

## `addEvent: 'add'`

Name of event when new property added to object. Default value is `add`

## `changeEvent: 'change'` 

Name of event when property value changed. Default value is `change`

## `removeEvent: 'remove'` 

Name of event when property removed from object. Default value is `remove`

## `addItemEvent: 'add-item'` 

Name of event when new item added to array. Default value is `add-item`

## `removeItemEvent: 'remove-item'` 

Name of event when item removed from array. Default value is `remove-item`

## `moveItemEvent: 'move-item'` 

Name of event when item changed it index in array. Default value is `move-item`

