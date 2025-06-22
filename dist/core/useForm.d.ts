import type { UseFormOptions, FormState, FormMethods } from "../types";
export declare function useForm<T extends Record<string, any> = Record<string, any>>(options?: UseFormOptions<T>): FormMethods<T> & {
    formState: FormState<T>;
};
//# sourceMappingURL=useForm.d.ts.map