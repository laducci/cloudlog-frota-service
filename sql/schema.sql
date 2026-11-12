-- CloudLog · Microserviço de Frota · Azure SQL Database
-- O serviço também cria estas tabelas automaticamente na primeira conexão.
IF OBJECT_ID('dbo.Vehicles', 'U') IS NULL
CREATE TABLE dbo.Vehicles (
  Id          NVARCHAR(36)  NOT NULL PRIMARY KEY,
  Plate       NVARCHAR(7)   NOT NULL CONSTRAINT UQ_Vehicles_Plate UNIQUE,
  Model       NVARCHAR(100) NOT NULL,
  CapacityKg  DECIMAL(10,2) NOT NULL CONSTRAINT CK_Vehicles_Capacity CHECK (CapacityKg > 0),
  Status      NVARCHAR(20)  NOT NULL,
  CreatedAt   DATETIME2     NOT NULL,
  UpdatedAt   DATETIME2     NOT NULL
);

IF OBJECT_ID('dbo.Drivers', 'U') IS NULL
CREATE TABLE dbo.Drivers (
  Id          NVARCHAR(36)  NOT NULL PRIMARY KEY,
  Name        NVARCHAR(120) NOT NULL,
  Cnh         NVARCHAR(11)  NOT NULL CONSTRAINT UQ_Drivers_Cnh UNIQUE,
  CnhCategory NVARCHAR(2)   NOT NULL,
  Phone       NVARCHAR(11)  NOT NULL,
  Active      BIT           NOT NULL,
  CreatedAt   DATETIME2     NOT NULL,
  UpdatedAt   DATETIME2     NOT NULL
);
