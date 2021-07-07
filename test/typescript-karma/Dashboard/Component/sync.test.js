import ChartComponent from '/base/js/Dashboard/Component/ChartComponent.js';
import CSVStore from '/base/js/Data/Stores/CSVStore.js';

const { test, only, skip } = QUnit;

test('Both components should work', (assert) => {

    const store = new CSVStore(undefined, {
        csv: 'a,b,c\n1,2,3',
        firstRowAsNames: true
    });

    store.load();

    const components = [
        new ChartComponent({
            store,
            syncEvents: ['visibility']
        }),
        new ChartComponent({
            store,
            syncEvents: ['visibility']
        })
    ];


    components.forEach(comp => comp.render());

    const [comp1, comp2] = components;
    assert.strictEqual(comp1.chart.series.length, 3);
    assert.strictEqual(comp1.chart.series.length, comp2.chart.series.length);


    // Test that turnining sync on/off works
    comp1.chart.series[0].hide();
    assert.strictEqual(
        comp2.chart.series[0].visible,
        false,
        'Hiding series in comp1 should also hide it in comp2'
    );

    comp2.sync.stop(); // stop the sync for comp2

    comp1.chart.series[0].show();

    assert.strictEqual(
        comp2.chart.series[0].visible,
        false,
        'Series in comp2 should still be hidden as sync is off'
    );

    comp2.sync.start(); // Restart sync for comp2

    comp1.chart.series[0].show();

    assert.strictEqual(
        comp2.chart.series[0].visible,
        true
    );

    // Same but turn off/on in comp1
    comp1.sync.stop(); // stop the sync for comp1

    comp1.chart.series[0].hide();

    assert.strictEqual(
        comp2.chart.series[0].visible,
        true,
        'Series in comp2 should still be shown as sync is off'
    );

    comp1.sync.start(); // Restart sync for comp1

    comp1.chart.series[0].hide();

    assert.strictEqual(
        comp2.chart.series[0].visible,
        false
    );

    components.forEach(comp => comp.destroy());
});

