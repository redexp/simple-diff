(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.simpleDiff = factory();
    }
}(this, function () {

    var UNDEFINED;

    var _DEV_ = true;

    function diff(oldObj, newObj, ops) {
        ops = ops || {};

        var changes = [],
            oldPath = ops.oldPath || [],
            newPath = ops.newPath || [],
            ID_PROP = ops.idProp || 'id',
            ADD_EVENT = ops.addEvent || 'add',
            REMOVE_EVENT = ops.removeEvent || 'remove',
            CHANGE_EVENT = ops.changeEvent || 'change',
            ADD_ITEM_EVENT = ops.addItemEvent || 'add-item',
            REMOVE_ITEM_EVENT = ops.removeItemEvent || 'remove-item',
            MOVE_ITEM_EVENT = ops.moveItemEvent || 'move-item',
            callback = ops.callback || function (item) {
                changes.push(item);
            },
            comparators = ops.comparators || [],
            ignore = ops.ignore,
            i, len, prop, id;

        if ((!isObject(oldObj) || !isObject(newObj)) && oldObj !== newObj) {
			callback({
				oldPath: oldPath,
				newPath: newPath,
				type: CHANGE_EVENT,
				oldValue: oldObj,
				newValue: newObj
			});

			return changes;
        }

        if (ignore && ignore(oldObj, newObj, {oldPath: oldPath, newPath: newPath})) {
			return changes;
        }

        if (isArray(oldObj)) {
            if (_DEV_) {
                if (!isArray(newObj)) {
                    throw new Error('new object is not an array');
                }
            }

            var idProp =
                    (ops.idProps &&
                    (
                        ops.idProps[oldPath.map(numberToAsterisk).join('.')] ||
                        ops.idProps[oldPath.join('.')]
                    )) || ID_PROP;

            if (idProp === '*') {
                var oldLength = oldObj.length,
                    newLength = newObj.length;

                for (i = 0, len = oldLength > newLength ? oldLength : newLength; i < len; i++) {
                    if (i < oldLength && i < newLength) {
                        diff(oldObj[i], newObj[i], extend({}, ops, {
                            callback: callback,
                            oldPath: oldPath.concat(i),
                            newPath: newPath.concat(i)
                        }));
                    }
                    else if (i >= oldLength) {
                        callback({
                            oldPath: oldPath,
                            newPath: newPath,
                            type: ADD_ITEM_EVENT,
                            oldIndex: -1,
                            curIndex: -1,
                            newIndex: i,
                            newValue: newObj[i]
                        });
                    }
                    else if (i >= newLength) {
                        callback({
                            oldPath: oldPath,
                            newPath: newPath,
                            type: REMOVE_ITEM_EVENT,
                            oldIndex: i,
                            curIndex: newLength,
                            newIndex: -1,
                            oldValue: oldObj[i]
                        });
                    }
                }

                return changes;
            }

            var sample = oldObj.length > 0 ? oldObj[0] : newObj[0];

            if (sample === UNDEFINED) return changes;

            var objective = typeof sample === 'object';

            var oldHash = objective ? indexBy(oldObj, idProp) : hashOf(oldObj),
                newHash = objective ? indexBy(newObj, idProp) : hashOf(newObj),
                curArray = [].concat(oldObj),
                curIndex, oldIndex;

            for (i = 0, len = oldObj.length; i < len; i++) {
                id = objective ? oldObj[i][idProp] : oldObj[i];

                if (!newHash.hasOwnProperty(id)) {
                    curIndex = curArray.indexOf(oldObj[i]);
                    curArray.splice(curIndex, 1);

                    callback({
                        oldPath: oldPath,
                        newPath: newPath,
                        type: REMOVE_ITEM_EVENT,
                        oldIndex: i,
                        curIndex: curIndex,
                        newIndex: -1,
                        oldValue: oldObj[i]
                    });
                }
            }

            for (i = 0, len = newObj.length; i < len; i++) {
                id = objective ? newObj[i][idProp] : newObj[i];

                if (!oldHash.hasOwnProperty(id)) {
                    callback({
                        oldPath: oldPath,
                        newPath: newPath,
                        type: ADD_ITEM_EVENT,
                        oldIndex: -1,
                        curIndex: -1,
                        newIndex: i,
                        newValue: newObj[i]
                    });

                    if (i >= curArray.length) {
                        curArray.push(newObj[i]);
                    }
                    else {
                        curArray.splice(i, 0, newObj[i]);
                    }
                }
            }

            for (i = 0, len = newObj.length; i < len; i++) {
                id = objective ? newObj[i][idProp] : newObj[i];

                if (!oldHash.hasOwnProperty(id)) continue;

                oldIndex = oldObj.indexOf(oldHash[id]);
                curIndex = curArray.indexOf(oldHash[id]);

                if (i !== curIndex) {
                    callback({
                        oldPath: oldPath,
                        newPath: newPath,
                        type: MOVE_ITEM_EVENT,
                        oldIndex: oldIndex,
                        curIndex: curIndex,
                        newIndex: i
                    });

                    curArray.splice(curIndex, 1);
                    curArray.splice(i, 0, oldHash[id]);
                }

                diff(oldHash[id], newObj[i], extend({}, ops, {
                    callback: callback,
                    oldPath: oldPath.concat(oldIndex),
                    newPath: newPath.concat(i)
                }));
            }
        }
        else {
            if (comparators.length > 0) {
                for (i = 0, len = comparators.length; i < len; i++) {
                    if (oldObj instanceof comparators[i][0] === false && newObj instanceof comparators[i][0] === false) continue;

                    var objEqual = comparators[i][1](oldObj, newObj, {
                        oldPath: oldPath,
                        newPath: newPath
                    });

                    if (!objEqual) {
						callback({
							oldPath: oldPath,
							newPath: newPath,
							type: CHANGE_EVENT,
							oldValue: oldObj,
							newValue: newObj
						});
                    }

					return changes;
				}
            }

            for (prop in oldObj) {
                if (!oldObj.hasOwnProperty(prop)) continue;

                if (!newObj.hasOwnProperty(prop)) {
                    callback({
                        oldPath: oldPath.concat(prop),
                        newPath: newPath.concat(prop),
                        type: REMOVE_EVENT,
                        oldValue: oldObj[prop],
                        newValue: UNDEFINED
                    });
                }
                else if (isObject(oldObj[prop]) && isObject(newObj[prop])) {
                    diff(oldObj[prop], newObj[prop], extend({}, ops, {
                        callback: callback,
                        oldPath: oldPath.concat(prop),
                        newPath: newPath.concat(prop)
                    }));
                }
                else if (oldObj[prop] !== newObj[prop]) {
                    callback({
                        oldPath: oldPath.concat(prop),
                        newPath: newPath.concat(prop),
                        type: CHANGE_EVENT,
                        oldValue: oldObj[prop],
                        newValue: newObj[prop]
                    });
                }
            }

            for (prop in newObj) {
                if (!newObj.hasOwnProperty(prop)) continue;

                if (!oldObj.hasOwnProperty(prop)) {
                    callback({
                        oldPath: oldPath.concat(prop),
                        newPath: newPath.concat(prop),
                        type: ADD_EVENT,
                        oldValue: UNDEFINED,
                        newValue: newObj[prop]
                    });
                }
            }
        }

        return changes;
    }

    return diff;

    function isObject(object) {
        return !!object && typeof object === 'object';
    }

    function isArray(array) {
        if (Array.isArray) {
            return Array.isArray(array);
        }
        else {
            return Object.prototype.toString.call(array) === '[object Array]';
        }
    }

    function indexBy(array, id) {
        var hash = {};

        for (var i = 0, len = array.length; i < len; i++) {
            hash[array[i][id]] = array[i];
        }

        return hash;
    }

    function hashOf(array) {
        var hash = {};

        for (var i = 0, len = array.length; i < len; i++) {
            hash[array[i]] = array[i];
        }

        return hash;
    }

    function extend(target) {
        for (var i = 1, len = arguments.length; i < len; i++) {
            var source = arguments[i];
            for (var prop in source) {
                if (!source.hasOwnProperty(prop)) continue;

                target[prop] = source[prop];
            }
        }

        return target;
    }

    function numberToAsterisk(value) {
        return typeof value === 'number' ? '*' : value;
    }

}));