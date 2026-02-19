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
    // If it's already initialized, we don't want to crash.
    // On cloud platforms (Render/Vercel) where Thin mode is intended, this might fail,
    // but the app will attempt Thin mode connection later if Thick isn't available.
    if (err.message.includes('NJS-010')) {
        console.log("Oracle Client already initialized.");
    } else {
        console.error("Warning: Oracle Instant Client not found. Attempting Thin mode connection...");
    }
}

export async function getConnection() {
    return await oracledb.getConnection(dbConfig);
}

export async function execute(sql: string, binds: any = [], options: oracledb.ExecuteOptions = {}) {
    let connection;
    try {
        connection = await getConnection();
        if (options.autoCommit === undefined) options.autoCommit = true;
        return await connection.execute(sql, binds, options);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { }
        }
    }
}
