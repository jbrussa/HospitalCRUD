/* Este archivo contiene el codigo con la ejecución del script  para crear la base de datos */

// acceder a la base usando aa-sqlite (mas moderno)
const db = require("aa-sqlite");

async function CrearBaseSiNoExiste() {
  // abrir base, si no existe el archivo/base lo crea
  await db.open("./.data/hospital.db");

  let existe = false;
  let res = null;

  /* Tabla primaria juli */
  res = await db.get(
    /* funcion para consultar la bd con parametros (Consulta, array con valores que necesito */
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'Salas'" /* cuento las tablas llamadas salas (juli) */,
    []
  );
  if (res.contar > 0)
    existe = true; /* pregunta si hay registros y si los hay existe la bd */
  if (!existe) {
    /*  sino la crea */
    await db.run(
      "CREATE table Salas(IdSala INTEGER PRIMARY KEY AUTOINCREMENT, Ala text NOT NULL, FechaUltimoControl date NOT NULL, NumTipoSala INTEGER NOT NULL, Activo boolean, FOREIGN KEY(NumTipoSala) REFERENCES TipoSalas(IdTipoSala));"
    );
    console.log("tabla de Salas creada!");
    await db.run(
      /*  y le asigna algunos valores */
      "insert into Salas values	(1, 'este', '2023-06-01', 1, 1),(2,'oeste', '2023-06-05', 2, 1), (3,'norte', '2023-06-10', 3, 1), (4, 'sur', '2023-06-15', 1, 1), (5, 'este', '2023-06-20', 2, 1), (6, 'oeste', '2023-06-25', 3, 1), (7,'norte', '2023-06-30', 1, 1), (8,'sur', '2023-07-05', 2, 1), (9,'este', '2023-07-10', 3, 1), (10, 'oeste', '2023-07-15', 1, 1);"
    );
  }
  /* Tabla secundaria Juli */
  existe = false; /*  vuelvo a poner false para rpeguntar si existe otra tabla */
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'TipoSalas'" /* sqlite_schema es una tabla con las tablas que tengo */,
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      "CREATE table TipoSalas( IdTipoSala INTEGER PRIMARY KEY AUTOINCREMENT, NombreTipoSala text NOT NULL UNIQUE, Activo boolean);"
    );
    console.log("tabla TipoSalas creada!");
    await db.run(
      "insert into TipoSalas values (1,'Habitación', 1),(2,'quirófano', 1),(3,'consultorio', 1),(4,'Depósito', 1),(5,'Radiología', 1),(6,'Laboratorio', 1);"
    );
  }

  /* Tabla primaria Ezequiel */
  existe = false;
  sql =
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'Pacientes'";
  res = await db.get(sql, []);
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE table Pacientes( 
              NumDocumento INTEGER PRIMARY KEY
            , Nombre text
            , Apellido text
            , FechaNacimiento date
            , IdObraSocial INTEGER
            ,Activo boolean
            ,FOREIGN KEY (IdObraSocial) REFERENCES ObraSociales(IdObraSocial)
            );`
    );
    console.log("tabla Pacientes creada!");
    await db.run(
      "insert into Pacientes values (12345678, 'Juan', 'Pérez', '1985-03-15', 1, 1), (23456789, 'María', 'García', '1990-07-22', 2, 1),(34567890, 'Luis', 'Martínez', '1978-11-30', 3, 1),(45678901, 'Ana', 'López', '1983-05-10', 4, 1),(56789012, 'Carlos', 'González', '1995-01-25', 5, 1),(67890123, 'Marta', 'Rodríguez', '1987-08-15', 1, 1),(78901234, 'Jorge', 'Fernández', '1992-04-20', 2, 1),(89012345, 'Laura', 'Sánchez', '1980-09-30', 3, 1),(90123456, 'Pedro', 'Ramírez', '1989-12-05', 4, 1),(12340987, 'Lucía', 'Torres', '1993-07-01', 5, 1);"
    );
  }

  /* Tabla secundaria Ezequiel */
  existe = false;
  sql =
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'ObraSociales'";
  res = await db.get(sql, []);
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE table ObraSociales( 
              IdObraSocial INTEGER PRIMARY KEY AUTOINCREMENT
            , Nombre text
            , Activo boolean);`
    );
    console.log("tabla Obras Sociales creada!");
    await db.run(
      "insert into ObraSociales values (1,'OSDE', 1),(2,'Medife', 1),(3,'SwissMedical', 1),(4,'Omint', 1),(5,'Apross', 1);"
    );
  }

  /* Tabla primaria Aye */
  existe = false;
  sql =
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'Medicos'";
  res = await db.get(sql, []);
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE table Medicos( 
              IdMedico INTEGER PRIMARY KEY AUTOINCREMENT
            , Nombre text
            , Apellido text
            , FechaIngreso date
            , IdEspecialidad INTEGER
            , Activo boolean
            ,FOREIGN KEY (IdEspecialidad) REFERENCES Especialidades(IdEspecialidad));`
    );
    console.log("tabla Medicos creada!");
    await db.run(
      "insert into Medicos values (1, 'Carlos', 'García', '2021-05-10', 1, 1), (2, 'Ana', 'López', '2020-03-15', 2, 1), (3, 'María', 'Martínez', '2019-07-20', 3, 1), (4, 'Juan', 'Rodríguez', '2018-11-05',4, 1), (5, 'Luis', 'Hernández', '2022-01-25', 5, 1), (6, 'Laura', 'González', '2017-09-30', 6, 1), (7, 'Pedro', 'Sánchez', '2021-02-18', 6, 1), (8, 'Elena', 'Pérez', '2020-06-22', 2, 1), (9, 'José', 'Ramírez', '2019-10-12', 5, 1), (172, 'Lexie', 'Grey', '2023-04-05',2, 1);"
    );
  }

  /* Tabla secundaria Aye */
  existe = false;
  sql =
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'Especialidades'";
  res = await db.get(sql, []);
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE table Especialidades( 
              IdEspecialidad INTEGER PRIMARY KEY AUTOINCREMENT
            , Nombre text,
            Activo boolean);`
    );
    console.log("tabla Especialidades creada!");
    await db.run(
      "insert into Especialidades values (1,'Cardiología', 1),(2,'Neurología', 1),(3,'Pediatría', 1),(4,'Medico general', 1),(5,'Otorrinolaringología', 1), (6,'Dermatología', 1);"
    );
  }

  /* Tabla primaria Octi */
  existe = false;
  sql =
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'Medicamentos'";
  res = await db.get(sql, []);
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE table Medicamentos( 
              IdMedicamento INTEGER PRIMARY KEY AUTOINCREMENT
            , Nombre text
            , Precio INTEGER
            , FechaLanzamiento date
            , IdTipoMedicamento
            , Activo boolean
            , FOREIGN KEY (IdTipoMedicamento) REFERENCES TipoMedicamentos(IdTipoMedicamento));`
    );
    console.log("tabla Medicamentos creada!");
    await db.run(
      "insert into Medicamentos values (1, 'Paracetamol', 5.99, '2022-06-19', 1, 1), (2, 'Ibuprofeno', 7.50, '2021-11-23', 1, 1), (3, 'Amoxicilina', 12.30, '2020-05-15', 3, 1), (4, 'Loratadina', 8.20, '2019-08-25', 4, 1), (5, 'Omeprazol', 10.00, '2023-01-10', 5, 1), (6, 'Cetirizina', 6.50, '2018-03-30', 6, 1), (7, 'Metformina', 15.00, '2017-07-20', 4, 1), (8, 'Clonazepam', 20.00, '2022-11-11', 3, 1), (9, 'Azitromicina', 25.00, '2021-04-17', 2, 1), (10, 'Levotiroxina', 18.50, '2020-12-05', 4, 1);"
    );
  }

  /* Tabla secundaria Octi */
  existe = false;
  sql =
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'TipoMedicamentos'";
  res = await db.get(sql, []);
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE table TipoMedicamentos( 
              IdTipoMedicamento INTEGER PRIMARY KEY AUTOINCREMENT
            , Nombre text
            , Activo boolean);`
    );
    console.log("tabla TipoMedicamentos creada!");
    await db.run(
      "insert into TipoMedicamentos values (1,'Analgésico', 1),(2,'Antiinflamatorio', 1),(3,'Antibiótico', 1),(4,'Antivirales', 1),(5,'Antidepresivos', 1), (6,'Ansioliticos', 1);"
    );
  }

  // cerrar la base
  db.close();
}

CrearBaseSiNoExiste();

module.exports = CrearBaseSiNoExiste;               
