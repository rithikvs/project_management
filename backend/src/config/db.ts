import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONN_STR,
};

// No need for initOracleClient() for Thin mode (oracledb 6.x+)
// This allows deployment to Render/Vercel without installing Instant Client.

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
