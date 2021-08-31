namespace PoolBox.My {

    /**
     * Maps all identical fields of one object to another
     */
    export function mapObject(source: any, destination: any, omitNulls = false) {
        for (var field in source) {
            if (omitNulls && field == null)
                return;

            if (destination.hasOwnProperty(field) && typeof (source[field]) == typeof (destination[field]))
                destination[field] = source[field];
        }
    }

    export function disableHtmlElement(element: HTMLElement) {
        element.style.pointerEvents = 'none';
        element.style.opacity = '0.6';
    }

    export function  enableHtmlElement(element: HTMLElement) {
        element.style.pointerEvents = 'auto';
        element.style.opacity = '1';
    }

    export function  hideHtmlElement(element: HTMLElement) {
        element.style.display = 'none'
    }

    export function  showHtmlElement(element: HTMLElement, displayValue: string = 'block') {
        element.style.display = displayValue;
    }

}