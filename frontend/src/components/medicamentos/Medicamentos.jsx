import MedicamentosListado from "./MedicamentosListado";
import MedicamentosRegistro from "./MedicamentosRegistro";
import MedicamentosBuscar from "./MedicamentosBuscar";
import { tipoMedicamentosService } from "../../services/tipoMedicamentos.service";
import { medicamentosService } from "../../services/medicamentos.service";
import React, { useState, useEffect } from "react";
import modalDialogService from "../../services/modalDialog.service";
import moment from "moment";

function Medicamentos() {
    const TituloAccionABMC = {
      A: "(Agregar)",
      B: "(Eliminar)",
      M: "(Modificar)", 
      C: "(Consultar)",
      L: "(Listado)",
    };
    const [AccionABMC, setAccionABMC] = useState("L");
    const [Nombre, setNombre] = useState("");
    const [TipoMedicamentos, setTipoMedicamentos] = useState(null);
    const [Items, setItems] = useState(null);
    const [Item, setItem] = useState(null); // usado en BuscarporId (Modificar, Consultar)
    const [Func, setFunc] = useState(null); 

    useEffect(() => {
        async function BuscarTipoMedicamentos() {
          let data = await tipoMedicamentosService.Buscar();
          setTipoMedicamentos(data);
        }
        BuscarTipoMedicamentos();
      }, []);


  
    async function Buscar() {
      modalDialogService.BloquearPantalla(true);
      const data = await medicamentosService.Buscar(Nombre);
      modalDialogService.BloquearPantalla(false);
      setItems(data);
    }
  
  
    async function BuscarPorId(item, accionABMC) {
      const data = await medicamentosService.BuscarPorId(item);
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
          FechaLanzamiento: moment(new Date()).format("YYYY-MM-DD"),
          IdTipoMedicamento:'',
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
          await medicamentosService.ActivarDesactivar(item);
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
        await medicamentosService.Grabar(item, Func);
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
        Medicamentos <small>{TituloAccionABMC[AccionABMC]}</small>{" "}
      </div>

      {AccionABMC === "L" && (
        <MedicamentosBuscar
          Nombre={Nombre}
          setNombre={setNombre}
          Buscar={Buscar}
          Agregar={Agregar}
        />
      )}

      {/* Tabla de resutados de busqueda y Paginador */}
      {AccionABMC === "L" && Items?.length > 0 &&
              <MedicamentosListado
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
              <MedicamentosRegistro
              {...{ AccionABMC, Item, Grabar, Volver,TipoMedicamentos, Func }}
              />
          }
      </div>
      </div>
    );
  }
  export {Medicamentos};
  