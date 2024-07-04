import React, { useState, useEffect } from "react";
import moment from "moment";
import PacientesBuscar from "./PacientesBuscar";
import PacientesListado from "./PacientesListado";
import PacientesRegistro from "./PacientesRegistro";
import { pacientesService } from "../../services/pacientes.services";
import { pacientesObraSocialService } from "../../services/obrasocial.service";
import modalDialogService from "../../services/modalDialog.service";


function Pacientes() {
  const TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)",
  };
  const [AccionABMC, setAccionABMC] = useState("L");

  const [Nombre, setNombre] = useState("");

  const [Items, setItems] = useState(null);
  const [Item, setItem] = useState(null); // usado en BuscarporId (Modificar, Consultar)
  const [Func, setFunc] = useState(null);

  const [ObrasSociales, setObrasSociales] = useState(null);

  // cargar al "montar" el componente, solo la primera vez (por la dependencia [])
  useEffect(() => {
    async function BuscarObrasSociales() {
      let data = await pacientesObraSocialService.Buscar();
      setObrasSociales(data);
    }
    BuscarObrasSociales();
  }, []);

  async function Buscar() {
    modalDialogService.BloquearPantalla(true);
    const data = await pacientesService.Buscar(Nombre);
    modalDialogService.BloquearPantalla(false);
    setItems(data);
  }


  async function BuscarPorId(item, accionABMC) {
    const data = await pacientesService.BuscarPorId(item);
    setItem(data);
    setAccionABMC(accionABMC);
  }
  

  function Consultar(item) {
    BuscarPorId(item, "C"); // paso la accionABMC pq es asincrono la busqueda y luego de ejecutarse quiero cambiar el estado accionABMC
  }
  
  function Modificar(item) {
    if (!item.Activo) {
      modalDialogService.Alert("No puede modificarse un registro Inactivo.");
      return;
    }
    BuscarPorId(item, "M"); // paso la accionABMC pq es asincrono la busqueda y luego de ejecutarse quiero cambiar el estado accionABMC
  }

  async function Agregar() {
    setAccionABMC("A");
    setItem({
        NumDocumento: '',
        Nombre: '',
        Apellido: '',
        FechaNacimiento: moment(new Date()).format("YYYY-MM-DD"),
        IdObraSocial: '',
        Activo: true,
      });
      modalDialogService.Alert("preparando el Alta...");
  }

  async function ActivarDesactivar(item) {
    modalDialogService.Confirm(
      "Esta seguro que quiere " +
        (item.Activo ? "desactivar" : "activar") +
        " el registro?",
      undefined,
      undefined,
      undefined,
      async () => {
        await pacientesService.ActivarDesactivar(item);
        await Buscar();
      }
    );
  }


  async function Grabar(item, Func) {
    // agregar o modificar
    try
    {
      if (AccionABMC === "A") {
        Func = "A"
      } else {
        Func = "M"
      }
      await pacientesService.Grabar(item, Func);
    }
    catch (error)
    {
      modalDialogService.Alert(error?.response?.data?.message ?? error.toString())
      return;
    }
    await Buscar();
    Volver();
  
    setTimeout(() => {
      modalDialogService.Alert(
        "Registro " +
          (AccionABMC === "A" ? "agregado" : "modificado") +
          " correctamente."
      );
    }, 0);
  }
  

  // Volver/Cancelar desde Agregar/Modificar/Consultar
  function Volver() {
    setAccionABMC("L");
  }

  return (
    <div>
      <div className="tituloPagina">
        Pacientes <small>{TituloAccionABMC[AccionABMC]}</small>
      </div>

      {AccionABMC === "L" && (
        <PacientesBuscar
          Nombre={Nombre}
          setNombre={setNombre}
          Agregar={Agregar}
          Buscar={Buscar}
        />
      )}

      {/* Tabla de resutados de busqueda y Paginador */}
      {AccionABMC === "L" && Items?.length > 0 && (
        <PacientesListado
          {...{
            Items,
            Consultar,
            Modificar,
            ActivarDesactivar,
          }}
        />
      )}

      {AccionABMC === "L" && Items?.length === 0 && (
        <div className="alert alert-info mensajesAlert">
          <i className="fa fa-exclamation-sign"></i>
          No se encontraron registros...
        </div>
      )}

      {/* Formulario de alta/modificacion/consulta */}
      {AccionABMC !== "L" && (
        <PacientesRegistro
          {...{ AccionABMC, Item, Grabar,Func, Volver, ObrasSociales,}}
        />
      )}
    </div>
  );
}
export { Pacientes };
