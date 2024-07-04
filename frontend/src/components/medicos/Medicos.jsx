import MedicosBuscar from "./MedicosBuscar";
import MedicosListado from "./MedicosListado";
import MedicosRegistro from "./MedicosRegistro";
import { especialidadService } from "../../services/especialidad.service";
import { medicosService } from "../../services/medicos.service";
import React, { useState, useEffect } from "react";
import modalDialogService from "../../services/modalDialog.service";
import moment from "moment";

function Medicos() {
    const TituloAccionABMC = {
      A: "(Agregar)",
      B: "(Eliminar)",
      M: "(Modificar)", 
      C: "(Consultar)",
      L: "(Listado)",
    };
    const [AccionABMC, setAccionABMC] = useState("L");
    const [Nombre, setNombre] = useState("");
    const [Especialidades, setEspelidades] = useState(null);
    const [Items, setItems] = useState(null);
    const [Item, setItem] = useState(null); // usado en BuscarporId (Modificar, Consultar)
    const [Func, setFunc] = useState(null); 

    useEffect(() => {
        async function BuscarEspecialidades() {
          let data = await especialidadService.Buscar();
          setEspelidades(data);
        }
        BuscarEspecialidades();
      }, []);
  
    async function Buscar() {
      modalDialogService.BloquearPantalla(true);
      const data = await medicosService.Buscar(Nombre);
      modalDialogService.BloquearPantalla(false);
      setItems(data);
    }
  
  
    async function BuscarPorId(item, accionABMC) {
      const data = await medicosService.BuscarPorId(item);
      setItem(data);
      setAccionABMC(accionABMC);
    }
    
  
    function Consultar(item) {
      BuscarPorId(item, "C"); // paso la accionABMC pq es asincrono la busqueda y luego de ejecutarse quiero cambiar el estado accionABMC
    }
  
    function Modificar(item) {
      if (!item.Activo) {
        modalDialogService.Alert("No puede modificarse un registro inactivo .");
        return;
      }
      BuscarPorId(item, "M"); // paso la accionABMC pq es asincrono la busqueda y luego de ejecutarse quiero cambiar el estado accionABMC
    }
  
    async function Agregar() {
      setAccionABMC("A");
      setItem({
          Nombre: '',
          Apellido: '',
          FechaIngreso: moment(new Date()).format("YYYY-MM-DD"),
          IdEspecialidad:'',
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
          await medicosService.ActivarDesactivar(item);
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
        await medicosService.Grabar(item, Func);
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
      <div>
      <div className="tituloPagina">
        Medicos <small>{TituloAccionABMC[AccionABMC]}</small>{" "}
      </div>

      {AccionABMC === "L" && (
        <MedicosBuscar
          Nombre={Nombre}
          setNombre={setNombre}
          Buscar={Buscar}
          Agregar={Agregar}
        />
      )}

      {/* Tabla de resutados de busqueda y Paginador */}
      {AccionABMC === "L" && Items?.length > 0 &&
              <MedicosListado
                  {...{
                      Items,
                      Consultar,
                      Modificar,
                      ActivarDesactivar,
                  }}
              />
          }
  
          {AccionABMC === "L" && Items?.length === 0 &&
              <div className="alert alert-info mensajesAlert">
                  <i className="fa fa-exclamation-sign"></i>
                  No se encontraron registros...
              </div>
          }
  
          {/* Formulario de alta/modificacion/consulta */}
          {AccionABMC !== "L" && 
              <MedicosRegistro
              {...{ AccionABMC, Item, Grabar, Volver,Especialidades, Func }}
              />
          }
      </div>
      </div>
    );
  }
  export {Medicos};
