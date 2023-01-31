/* *
 * OpenStreetMap provider, used for tile map services
 * */

'use strict';

import type ProviderDefinition from '../ProviderDefinition';

import U from '../../Core/Utilities.js';

const {
    error
} = U;

export default class OpenStreetMap implements ProviderDefinition {
    subdomains = ['a', 'b', 'c'];

    themes = {
        standard: 'https://{s}.tile.openstreetmap.org/{zoom}/{x}/{y}.png',
        bicycle: 'https://{s}.tile.thunderforest.com/cycle/{zoom}/{x}/{y}.png'
    };

    initialProjectionName = 'WebMercator';

    credits = {
        standard: `Map data \u00a92023 <a href="https://www.openstreetmap.org/copyright">
            OpenStreetMap</a>`,
        bicycle: `Maps \u00a9 <a href="https://www.thunderforest.com">Thunderforest</a>,
            Data \u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>`
    };

    minZoom = 0;
    maxZoom = 19.99999;

    getCredits(theme: string | undefined): string {
        if (theme === 'bicycle') {
            return this.credits.bicycle;
        }
        return this.credits.standard;
    }

    getURL(
        subdomain?: string | undefined,
        theme?: string | undefined
    ): string {
        const { themes, subdomains } = this;
        let chosenTheme: string,
            chosenSubdomain: string;

        // Check for themes
        if (
            (theme && !Object.prototype.hasOwnProperty.call(themes, theme)) ||
            !theme
        ) {
            if (theme) {
                error(
                    'Missing option: Tiles provider theme cannot be reached, ' +
                    'using standard provider theme.',
                    false
                );
            }
            chosenTheme = 'standard';
        } else {
            chosenTheme = theme;
        }

        // Check for subdomains
        if ((subdomain && subdomains.indexOf(subdomain) === -1) ||
            !subdomain
        ) {
            if (subdomain) {
                error(
                    'Missing option: Tiles provider subdomain cannot be' +
                    ' reached, using default provider subdomain.',
                    false
                );
            }
            chosenSubdomain = subdomains[0];
        } else {
            chosenSubdomain = subdomain;
        }

        const url = themes[chosenTheme as keyof typeof themes]
            .replace('{s}', chosenSubdomain);

        return url;
    }
}