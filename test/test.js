var expect = require('chai').expect,
    diff = require('../index'),
    undefined;

describe('diff', function () {
    it('should find changes in objects', function () {
        var changes = diff(
            {
                prop1: 'value1',
                prop2: 'value2',
                prop3: 'value3'
            },
            {
                prop1: 'value01',
                prop2: 'value2',
                prop4: 'value4'
            }
        );

        expect(changes).to.deep.equal([
            {
                oldPath: ['prop1'],
                newPath: ['prop1'],
                type: 'change',
                oldValue: 'value1',
                newValue: 'value01'
            },
            {
                oldPath: ['prop3'],
                newPath: ['prop3'],
                type: 'remove',
                oldValue: 'value3',
                newValue: undefined
            },
            {
                oldPath: ['prop4'],
                newPath: ['prop4'],
                type: 'add',
                oldValue: undefined,
                newValue: 'value4'
            }
        ]);
    });

    it('should find changes in deep object', function () {
        var changes = diff(
            {
                prop0: {
                    prop1: 'value1',
                    prop2: 'value2',
                    prop3: 'value3'
                },
                prop5: 'value5'
            },
            {
                prop0: {
                    prop1: 'value01',
                    prop2: 'value2',
                    prop4: 'value4'
                },
                prop5: 'value05'
            }
        );

        expect(changes).to.deep.equal([
            {
                oldPath: ['prop0', 'prop1'],
                newPath: ['prop0', 'prop1'],
                type: 'change',
                oldValue: 'value1',
                newValue: 'value01'
            },
            {
                oldPath: ['prop0', 'prop3'],
                newPath: ['prop0', 'prop3'],
                type: 'remove',
                oldValue: 'value3',
                newValue: undefined
            },
            {
                oldPath: ['prop0', 'prop4'],
                newPath: ['prop0', 'prop4'],
                type: 'add',
                oldValue: undefined,
                newValue: 'value4'
            },
            {
                oldPath: ['prop5'],
                newPath: ['prop5'],
                type: 'change',
                oldValue: 'value5',
                newValue: 'value05'
            }
        ]);
    });

    it('should find changes in array with id', function () {
        var changes = diff(
            [
                {
                    id: 1,
                    prop: 'value1'
                },
                {
                    id: 2,
                    prop: 'value2'
                },
                {
                    id: 3,
                    prop: 'value3'
                },
                {
                    id: 4,
                    prop: 'value4'
                }
            ],
            [
                {
                    id: 3,
                    prop: 'value3'
                },
                {
                    id: 2,
                    prop: 'value2'
                },
                {
                    id: 1,
                    prop: 'value1'
                },
                {
                    id: 5,
                    prop: 'value5'
                }
            ]
        );

        expect(changes).to.deep.equal([
            {
                oldPath: [],
                newPath: [],
                type: 'move',
                oldIndex: 0,
                newIndex: 2
            },
            {
                oldPath: [],
                newPath: [],
                type: 'move',
                oldIndex: 2,
                newIndex: 0
            },
            {
                oldPath: [],
                newPath: [],
                type: 'remove',
                oldIndex: 3,
                newIndex: -1
            },
            {
                oldPath: [],
                newPath: [],
                type: 'add',
                oldIndex: -1,
                newIndex: 3,
                newValue: {
                    id: 5,
                    prop: 'value5'
                }
            }
        ]);
    });

    it('should find changes in array of simple types', function () {
        var changes = diff(
            [
                'one',
                'two',
                'three',
                'four'
            ],
            [
                'three',
                'two',
                'one',
                'five'
            ]
        );

        expect(changes).to.deep.equal([
            {
                oldPath: [],
                newPath: [],
                type: 'move',
                oldIndex: 0,
                newIndex: 2
            },
            {
                oldPath: [],
                newPath: [],
                type: 'move',
                oldIndex: 2,
                newIndex: 0
            },
            {
                oldPath: [],
                newPath: [],
                type: 'remove',
                oldIndex: 3,
                newIndex: -1
            },
            {
                oldPath: [],
                newPath: [],
                type: 'add',
                oldIndex: -1,
                newIndex: 3,
                newValue: 'five'
            }
        ]);
    });

    it('should not handle changed index by removed previous items', function () {
        var changes = diff(
            [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10
            ],
            [
                3,
                1,
                4,
                5,
                7,
                6,
                9,
                10,
                11
            ]
        );

        expect(changes).to.deep.equal([
            {
                oldPath: [],
                newPath: [],
                type: 'move',
                oldIndex: 0,
                newIndex: 1
            },
            {
                oldPath: [],
                newPath: [],
                type: 'remove',
                oldIndex: 1,
                newIndex: -1
            },
            {
                oldPath: [],
                newPath: [],
                type: 'move',
                oldIndex: 2,
                newIndex: 0
            },
            {
                oldPath: [],
                newPath: [],
                type: 'move',
                oldIndex: 6,
                newIndex: 4
            },
            {
                oldPath: [],
                newPath: [],
                type: 'remove',
                oldIndex: 7,
                newIndex: -1
            },
            {
                oldPath: [],
                newPath: [],
                type: 'add',
                oldIndex: -1,
                newIndex: 8,
                newValue: 11
            }
        ]);
    });

    it('should find changes in deep array', function () {
        var changes = diff(
            {
                prop: [
                    1,
                    2
                ]
            },
            {
                prop: [
                    2,
                    3
                ]
            }
        );

        expect(changes).to.deep.equal([
            {
                oldPath: ['prop'],
                newPath: ['prop'],
                type: 'remove',
                oldIndex: 0,
                newIndex: -1
            },
            {
                oldPath: ['prop'],
                newPath: ['prop'],
                type: 'add',
                oldIndex: -1,
                newIndex: 1,
                newValue: 3
            }
        ]);
    });

    it('should handle idProps option', function () {
        var changes = diff(
            {
                prop1: {
                    prop2: [
                        {
                            _id: 1,
                            prop3: [
                                {
                                    cid: 1,
                                    name: 'name1'
                                },
                                {
                                    cid: 2,
                                    name: 'name2'
                                }
                            ]
                        },
                        {
                            _id: 2,
                            name: 'name2'
                        }
                    ]
                }
            },
            {
                prop1: {
                    prop2: [
                        {
                            _id: 2,
                            name: 'name2'
                        },
                        {
                            _id: 1,
                            prop3: [
                                {
                                    cid: 2,
                                    name: 'name02'
                                },
                                {
                                    cid: 1,
                                    name: 'name1'
                                }
                            ]
                        }
                    ]
                }
            },
            {
                idProp: '_id',
                idProps: {
                    "prop1.prop2.*.prop3": "cid"
                }
            }
        );

        expect(changes).to.deep.equal([
            {
                oldPath: ['prop1', 'prop2'],
                newPath: ['prop1', 'prop2'],
                type: 'move',
                oldIndex: 0,
                newIndex: 1
            },
            {
                oldPath: ['prop1', 'prop2', 0, 'prop3'],
                newPath: ['prop1', 'prop2', 1, 'prop3'],
                type: 'move',
                oldIndex: 0,
                newIndex: 1
            },
            {
                oldPath: ['prop1', 'prop2', 0, 'prop3'],
                newPath: ['prop1', 'prop2', 1, 'prop3'],
                type: 'move',
                oldIndex: 1,
                newIndex: 0
            },
            {
                oldPath: ['prop1', 'prop2', 0, 'prop3', 1, 'name'],
                newPath: ['prop1', 'prop2', 1, 'prop3', 0, 'name'],
                type: 'change',
                oldValue: 'name2',
                newValue: 'name02'
            },
            {
                oldPath: ['prop1', 'prop2'],
                newPath: ['prop1', 'prop2'],
                type: 'move',
                oldIndex: 1,
                newIndex: 0
            }
        ]);
    });
});