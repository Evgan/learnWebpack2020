import * as $ from 'jquery';
function createAnalytic(): object {
    let counter = 0;
    let isDestroyed: boolean = false;
    const listener = (): number => counter++;

    $(document).on('click', listener)

    return {
        destroy() {
            $(document).off('click', listener);
            isDestroyed = true;
        },

        getClicks() {
            if (isDestroyed) {
                console.log('Analytics is destroyed 2');
            }

            return counter
        }
    }
}

window['analytics'] = createAnalytic();
