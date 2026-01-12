import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';
import { MigrationService } from './MigrationService';

type DatabaseType = InstanceType<typeof Database>;

export class DatabaseService {
    private db: DatabaseType;

    constructor(customPath?: string) {
        let dbPath: string;

        if (customPath) {
            dbPath = customPath;
        } else {
            const userDataPath = app.getPath('userData');
            dbPath = path.join(userDataPath, 'align-agents-v2.db');

            // Ensure directory exists
            const dbDir = path.dirname(dbPath);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }
        }

        console.log(`[DB] Opening database at ${dbPath}`);
        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');

        this.applyMigrations();
    }

    private applyMigrations() {
        const migrationService = new MigrationService(this.db);
        migrationService.applyMigrations();
    }

    public getDatabase(): DatabaseType {
        return this.db;
    }

    // Add close method for testing
    public close() {
        if (this.db) {
            this.db.close();
        }
    }
}



// Singleton instance
let dbInstance: DatabaseService | null = null;
export function getDb(): DatabaseType {
    if (!dbInstance) {
        dbInstance = new DatabaseService();
    }
    return dbInstance.getDatabase();
}

// Test Helper
export const db = {
    close: () => {
        if (dbInstance) {
            dbInstance.close();
            dbInstance = null;
        }
    }
};

export function initDb(path: string) {
    if (dbInstance) {
        dbInstance.close();
    }
    dbInstance = new DatabaseService(path);
    return dbInstance.getDatabase();
}
