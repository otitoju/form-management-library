interface ViewStyle {
    [key: string]: any;
}
interface TextStyle {
    [key: string]: any;
}
interface CheckboxProps {
    name: string;
    label?: string;
    showError?: boolean;
    containerStyle?: ViewStyle;
    labelStyle?: TextStyle;
    checkboxStyle?: ViewStyle;
    errorStyle?: TextStyle;
}
export declare function Checkbox({ name, label, showError, containerStyle, labelStyle, checkboxStyle, errorStyle, }: CheckboxProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Checkbox.d.ts.map