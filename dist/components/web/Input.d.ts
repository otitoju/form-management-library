import { type InputHTMLAttributes } from "react";
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
    name: string;
    label?: string;
    showError?: boolean;
    containerClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
}
export declare const Input: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement>>;
export {};
//# sourceMappingURL=Input.d.ts.map