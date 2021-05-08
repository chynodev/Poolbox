interface String {
    /**
    * Extension method: Checks if string contains substring. Alternative function to es6's includes function.
    */
    isSubstr(substr: string): boolean;
    /**
    * Extension method: Converts string to number
    */
    toNumber(): number;
}

String.prototype.isSubstr = function (substr: string) {
    return this.indexOf(substr) > -1;
};

String.prototype.toNumber = function () {
    return parseInt(this);
};

interface Number {
    /**
    * Extension method: Checks whether the number lies within the range of parameters.
    */
    isBetween(first: number, second: number, includingEqual?: boolean): boolean;
}

Number.prototype.isBetween = function (first: number, second: number, includingEqual: boolean = false) {
    return (includingEqual) ? (first <= this && this <= second) : (first < this && this < second);
};