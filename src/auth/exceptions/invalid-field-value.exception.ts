export class InvalidFieldValueException extends Error {
    constructor(msg: string) {
        super(msg)
    }
}