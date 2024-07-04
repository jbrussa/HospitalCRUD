import { useState, useEffect } from "react";
import moment from "moment";
import { SalasBuscar } from "./SalasBuscar";
import { SalasListado } from "./SalasListado";
import { SalasRegistro } from "./SalasRegistro";
import { salasServices } from "../../services/salas.service";
import { tipoSalasServices } from "../../services/tiposalas.service";
import modalDialogService from "../../services/modalDialog.service";

function Salas() {
  const TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)",
  };

  const [AccionABMC, setAccionABMC] = useState("L");

  const [Ala, setAla] = useState("");
  const [TipoSalas, setTipoSalas] = useState(null);

  const [Items, setItems] = useState(null);
  const [Item, setItem] = useState(null);
  const [Func, setFunc] = useState(null);

  useEffect(() => {
    async function BuscarTipoSalas() {
      let data = await tipoSalasServices.Buscar();
      setTipoSalas(data);
    }
    BuscarTipoSalas();
  }, []);

  async function Buscar() {
    modalDialogService.BloquearPantalla(true);
    const data = await salasServices.Buscar(Ala);
    modalDialogService.BloquearPantalla(false);
    setItems(data);
  }

  async function BuscarPorId(item, accionABMC) {
    const data = await salasServices.BuscarPorId(item);
    setItem(data);
    setAccionABMC(accionABMC);
  }

  function Consultar(item) {
    BuscarPorId(item, "C");
  }

  function Modificar(item) {
    if (!item.Activo) {
      modalDialogService.Alert("No puede modificarse un registro Inactivo.");
      return;
    }
    BuscarPorId(item, "M");
  }

  async function Agregar() {
    setAccionABMC("A");
    setItem({
      Ala: "",
      FechaUltimoControl: moment(new Date()).format("YYYY-MM-DD"),
      Activo: true,
      NumTipoSala: 0,
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
        await salasServices.ActivarDesactivar(item);
        await Buscar();
      }
    );
  }

  /* Metodo grabar o modificar */
  async function Grabar(item, Func) {
    try {
      if (AccionABMC === "A") {
        Func = "A";
      } else {
        Func = "M";
      }
      await salasServices.Grabar(item, Func);
    } catch (error) {
      modalDialogService.Alert(
        error?.response?.data?.message ?? error.toString()
      );
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
        Salas <small>{TituloAccionABMC[AccionABMC]}</small>{" "}
      </div>

      {AccionABMC === "L" && (
        <SalasBuscar
          Ala={Ala}
          setAla={setAla}
          Buscar={Buscar}
          Agregar={Agregar}
        />
      )}

      {/* Tabla de resutados de busqueda*/}
      {AccionABMC === "L" && Items?.length > 0 && (
        <SalasListado
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
        <SalasRegistro
          {...{
            AccionABMC,
            Item,
            Grabar,
            Volver,
            TipoSalas,
            setTipoSalas,
            Func,
          }}
        />
      )}
    </div>
  );
}
export { Salas };
