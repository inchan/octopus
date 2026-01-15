import Database from 'better-sqlite3';
import { migration_001 } from './migrations/001_initial';
import { migration_002 } from './migrations/002_add_mcp_url';

type DatabaseInstance = InstanceType<typeof Database>;

export class MigrationService {
    private migrations = [
        { id: 1, name: 'initial_schema', sql: migration_001 },
        { id: 2, name: 'add_mcp_url', sql: migration_002 }
    ];

    constructor(private db: DatabaseInstance) { }

    applyMigrations() {
        this.ensureMigrationTable();

        const appliedMigrations = this.getAppliedMigrations();
        const lastId = appliedMigrations.length > 0
            ? Math.max(...appliedMigrations.map(m => m.id))
            : 0;

        const pending = this.migrations.filter(m => m.id > lastId);

        if (pending.length === 0) {
            console.log('[Migration] No pending migrations.');
            return;
        }

        console.log(`[Migration] Applying ${pending.length} pending migrations...`);

        // Transactional migration
        const transaction = this.db.transaction(() => {
            for (const migration of pending) {
                console.log(`[Migration] Executing: ${migration.name} (${migration.id})`);
                this.db.exec(migration.sql);
                this.db.prepare('INSERT INTO _migrations (id, name, appliedAt) VALUES (?, ?, ?)')
                    .run(migration.id, migration.name, new Date().toISOString());
            }
        });

        transaction();
        console.log('[Migration] All migrations applied successfully.');
    }

    private ensureMigrationTable() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS _migrations (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                appliedAt TEXT NOT NULL
            );
        `);
    }

    private getAppliedMigrations(): { id: number; name: string }[] {
        return this.db.prepare('SELECT id, name FROM _migrations').all() as { id: number; name: string }[];
    }
}
