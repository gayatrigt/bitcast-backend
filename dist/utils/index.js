"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSince = void 0;
__exportStar(require("./error"), exports);
__exportStar(require("./response"), exports);
const parseSince = (data) => {
    if (!data || data == 'undefined')
        return null;
    const amt = data.slice(0, data.length - 1);
    const unit = data.slice(data.length - 1);
    if (isNaN(parseInt(amt)) || !isNaN(parseInt(unit)))
        throw new Error("Invalid date format");
    const units = {
        H: 1000 * 60 * 60,
        D: 1000 * 60 * 60 * 24,
        W: 1000 * 60 * 60 * 24 * 7,
        M: 1000 * 60 * 60 * 24 * 7 * 4,
        Y: 1000 * 60 * 60 * 24 * 365,
    };
    const sinceinmilli = parseInt(amt) * units[unit.toUpperCase()];
    return new Date(Date.now() - sinceinmilli);
};
exports.parseSince = parseSince;
