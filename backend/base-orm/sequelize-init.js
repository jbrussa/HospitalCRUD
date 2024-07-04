/* contiene la definición del modelo de datos del ORM sequelize */

// configurar ORM sequelize
const { Sequelize, DataTypes } = require("sequelize");
//const sequelize = new Sequelize("sqlite:" + ruta de bd ); crea una instancia de Sequelize que se conecta a una base de datos SQLite
const sequelize = new Sequelize("sqlite:" + "./.data/hospital.db");

// definicion del modelo de datos
const Salas = sequelize.define(
  "Salas",
  {
    IdSala: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        min: {
          args: -1,
          msg: "Debe ser un numero positivo",
        },
      },
    },
    Ala: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        /* validacion del modelo con mensajes de error si falta un atributo necesario */
        notEmpty: {
          args: true,
          msg: "Ala es requerido",
        },
        len: {
          args: [2, 30],
          msg: "Ala debe ser tipo caracteres, entre 2 y 30 de longitud",
        },
      },
    },
    FechaUltimoControl: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Activo es requerido",
        },
      },
    },
    NumTipoSala: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  {
    // pongo hooks para pasar a mayusculas y evitar que se ingresen datos con espacios en blanco al inicio o al final ANTES DE LA VALIDACION DEL MODELO
    hooks: {
      beforeValidate: function (Salas, options) {
        if (typeof Salas.Ala === "string") {
          Salas.Ala =
            Salas.Ala.toUpperCase().trim(); /* upper case para mayuscula y trim para los espacios en blanco */
        }
      },
    },

    timestamps: false /* desactiva la creación automática de campos de marca de tiempo (createdAt y updatedAt) en el modelo. */,
  }
);

const TipoSalas = sequelize.define(
  "TipoSalas",
  {
    IdTipoSala: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    NombreTipoSala: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        /* validacion del modelo con mensajes de error si falta un atributo necesario */
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 30],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Activo es requerido",
        },
      },
    },
  },

  {
    hooks: {
      beforeValidate: function (TipoSalas, options) {
        if (typeof TipoSalas.Nombre === "string") {
          TipoSalas.Nombre =
            TipoSalas.Nombre.toUpperCase().trim(); /* upper case para mayuscula y trim para los espacios en blanco */
        }
      },
    },

    timestamps: false /* desactiva la creación automática de campos de marca de tiempo (createdAt y updatedAt) en el modelo. */,
  }
);

const Pacientes = sequelize.define(
  "Pacientes",
  {
    NumDocumento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        min: {
          value: 1000000,
          msg: "Debe tener 7 o mas caracteres positivos",
        },
        max: {
          value: 100000000,
          msg: "No debe tener mas de 9 caracteres",
        },
      },
    },
    Nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [2, 30],
          msg: "Nombre debe ser tipo caracteres, entre 2 y 30 de longitud",
        },
      },
    },
    Apellido: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Apellido es requerido",
        },
        len: {
          args: [2, 30],
          msg: "Apellido debe ser tipo caracteres, entre 2 y 30 de longitud",
        },
      },
    },
    FechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    IdObraSocial: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Activo es requerido",
        },
      },
    },
  },

  {
    // pongo hooks para pasar a mayusculas y evitar que se ingresen datos con espacios en blanco al inicio o al final ANTES DE LA VALIDACION DEL MODELO
    hooks: {
      beforeValidate: function (Pacientes, options) {
        if (typeof Pacientes.Nombre === "string") {
          Pacientes.Nombre = Pacientes.Nombre.toUpperCase().trim();
        }
        if (typeof Pacientes.Apellido === "string") {
          Pacientes.Apellido = Pacientes.Apellido.toUpperCase().trim();
        }
      },
    },
    timestamps: false,
  }
);

const ObraSociales = sequelize.define(
  "ObraSociales",
  {
    IdObraSocial: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        /* validacion del modelo con mensajes de error si falta un atributo necesario */
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 30],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Activo es requerido",
        },
      },
    },
  },

  {
    hooks: {
      beforeValidate: function (ObraSociales, options) {
        if (typeof ObraSociales.Nombre === "string") {
          ObraSociales.Nombre =
            ObraSociales.Nombre.toUpperCase().trim(); /* upper case para mayuscula y trim para los espacios en blanco */
        }
      },
    },

    timestamps: false /* desactiva la creación automática de campos de marca de tiempo (createdAt y updatedAt) en el modelo. */,
  }
);

const Medicos = sequelize.define(
  "Medicos",
  {
    IdMedico: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        /* validacion del modelo con mensajes de error si falta un atributo necesario */
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [2, 30],
          msg: "Nombre debe ser tipo caracteres, entre 2 y 30 de longitud",
        },
      },
    },
    Apellido: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        /* validacion del modelo con mensajes de error si falta un atributo necesario */
        notEmpty: {
          args: true,
          msg: "Apellido es requerido",
        },
        len: {
          args: [2, 30],
          msg: "Apellido debe ser tipo caracteres, entre 2 y 30 de longitud",
        },
      },
    },
    FechaIngreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    IdEspecialidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Activo es requerido",
        },
      },
    },
    include: "especialidad",
  },

  {
    // pongo hooks para pasar a mayusculas y evitar que se ingresen datos con espacios en blanco al inicio o al final ANTES DE LA VALIDACION DEL MODELO
    hooks: {
      beforeValidate: function (Medicos, options) {
        if (typeof Medicos.Nombre === "string") {
          Medicos.Nombre =
            Medicos.Nombre.toUpperCase().trim(); /* upper case para mayuscula y trim para los espacios en blanco */
        }
        if (typeof Medicos.Apellido === "string") {
          Medicos.Apellido = Medicos.Apellido.toUpperCase().trim();
        }
      },
    },
    timestamps: false,
  }
);

const Especialidades = sequelize.define(
  "Especialidades",
  {
    IdEspecialidad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        /* validacion del modelo con mensajes de error si falta un atributo necesario */
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 30],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Activo es requerido",
        },
      },
    },
  },

  {
    hooks: {
      beforeValidate: function (Especialidades, options) {
        if (typeof Especialidades.Nombre === "string") {
          Especialidades.Nombre =
            Especialidades.Nombre.toUpperCase().trim(); /* upper case para mayuscula y trim para los espacios en blanco */
        }
      },
    },

    timestamps: false /* desactiva la creación automática de campos de marca de tiempo (createdAt y updatedAt) en el modelo. */,
  }
);

const Medicamentos = sequelize.define(
  "Medicamentos",
  {
    IdMedicamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        /* validacion del modelo con mensajes de error si falta un atributo necesario */
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [2, 30],
          msg: "Nombre debe ser tipo caracteres, entre 2 y 30 de longitud",
        },
      },
    },
    Precio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    FechaLanzamiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    IdTipoMedicamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Activo es requerido",
        },
      },
    },
  },

  {
    // pongo hooks para pasar a mayusculas y evitar que se ingresen datos con espacios en blanco al inicio o al final ANTES DE LA VALIDACION DEL MODELO
    hooks: {
      beforeValidate: function (Medicamentos, options) {
        if (typeof Medicamentos.Nombre === "string") {
          Medicamentos.Nombre =
            Medicamentos.Nombre.toUpperCase().trim(); /* upper case para mayuscula y trim para los espacios en blanco */
        }
      },
    },
    timestamps: false,
  }
);

const TipoMedicamentos = sequelize.define(
  "TipoMedicamentos",
  {
    IdTipoMedicamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        /* validacion del modelo con mensajes de error si falta un atributo necesario */
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 30],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Activo es requerido",
        },
      },
    },
  },

  {
    hooks: {
      beforeValidate: function (TipoMedicamentos, options) {
        if (typeof TipoMedicamentos.Nombre === "string") {
          TipoMedicamentos.Nombre =
            TipoMedicamentos.Nombre.toUpperCase().trim(); /* upper case para mayuscula y trim para los espacios en blanco */
        }
      },
    },
    timestamps: false,
  }
);

// Relaciones entre tablas
Salas.belongsTo(TipoSalas, { foreignKey: "NumTipoSala", as: "tipoSala" });
Pacientes.belongsTo(ObraSociales, {
  foreignKey: "IdObraSocial",
  as: "obraSocial",
});
Medicamentos.belongsTo(TipoMedicamentos, {
  foreignKey: "IdTipoMedicamento",
  as: "tipoMedicamento",
});
Medicos.belongsTo(Especialidades, {
  foreignKey: "IdEspecialidad",
  as: "especialidad",
});

module.exports = {
  /* exporto los modelos de datos */ sequelize,
  Salas,
  TipoSalas,
  Pacientes,
  ObraSociales,
  Medicos,
  Especialidades,
  Medicamentos,
  TipoMedicamentos,
};
