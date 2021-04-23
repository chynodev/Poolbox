interface String {
    /**
    * Extension method: Checks if string contains substring. Alternative function to es6's includes function.
    */
    isSubstr(substr: string): boolean;
}

String.prototype.isSubstr = function (substr: string) { return this.indexOf(substr) > -1 };