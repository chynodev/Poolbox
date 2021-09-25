namespace PoolBox.Help {

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
    
    export interface ElementOptions {
        tagName: string,
        classNames?: string[],
        id?: string,
        innerHtml?: string,
        parentElement?: Element,
        childElements?: Element[] | NodeListOf<Element>
    }

    export function createElement(opt: ElementOptions) {
        let element = document.createElement(opt.tagName);

        opt.classNames?.forEach(x => element.classList.add(x));

        if (opt.id)
            element.id = opt.id;
        if (opt.innerHtml)
            element.innerHTML = opt.innerHtml;

        if (opt.parentElement)
            opt.parentElement.append(element);

        opt.childElements?.forEach(child => element.append(child));

        return element;
    }
}