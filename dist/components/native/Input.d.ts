interface ViewStyle {
    [key: string]: any;
}
interface TextStyle {
    [key: string]: any;
}
interface TextInputProps {
    value?: string;
    onChangeText?: (text: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    style?: any;
    accessibilityLabel?: string;
    accessibilityInvalid?: boolean;
    testID?: string;
    multiline?: boolean;
    numberOfLines?: number;
    keyboardType?: string;
    autoCapitalize?: string;
}
interface InputProps extends Omit<TextInputProps, "value" | "onChangeText" | "onBlur"> {
    name: string;
    label?: string;
    showError?: boolean;
    containerStyle?: ViewStyle;
    labelStyle?: TextStyle;
    inputStyle?: TextStyle;
    errorStyle?: TextStyle;
}
export declare const Input: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<any>>;
export {};
//# sourceMappingURL=Input.d.ts.map