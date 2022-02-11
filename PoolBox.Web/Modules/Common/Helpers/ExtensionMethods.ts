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

interface Date {
    /**
    * Extension method: Returns month name in a 3-word abbreviation.
    */
    getMonthString(): string;
}

Date.prototype.getMonthString = function () {
    let monthNumber = this.getMonth();

    switch (monthNumber) {
        case 0: return 'Jan';
        case 1: return 'Feb';
        case 2: return 'Mar';
        case 3: return 'Apr';
        case 4: return 'May';
        case 5: return 'Jun';
        case 6: return 'Jul';
        case 7: return 'Aug';
        case 8: return 'Sep';
        case 9: return 'Oct';
        case 10: return 'Nov';
        case 11: return 'Dec';
        default: return '';
    }
};