import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    user: process.env.ORACLE_USER || "system",
    password: process.env.ORACLE_PASSWORD || "2111",
    connectString: process.env.ORACLE_CONN_STR || "localhost:1521/xe",
};

// Enable "Thick Mode" for Oracle 10g support
try {
    // This is required to connect to Oracle versions older than 12.1
    // It requires the Oracle Instant Client to be installed on your system.
    oracledb.initOracleClient();
    console.log("Oracle Instant Client initialized (Thick Mode)");
} catch (err: any) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('NJS-010')) {
        console.log("Oracle Client already initialized.");
    } else {
        console.error("Warning: Oracle Instant Client not found. Attempting Thin mode connection...");
        console.error("Note: Oracle 10g requires Thick mode. If connection fails, please install Instant Client.");
    }
}


export async function getConnection() {
    return await oracledb.getConnection(dbConfig);
}

export async function execute(sql: string, binds: any = [], options: oracledb.ExecuteOptions = {}) {
    let connection: oracledb.Connection | undefined;
    try {
        connection = await getConnection();
        const execOptions = { autoCommit: true, ...options };
        return await connection.execute(sql, binds, execOptions);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (e) {
                console.error("Error closing connection:", e);
            }
        }
    }
}
