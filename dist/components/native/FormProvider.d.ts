import { type ReactNode } from "react";
import type { FormContextValue } from "../../types";
interface FormProviderProps<T extends Record<string, any> = Record<string, any>> {
    children: ReactNode;
    form: FormContextValue<T>;
}
export declare function FormProvider<T extends Record<string, any> = Record<string, any>>({ children, form, }: FormProviderProps<T>): import("react/jsx-runtime").JSX.Element;
export declare function useFormContext<T extends Record<string, any> = Record<string, any>>(): FormContextValue<T>;
export {};
//# sourceMappingURL=FormProvider.d.ts.map