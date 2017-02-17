var expect = require('chai').expect,
    sinon = require('sinon'),
    diff = require('../simple-diff'),
    undefined;

require('chai').use(require('sinon-chai'));

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
                type: 'remove-item',
                oldIndex: 3,
                curIndex: 3,
                newIndex: -1,
                oldValue: {
                    id: 4,
                    prop: 'value4'
                }
            },
            {
                oldPath: [],
                newPath: [],
                type: 'add-item',
                oldIndex: -1,
                curIndex: -1,
                newIndex: 3,
                newValue: {
                    id: 5,
                    prop: 'value5'
                }
            },
            {
                oldPath: [],
                newPath: [],
                type: 'move-item',
                oldIndex: 2,
                curIndex: 2,
                newIndex: 0
            },
            {
                oldPath: [],
                newPath: [],
                type: 'move-item',
                oldIndex: 1,
                curIndex: 2,
                newIndex: 1
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
                type: 'remove-item',
                oldIndex: 3,
                curIndex: 3,
                newIndex: -1,
                oldValue: 'four'
            },
            {
                oldPath: [],
                newPath: [],
                type: 'add-item',
                oldIndex: -1,
                curIndex: -1,
                newIndex: 3,
                newValue: 'five'
            },
            {
                oldPath: [],
                newPath: [],
                type: 'move-item',
                oldIndex: 2,
                curIndex: 2,
                newIndex: 0
            },
            {
                oldPath: [],
                newPath: [],
                type: 'move-item',
                oldIndex: 1,
                curIndex: 2,
                newIndex: 1
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
                11,
                3,
                1,
                4,
                5,
                13,
                7,
                6,
                9,
                10,
                12
            ]
        );

        expect(changes).to.deep.equal([
            {
                oldPath: [],
                newPath: [],
                type: 'remove-item',
                oldIndex: 1,
                curIndex: 1,
                newIndex: -1,
                oldValue: 2
            },
            {
                oldPath: [],
                newPath: [],
                type: 'remove-item',
                oldIndex: 7,
                curIndex: 6,
                newIndex: -1,
                oldValue: 8
            },
            {
                oldPath: [],
                newPath: [],
                type: 'add-item',
                oldIndex: -1,
                curIndex: -1,
                newIndex: 0,
                newValue: 11
            },
            {
                oldPath: [],
                newPath: [],
                type: 'add-item',
                oldIndex: -1,
                curIndex: -1,
                newIndex: 5,
                newValue: 13
            },
            {
                oldPath: [],
                newPath: [],
                type: 'add-item',
                oldIndex: -1,
                curIndex: -1,
                newIndex: 10,
                newValue: 12
            },
            {
                oldPath: [],
                newPath: [],
                type: 'move-item',
                oldIndex: 2,
                curIndex: 2,
                newIndex: 1
            },
            {
                oldPath: [],
                newPath: [],
                type: 'move-item',
                oldIndex: 6,
                curIndex: 7,
                newIndex: 6
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
                type: 'remove-item',
                oldIndex: 0,
                curIndex: 0,
                newIndex: -1,
                oldValue: 1
            },
            {
                oldPath: ['prop'],
                newPath: ['prop'],
                type: 'add-item',
                oldIndex: -1,
                curIndex: -1,
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
                type: 'move-item',
                oldIndex: 1,
                curIndex: 1,
                newIndex: 0
            },
            {
                oldPath: ['prop1', 'prop2', 0, 'prop3'],
                newPath: ['prop1', 'prop2', 1, 'prop3'],
                type: 'move-item',
                oldIndex: 1,
                curIndex: 1,
                newIndex: 0
            },
            {
                oldPath: ['prop1', 'prop2', 0, 'prop3', 1, 'name'],
                newPath: ['prop1', 'prop2', 1, 'prop3', 0, 'name'],
                type: 'change',
                oldValue: 'name2',
                newValue: 'name02'
            }
        ]);
    });

    it('should compare non object', function () {
        var changes = diff({test: 1}, 'test');

        expect(changes).to.deep.equal([
            {
                type: 'change',
                oldPath: [],
                newPath: [],
                oldValue: {test: 1},
                newValue: 'test'
            }
        ]);
    });

    it('should handle idProp: * to compare arrays as is', function () {
        var changes = diff(
            [
                {a: 1},
                {a: 2}
            ],
            [
                {a: 1},
                {a: 2}
            ],
            {idProp: '*'}
        );

        expect(changes.length).to.equal(0);

        changes = diff(
            [
                {a: 1},
                {a: 2}
            ],
            [
                {a: 2},
                {a: 1},
                {a: 3}
            ],
            {idProp: '*'}
        );

        expect(changes).to.deep.equal([
            {
                oldPath: [0, 'a'],
                newPath: [0, 'a'],
                type: 'change',
                oldValue: 1,
                newValue: 2
            },
            {
                oldPath: [1, 'a'],
                newPath: [1, 'a'],
                type: 'change',
                oldValue: 2,
                newValue: 1
            },
            {
                oldPath: [],
                newPath: [],
                type: 'add-item',
                oldIndex: -1,
                curIndex: -1,
                newIndex: 2,
                newValue: {a: 3}
            }
        ]);

        changes = diff(
            [
                {a: 1},
                {a: 2},
                {a: 3},
                {a: 4}
            ],
            [
                {a: 1},
                {a: 2}
            ],
            {idProp: '*'}
        );

        expect(changes).to.deep.equal([
            {
                oldPath: [],
                newPath: [],
                type: 'remove-item',
                oldIndex: 2,
                curIndex: 2,
                newIndex: -1,
                oldValue: {a: 3}
            },
            {
                oldPath: [],
                newPath: [],
                type: 'remove-item',
                oldIndex: 3,
                curIndex: 2,
                newIndex: -1,
                oldValue: {a: 4}
            }
        ]);
    });

    it('should handle comparators: [] to compare custom class objects', function () {
        var cb = sinon.spy(function (a, b, ops) {
			expect(a).to.be.instanceOf(Date);
			expect(b).to.be.instanceOf(Date);

			expect(ops).to.deep.equal({
				oldPath: ['prop', 'date'],
				newPath: ['prop', 'date']
			});

            return a.toString() === b.toString();
		});

        var changes = diff(
            {
                prop: {
                    test1: {},
                    test2: [{}],
                    date: new Date()
                }
            },
            {
                prop: {
					test1: {},
					test2: [{}],
                    date: new Date()
                }
            },
            {
                comparators: [
                    [Date, cb]
                ]
            }
        );

        expect(changes).to.deep.equal([]);
        expect(cb).to.have.callCount(1);

        var nowDate = new Date();
        var prevDate = new Date();
        prevDate.setHours(-1);

		changes = diff(
			{
				prop: {
					test1: 1,
					date: nowDate
				}
			},
			{
				prop: {
					test1: 2,
					date: prevDate
				}
			},
			{
				comparators: [
					[Date, cb]
				]
			}
		);

		expect(cb).to.have.callCount(2);
		expect(changes).to.deep.equal([
            {
                oldPath: ['prop', 'test1'],
                newPath: ['prop', 'test1'],
                type: 'change',
                oldValue: 1,
                newValue: 2
            },
            {
                oldPath: ['prop', 'date'],
                newPath: ['prop', 'date'],
                type: 'change',
                oldValue: nowDate,
                newValue: prevDate
            }
        ]);
    });

    it('should ignore', function () {
		var changes = diff(
			{
				prop: {
					test1: {
					    test11: 1
                    },
					test2: 1
				}
			},
			{
				prop: {
					test1: {
						test11: 2
					},
					test2: 2
				}
			},
			{
				ignore: function (a, b, ops) {
					return ops.oldPath.join('.') === 'prop.test1';
				}
			}
		);

		expect(changes).to.deep.equal([
			{
				oldPath: ['prop', 'test2'],
				newPath: ['prop', 'test2'],
				type: 'change',
				oldValue: 1,
				newValue: 2
			}
        ]);

		var root = {
			prop: {
			    test2: 2
            }
        };

		root.prop.test1 = root;

		changes = diff(
			root,
			{
				prop: {
					test1: {},
                    test2: 3
				}
			},
			{
				ignore: function (oldObj, newObj, options) {
					var parent = root;

					if (options.oldPath.length === 0) return false;
					if (parent === oldObj) return true;

					return options.oldPath.slice(0, -1).find(function (prop) {
						parent = parent[prop];
						return parent === oldObj;
					});
				}
			}
		);

		expect(changes).to.deep.equal([
			{
				oldPath: ['prop', 'test2'],
				newPath: ['prop', 'test2'],
				type: 'change',
				oldValue: 2,
				newValue: 3
			}
		]);
    });
});