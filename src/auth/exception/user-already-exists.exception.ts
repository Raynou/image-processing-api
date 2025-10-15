export class UserAlreadyExistsException extends Error {
    constructor(msg: string) {
        super(msg)
    }
}