/// <reference types="vite/client" />
/// <reference types="vite-plugin-electron/client" />

import { IElectronAPI } from "../shared/api";

declare global {
    interface Window {
        api: IElectronAPI;
    }
}
