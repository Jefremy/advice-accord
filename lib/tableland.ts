import { Database, Registry } from "@tableland/sdk";

// Define the schema for our tables
// We use a prefix to make them easily identifiable
const VAULT_TABLE_PREFIX = "advice_accord_vault";
const LOGS_TABLE_PREFIX = "advice_accord_logs";

export interface VaultSchema {
    id: number;
    owner: string;
    encrypted_metadata: string; // CID or JSON string of encrypted data
    created_at: number;
}

export interface AccessLogSchema {
    id: number;
    vault_id: number;
    accessor: string;
    action: string; // "VIEW", "GRANT", "REVOKE"
    timestamp: number;
}

export class TablelandManager {
    private db: Database;

    constructor(signer?: any) {
        // If a signer is provided (from Web3Auth), use it.
        // Otherwise, it defaults to a read-only connection if no signer is passed (depending on config)
        // For writing, we absolutely need a signer.
        this.db = new Database({ signer });
    }

    /**
     * Creates the Vaults table if it doesn't exist.
     * Returns the table name (e.g., advice_accord_vault_11155111_123).
     */
    async createVaultTable(): Promise<string> {
        const { meta: create } = await this.db
            .prepare(`CREATE TABLE ${VAULT_TABLE_PREFIX} (id integer primary key, owner text, encrypted_metadata text, created_at integer);`)
            .run();

        await create.txn?.wait();
        return create.txn?.names[0] || "";
    }

    /**
     * Creates the Access Logs table.
     */
    async createAccessLogsTable(): Promise<string> {
        const { meta: create } = await this.db
            .prepare(`CREATE TABLE ${LOGS_TABLE_PREFIX} (id integer primary key, vault_id integer, accessor text, action text, timestamp integer);`)
            .run();

        await create.txn?.wait();
        return create.txn?.names[0] || "";
    }

    /**
     * Writes a new vault entry.
     */
    async createVaultEntry(tableName: string, owner: string, encryptedMetadata: string) {
        const { meta: insert } = await this.db
            .prepare(`INSERT INTO ${tableName} (owner, encrypted_metadata, created_at) VALUES (?, ?, ?);`)
            .bind(owner, encryptedMetadata, Date.now())
            .run();

        await insert.txn?.wait();
        return insert;
    }

    /**
     * Lists all vault tables owned by the user.
     */
    async listVaultTables(owner: string): Promise<string[]> {
        // We need a signer to query the registry for owned tables
        // If db was initialized with a signer, we can use it.
        const registry = new Registry({ signer: this.db.config.signer });
        const tables = await registry.listTables(owner);

        // Filter for our specific vault tables
        const vaultTables = tables
            .map((t: any) => t.name || t.slug) // Handle potential property name differences
            .filter((name: string) => name && name.startsWith(VAULT_TABLE_PREFIX));

        return vaultTables;
    }

    /**
     * Reads all vaults for a specific owner.
     */
    async getVaultsByOwner(tableName: string, owner: string): Promise<VaultSchema[]> {
        // Use lower() for case-insensitive comparison
        const { results } = await this.db
            .prepare(`SELECT * FROM ${tableName} WHERE lower(owner) = lower(?);`)
            .bind(owner)
            .all<VaultSchema>();

        return results;
    }
    /**
     * Deletes a vault entry by ID.
     */
    async deleteVaultEntry(tableName: string, id: number) {
        const { meta: del } = await this.db
            .prepare(`DELETE FROM ${tableName} WHERE id = ?;`)
            .bind(id)
            .run();

        await del.txn?.wait();
        return del;
    }
}
