interface ViewStyle {
    [key: string]: any;
}
interface TextStyle {
    [key: string]: any;
}
interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}
interface SelectProps {
    name: string;
    label?: string;
    options: SelectOption[];
    placeholder?: string;
    showError?: boolean;
    containerStyle?: ViewStyle;
    labelStyle?: TextStyle;
    selectStyle?: TextStyle;
    errorStyle?: TextStyle;
    modalStyle?: ViewStyle;
    optionStyle?: TextStyle;
}
export declare function Select({ name, label, options, placeholder, showError, containerStyle, labelStyle, selectStyle, errorStyle, modalStyle, optionStyle, }: SelectProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Select.d.ts.map