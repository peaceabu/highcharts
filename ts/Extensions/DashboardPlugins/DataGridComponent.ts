/* *
 *
 *  (c) 2012-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Karol Kolodziej
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Options from '../../Core/Options';
import type DataGrid from '../../DataGrid/DataGrid';

import Component from '../../Dashboard/Component/Component.js';
import DataStore from '../../Data/Stores/DataStore.js';
import DataGridSyncHandlers from './DataGridSyncHandlers.js';
import U from '../../Core/Utilities.js';
const {
    createElement,
    merge,
    uniqueKey
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * DataGrid component for the Highsoft Dashboard.
 * @private
 * @class
 * @name Highcharts.DashboardComponent
 */
class DataGridComponent extends Component<DataGridComponent.ChartComponentEvents> {

    /* *
     *
     *  Static properties
     *
     * */

    public static syncHandlers = DataGridSyncHandlers;
    public static DataGridConstructor?: typeof DataGrid;
    public static defaultOptions = merge(
        Component.defaultOptions,
        {
            dataGridClassName: 'dataGrid-container',
            dataGridID: 'dataGrid-' + uniqueKey(),
            dataGridOptions: {},
            editableOptions: [
                ...Component.defaultOptions.editableOptions,
                'dataGridClassName',
                'dataGridID'
            ],
            syncHandlers: DataGridSyncHandlers
        });

    /* *
     *
     *  Static Functions
     *
     * */

    public static fromJSON(
        json: DataGridComponent.ClassJSON
    ): DataGridComponent {
        const options = json.options;
        const dataGridOptions = JSON.parse(json.options.dataGridOptions || '');

        const component = new DataGridComponent(
            merge(
                options,
                {
                    dataGridOptions,
                    syncHandlers: DataGridComponent.syncHandlers
                }
            )
        );

        component.emit({
            type: 'fromJSON',
            json
        });

        return component;
    }

    /* *
     *
     *  Properties
     *
     * */

    public dataGrid?: DataGrid;
    public dataGridContainer: HTMLElement;
    public dataGridOptions: Partial<Options>;
    public options: DataGridComponent.DataGridOptions;
    public sync: Component['sync'];

    /* *
     *
     *  Constructor
     *
     * */

    constructor(options: Partial<DataGridComponent.DataGridOptions>) {
        options = merge(
            DataGridComponent.defaultOptions,
            options
        );

        super(options);

        this.options = options as DataGridComponent.DataGridOptions;
        this.type = 'DataGrid';
        this.dataGridContainer = createElement(
            'figure',
            void 0,
            void 0,
            void 0,
            true
        );

        if (this.options.dataGridClassName) {
            this.dataGridContainer.classList.add(
                this.options.dataGridClassName
            );
        }
        if (this.options.dataGridID) {
            this.dataGridContainer.id = this.options.dataGridID;
        }

        this.sync = new DataGridComponent.Sync(
            this,
            this.options.syncEvents,
            this.options.syncHandlers
        );

        this.dataGridOptions = (this.options.dataGridOptions || {} as any);

        if (this.store) {
            // this.on('tableChanged', (): void => this.updateSeries());

            // Reload the store when polling.
            this.store.on('afterLoad', (e: DataStore.Event): void => {
                if (e.table && this.store) {
                    this.store.table.setColumns(e.table.getColumns());
                }
            });
        }

        this.innerResizeTimeouts = [];

        // Add the component instance to the registry
        Component.addInstance(this);
    }

    /* *
     *
     *  Class methods
     *
     * */

    public load(): this {
        this.emit({ type: 'load' });
        super.load();
        this.parentElement.appendChild(this.element);
        this.contentElement.appendChild(this.dataGridContainer);
        this.hasLoaded = true;

        this.emit({ type: 'afterLoad' });

        return this;
    }

    public render(): this {
        this.emit({ type: 'beforeRender' });
        super.render();
        if (!this.dataGrid) {
            this.dataGrid = this.constructDataGrid();
        }
        this.sync.start();
        this.emit({ type: 'afterRender' });
        return this;
    }

    public redraw(): this {
        super.redraw();
        return this.render();
    }

    public update(options: Partial<DataGridComponent.DataGridOptions>): this {
        super.update(options);
        if (this.dataGrid) {
            this.dataGrid.update(this.options.dataGridOptions || {} as any);
        }
        this.emit({ type: 'afterUpdate' });
        return this;
    }


    private constructDataGrid(): DataGrid {
        if (DataGridComponent.DataGridConstructor) {
            this.dataGrid = new DataGridComponent.DataGridConstructor(
                this.dataGridContainer, {
                    ...this.options.dataGridOptions,
                    dataTable: this.store && this.store.table.modified
                });
            return this.dataGrid;
        }

        throw new Error('DataGrid not connected.');
    }


    public toJSON(): DataGridComponent.ClassJSON {
        const dataGridOptions = JSON.stringify(this.options.dataGridOptions);
        const base = super.toJSON();

        const json = {
            ...base,
            options: {
                ...base.options,
                dataGridOptions,
                syncEvents: this.sync.syncEvents
            }
        };

        this.emit({ type: 'toJSON', json });
        return json;
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace DataGridComponent {

    export type ComponentType = DataGridComponent;

    export type ChartComponentEvents =
        JSONEvent |
        Component.EventTypes;

    export type JSONEvent = Component.Event<'toJSON' | 'fromJSON', {
        json: ClassJSON;
    }>;

    export interface DataGridOptions extends Component.ComponentOptions, EditableOptions {
        dataGridClassName?: string;
        dataGridID?: string
    }

    export interface EditableOptions extends Component.EditableOptions {
        dataGridOptions?: DataGridOptions;
        chartClassName?: string;
        chartID?: string;
        tableAxisMap?: Record<string, string | null>;
    }

    export interface ComponentJSONOptions extends Component.ComponentOptionsJSON {
        dataGridOptions?: string;
        chartClassName?: string;
        chartID?: string;
    }
    export interface ClassJSON extends Component.JSON {
        options: ComponentJSONOptions;
    }
}

/* *
 *
 *  Default export
 *
 * */
export default DataGridComponent;