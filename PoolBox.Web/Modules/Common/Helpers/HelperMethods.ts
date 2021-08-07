namespace PoolBox.HelperMethods {

    /**
     * Maps all identical fields of one object to another
     */
    export function mapObject(source: any, destination: any) {
        for (var field in source) {
            if (destination.hasOwnProperty(field) && typeof (source[field]) == typeof (destination[field]))
                destination[field] = source[field];
        }
    }

}