/* Importamos librerias */
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");

// crear servidor
const app = express();
app.use(express.json()); // es un middleware que le permita interpretar el json que recibe en el body
require("./base-orm/sqlite-init"); // crear base si no existe

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// controlar ruta (promesa)
app.get("/", (req, res) => {
  res.send("Backend inicial tp-integrador!");
});

// controlar que el servidor este activo
app.get("/_isalive", (req, res) =>{
  res.status(200).send("Ejecutandose desde: http://localhost:3000/")
});


// controlar que la url exista
app.get('/urlinexistente', (req, res) => {
  res.status(404).send('No encontrada!');
});

/* Importo rutas */
const salasRouter = require("./routes/salas");
app.use(salasRouter);
const tipoSalasRouter = require("./routes/tiposalas");
app.use(tipoSalasRouter);
const pacientesRouter = require("./routes/pacientes");
app.use(pacientesRouter);
const obrasocialesRouter = require("./routes/obrasociales");
app.use(obrasocialesRouter);
const medicosRouter = require("./routes/medicos");
app.use(medicosRouter);
const especialidadesRouter = require("./routes/especialidades");
app.use(especialidadesRouter);
const medicamentosRouter = require("./routes/medicamentos");
app.use(medicamentosRouter);
const tipomedicamentosRouter = require("./routes/tipomedicamentos");
app.use(tipomedicamentosRouter);


// levantar servidor en puerto 3000
if (!module.parent) {   // si no es llamado por otro módulo, es decir, si es el módulo principal -> levantamos el servidor
  const port = process.env.PORT || 3000;   // en producción se usa el puerto de la variable de entorno PORT
  app.locals.fechaInicio = new Date();
  app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
  });
}
module.exports = app; // para testing
