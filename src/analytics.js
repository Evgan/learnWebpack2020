function createAnalytic() {
    let counter = 0;
    let isDestroyed = false;
    const listener = () => counter++;

    document.addEventListener('click', listener)

    return {
        destroy() {
            document.removeEventListener('click', listener);
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

window.analytics = createAnalytic();
