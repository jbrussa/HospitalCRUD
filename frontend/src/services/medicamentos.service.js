import axios from "axios";

const urlResource = "http://localhost:3000/api/medicamentos"

async function Buscar(Nombre) {
    const resp = await axios.get(urlResource, {
      params: { Nombre },
    });
    return resp.data;
  }
    
  async function BuscarPorId(item) {
    const resp = await axios.get(urlResource + "/" + item.IdMedicamento);
    return resp.data;
  }
  
  
  async function ActivarDesactivar(item) {
    await axios.delete(urlResource + "/" + item.IdMedicamento);
  }
  
  async function Grabar(item, Func) {
    if (Func === "A") {
      await axios.post(urlResource, item);
    } else {
      await axios.put(urlResource + "/" + item.IdMedicamento, item);
    }
  }
  
  
  export const medicamentosService = {
    Buscar,
    BuscarPorId,
    ActivarDesactivar,
    Grabar,
  };
  