import sql from "mssql";

export interface SqlSettings { server: string; database: string; user: string; password: string; port?: number }

const SCHEMA = `
IF OBJECT_ID('dbo.Vehicles', 'U') IS NULL
CREATE TABLE dbo.Vehicles (Id NVARCHAR(36) NOT NULL PRIMARY KEY, Plate NVARCHAR(7) NOT NULL CONSTRAINT UQ_Vehicles_Plate UNIQUE,
  Model NVARCHAR(100) NOT NULL, CapacityKg DECIMAL(10,2) NOT NULL, Status NVARCHAR(20) NOT NULL, CreatedAt DATETIME2 NOT NULL, UpdatedAt DATETIME2 NOT NULL);
IF OBJECT_ID('dbo.Drivers', 'U') IS NULL
CREATE TABLE dbo.Drivers (Id NVARCHAR(36) NOT NULL PRIMARY KEY, Name NVARCHAR(120) NOT NULL, Cnh NVARCHAR(11) NOT NULL CONSTRAINT UQ_Drivers_Cnh UNIQUE,
  CnhCategory NVARCHAR(2) NOT NULL, Phone NVARCHAR(11) NOT NULL, Active BIT NOT NULL, CreatedAt DATETIME2 NOT NULL, UpdatedAt DATETIME2 NOT NULL);`;

/** Pool de conexões único com o Azure SQL; cria o schema na primeira conexão. */
export class SqlConnection {
  private poolPromise?: Promise<sql.ConnectionPool>;

  constructor(private readonly settings: SqlSettings) {}

  pool(): Promise<sql.ConnectionPool> {
    this.poolPromise ??= (async () => {
      const pool = await new sql.ConnectionPool({
        server: this.settings.server,
        database: this.settings.database,
        user: this.settings.user,
        password: this.settings.password,
        port: this.settings.port ?? 1433,
        // o Azure SQL serverless pode estar pausado: a primeira conexão demora
        connectionTimeout: 60000,
        requestTimeout: 30000,
        options: { encrypt: true, trustServerCertificate: this.settings.server === "localhost" },
        pool: { max: 5, min: 0, idleTimeoutMillis: 30000 },
      }).connect();
      await pool.request().batch(SCHEMA);
      return pool;
    })().catch((err) => {
      this.poolPromise = undefined;
      throw err;
    });
    return this.poolPromise;
  }

}

export { sql };
