import { type InputHTMLAttributes } from "react";
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
    name: string;
    label?: string;
    showError?: boolean;
    containerClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
}
export declare const Checkbox: import("react").ForwardRefExoticComponent<CheckboxProps & import("react").RefAttributes<HTMLInputElement>>;
export {};
//# sourceMappingURL=Checkbox.d.ts.map