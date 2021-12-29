import { type Group } from "./group";
export function isGroup(target: unknown): target is Group {
    if (typeof target !== "object" || target === null) {
        return false;
    }
    if (!Array.isArray((target as Group).ids)) {
        return false;
    }
    if (!(target as Group).ids.every(value => typeof value === "number")) {
        return false;
    }
    if (!Array.isArray((target as Group).names)) {
        return false;
    }
    if (!(target as Group).names.every(value => typeof value === "string")) {
        return false;
    }
    return true;
}
