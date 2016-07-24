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

    function diff(oldObj, newObj, ops) {
        ops = ops || {};

        var changes = [],
            oldPath = ops.oldPath || [],
            newPath = ops.newPath || [],
            ID_PROP = ops.idProp || 'id',
            ADD_EVENT = ops.addEvent || 'add',
            REMOVE_EVENT = ops.removeEvent || 'remove',
            CHANGE_EVENT = ops.changeEvent || 'change',
            MOVE_EVENT = ops.moveEvent || 'move',
            callback = ops.callback || function (item) {
                changes.push(item);
            },
            i, len, prop, id, newIndex;

        if (isArray(oldObj)) {
            var sample = oldObj.length > 0 ? oldObj[0] : newObj[0];

            if (sample === UNDEFINED) return changes;

            if (typeof sample === 'object') {
                var idProp =
                        (ops.idProps &&
                        (
                            ops.idProps[oldPath.map(numberToAsterisk).join('.')] ||
                            ops.idProps[oldPath.join('.')]
                        )) || ID_PROP,
                    oldHash = indexBy(oldObj, idProp),
                    newHash = indexBy(newObj, idProp);

                for (i = 0, len = oldObj.length; i < len; i++) {
                    id = oldObj[i][idProp];
                    newIndex = newObj.indexOf(newHash[id]);

                    if (newIndex === -1 || i >= newObj.length || id !== newObj[i][idProp]) {
                        callback({
                            oldPath: oldPath,
                            newPath: newPath,
                            type: newIndex === -1 ? REMOVE_EVENT : MOVE_EVENT,
                            oldIndex: i,
                            newIndex: newIndex
                        });
                    }

                    if (newHash.hasOwnProperty(id)) {
                        diff(oldObj[i], newHash[id], extend({}, ops, {
                            callback: callback,
                            oldPath: oldPath.concat(i),
                            newPath: newPath.concat(newIndex)
                        }));
                    }
                }

                for (i = 0, len = newObj.length; i < len; i++) {
                    if (!oldHash.hasOwnProperty(newObj[i][idProp])) {
                        callback({
                            oldPath: oldPath,
                            newPath: newPath,
                            type: ADD_EVENT,
                            oldIndex: -1,
                            newIndex: i,
                            newValue: newObj[i]
                        });
                    }
                }
            }
            else {
                var oldObjHash = {}, offset = 0;

                for (i = 0, len = oldObj.length; i < len; i++) {
                    oldObjHash[oldObj[i]] = i;

                    newIndex = newObj.indexOf(oldObj[i]);

                    if (newIndex === -1 || (oldObj[i] !== newObj[i] && oldObj[i] !== newObj[i - offset])) {
                        callback({
                            oldPath: oldPath,
                            newPath: newPath,
                            type: newIndex === -1 ? REMOVE_EVENT : MOVE_EVENT,
                            oldIndex: i,
                            newIndex: newIndex
                        });
                    }

                    if (newIndex === -1) {
                        offset++;
                    }
                }

                for (i = 0, len = newObj.length; i < len; i++) {
                    if (!oldObjHash.hasOwnProperty(newObj[i])) {
                        callback({
                            oldPath: oldPath,
                            newPath: newPath,
                            type: ADD_EVENT,
                            oldIndex: -1,
                            newIndex: i,
                            newValue: newObj[i]
                        });
                    }
                }
            }
        }
        else {
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