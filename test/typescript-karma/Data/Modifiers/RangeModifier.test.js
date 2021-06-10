import DataTable from '/base/js/Data/DataTable.js';
import RangeModifier from '/base/js/Data/Modifiers/RangeModifier.js';

QUnit.test('RangeModifier.modify', function (assert) {
    const table = new DataTable({
        x: [ -2, -1, 0, 1, 2 ],
        y: [ 'a', 'b', 'c', 'd', 'e' ]
    });

    let modifier = new RangeModifier({});

    assert.deepEqual(
        modifier.modify(table).getRow(0),
        table.getRow(0),
        'Filtered table should contain same rows.'
    );

    modifier = new RangeModifier({
        ranges: [{
            column: 'y',
            minValue: 'A',
            maxValue: 'b'
        }]
    });

    assert.deepEqual(
        modifier.modify(table).getColumns(),
        {
            x: [ -2, -1 ],
            y: [ 'a', 'b' ]
        },
        'Filtered table should contain reduced number of rows.'
    );

});

QUnit.test('RangeModifier.modifyCell', function (assert) {
    const modifier = new RangeModifier({
            ranges: [{
                column: 'x',
                minValue: -10,
                maxValue: -2
            }, {
                column: 'y',
                minValue: 'e',
                maxValue: 'z'
            }]
        }),
        table = new DataTable({
            x: [ -2, -1, 0, 1, 2 ],
            y: [ 'a', 'b', 'c', 'd', 'e' ]
        });

    table.setModifier(modifier);

    const modified = table.modified;

    assert.deepEqual(
        modified.getRowObjects(),
        [{ x: -2, y: 'a' }, { x: 2, y: 'e' }],
        'Modified table should contain two rows.'
    );

    table.setCell('x', 0, -1.5);

    assert.deepEqual(
        modified.getRowObjects(),
        [{ x: 2, y: 'e' }],
        'Modified table should contain one row.'
    );
});

QUnit.test('RangeModifier.modifyColumns', function (assert) {
    const modifier = new RangeModifier({
            ranges: [{
                column: 'x',
                minValue: -10,
                maxValue: -2
            }, {
                column: 'y',
                minValue: 'e',
                maxValue: 'z'
            }]
        }),
        table = new DataTable({
            x: [ -2, -1, 0, 1, 2 ],
            y: [ 'a', 'b', 'c', 'd', 'e' ]
        });

    table.setModifier(modifier);

    const modified = table.modified;

    assert.deepEqual(
        modified.getRowObjects(),
        [{ x: -2, y: 'a' }, { x: 2, y: 'e' }],
        'Modified table should contain two rows.'
    );

    table.setColumns({
        'x': [-3, -2, 0]
    });

    assert.deepEqual(
        modified.getRowObjects(),
        [{ x: -3, y: 'a' }, { x: -2, y: 'b' }],
        'Modified table should contain two rows with valid values.'
    );
});

QUnit.test('RangeModifier.modifyRows', function (assert) {
    const modifier = new RangeModifier({
            ranges: [{
                column: 'x',
                minValue: -10,
                maxValue: -2
            }, {
                column: 'y',
                minValue: 'e',
                maxValue: 'z'
            }]
        }),
        table = new DataTable({
            x: [ -2, -1, 0, 1, 2 ],
            y: [ 'a', 'b', 'c', 'd', 'e' ]
        });

    table.setModifier(modifier);

    const modified = table.modified;

    assert.deepEqual(
        modified.getRowObjects(),
        [{ x: -2, y: 'a' }, { x: 2, y: 'e' }],
        'Modified table should contain two rows.'
    );

    table.setRows([{ 'x': -1.5 }], 0);

    assert.deepEqual(
        modified.getRowObjects(),
        [{ x: 2, y: 'e' }],
        'Modified table should contain one row.'
    );
});
