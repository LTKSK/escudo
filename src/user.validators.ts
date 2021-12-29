import { type User } from "./user";
export function isUser(target: unknown): target is User {
    if (typeof target !== "object" || target === null) {
        return false;
    }
    if (typeof (target as User).name !== "string") {
        return false;
    }
    if (typeof (target as User).age !== "number") {
        return false;
    }
    if (typeof (target as User).isAdmin !== "boolean") {
        return false;
    }
    return true;
}
