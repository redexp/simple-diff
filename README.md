simple-diff
===========

Lib for simple diff with options

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
        oldPath: ['prop1'],
        newPath: ['prop1'],
        type: 'move-item',
        oldIndex: 0,
        newIndex: 1
    },
    {
        oldPath: ['prop1', 0, 'name'],
        newPath: ['prop1', 1, 'name'],
        type: 'change',
        oldValue: 'name1',
        newValue: 'name01'
    },
    {
        oldPath: ['prop1', 1, 'name'],
        newPath: ['prop1', 0, 'name'],
        type: 'remove',
        oldValue: 'name2',
        newValue: undefined
    },
    {
        oldPath: ['prop1'],
        newPath: ['prop1'],
        type: 'move-item',
        oldIndex: 1,
        newIndex: 0
    },
    {
        oldPath: ['prop1'],
        newPath: ['prop1'],
        type: 'add-item',
        oldIndex: -1,
        newIndex: 3,
        newValue: {
            id: 5,
            name: 'name5'
        }
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

 * Installation
 * Options
 * Examples
 
# Installation

`npm i simple-diff`

`bower i simple-diff`

# Options

 * `idProp` - id property for all arrays items. Default value: `id`
 * `idProps` - hash where key is path to array and value is id property. Path examples: `users.list`, `user.list.1.friends`, `users.list.*.friends`
 * `callback` - function which will be called for each "change event". When it used diff will return empty array. Useful for memory management.
 * `addEvent` - name of event when new property added to object. Default value: `add`
 * `changeEvent` - name of event when property value changed. Default value: `change`
 * `removeEvent` - name of event when property removed from object. Default value: `remove`
 * `addItemEvent` - name of event when new item added to array. Default value: `add-item`
 * `removeItemEvent` - name of event when item removed from array. Default value: `remove-item`
 * `moveItemEvent` - name of event when item changed it index in array. Default value: `move-item`

