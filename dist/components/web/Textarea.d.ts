import { type TextareaHTMLAttributes } from "react";
interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
    name: string;
    label?: string;
    showError?: boolean;
    containerClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
}
export declare const Textarea: import("react").ForwardRefExoticComponent<TextareaProps & import("react").RefAttributes<HTMLTextAreaElement>>;
export {};
//# sourceMappingURL=Textarea.d.ts.map