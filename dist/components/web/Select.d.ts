import { type SelectHTMLAttributes } from "react";
interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "name"> {
    name: string;
    label?: string;
    options: Array<{
        value: string | number;
        label: string;
        disabled?: boolean;
    }>;
    placeholder?: string;
    showError?: boolean;
    containerClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
}
export declare const Select: import("react").ForwardRefExoticComponent<SelectProps & import("react").RefAttributes<HTMLSelectElement>>;
export {};
//# sourceMappingURL=Select.d.ts.map