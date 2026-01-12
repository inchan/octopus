import Store from 'electron-store';
import { SettingsSchema } from '../../../shared/types';

export class SettingsService {
    private store: Store<SettingsSchema>;

    constructor() {
        this.store = new Store<SettingsSchema>({
            defaults: {
                theme: 'system',
                language: 'ko',
                autoSync: false,
            },
        });
    }

    get<K extends keyof SettingsSchema>(key: K): SettingsSchema[K] {
        return this.store.get(key);
    }

    set<K extends keyof SettingsSchema>(key: K, value: SettingsSchema[K]): void {
        this.store.set(key, value);
    }

    getAll(): SettingsSchema {
        return this.store.store;
    }
}
