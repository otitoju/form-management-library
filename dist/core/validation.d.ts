import type { ValidationRule } from "../types";
export declare class FormValidator {
    static validate<T>(value: T, rules: ValidationRule<T>): string | null;
    private static isEmpty;
    private static isValidEmail;
    private static isValidUrl;
    private static isValidNumber;
    private static validateMin;
    private static validateMax;
}
export declare class Schema<T = any> {
    private rules;
    static string(): Schema<string>;
    static number(): Schema<number>;
    static email(): Schema<string>;
    static url(): Schema<string>;
    required(message?: string): this;
    min(value: number, message?: string): this;
    max(value: number, message?: string): this;
    pattern(regex: RegExp, message?: string): this;
    custom(validator: (value: T) => boolean | string): this;
    getRules(): ValidationRule<T>;
}
//# sourceMappingURL=validation.d.ts.map