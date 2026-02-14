import { IInputs } from "../generated/ManifestTypes";
import { History } from "../interfaces/data";
import { XrmRequest, XrmResponse } from "../interfaces/xrm";

// Global Xrm declaration for TypeScript
declare const Xrm: {
    WebApi: {
        online: {
            execute: (request: XrmRequest) => Promise<XrmResponse>;
        };
    };
};

export class XrmService {
    private static instance: XrmService | null = null;
    private context: ComponentFramework.Context<IInputs> | null = null;

    private constructor() {
    }

    static getInstance(): XrmService {
        XrmService.instance ??= new XrmService();
        return XrmService.instance;
    }

    setContext(context: ComponentFramework.Context<IInputs>): void {
        this.context = context;
    }

    async fetch(endpoint: string): Promise<object[]> {
        return new Promise((resolve, reject) => {
            fetch(endpoint)
                .then((response) => {
                    return response?.ok ? response.json(): reject(new Error(response.statusText));
                })
                .then((data: { value?: object[] }) => {
                    return resolve(data.value ?? []);
                })
                .catch((e: unknown) => reject(e instanceof Error ? e : new Error(String(e))));
        });
    }

    async execute(request: XrmRequest): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            try {
                if (!Xrm?.WebApi?.online) {
                    reject(new Error('Xrm.WebApi.online is not available'));
                    return;
                }

                const executePromise = Xrm.WebApi.online.execute(request);
                
                if (executePromise && typeof executePromise.then === 'function') {
                    executePromise.then(
                        (result: XrmResponse) => {
                            return result?.ok ? resolve(result?.json()) : reject(new Error(String(result?.ok)));
                        },
                        (error: unknown) => { 
                            return reject(error instanceof Error ? error : new Error(String(error))); 
                        }
                    ).catch((e: unknown) => reject(e instanceof Error ? e : new Error(String(e))));
                }
            } catch (e: unknown) {
                reject(e instanceof Error ? e : new Error(String(e)));
            }
        });
    }
}