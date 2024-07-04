import axios from "axios";
const urlResource = "http://localhost:3000/api/pacientes";


async function Buscar(Nombre) {
  const resp = await axios.get(urlResource, {
    params: { Nombre },
  });
  return resp.data;
}

async function BuscarPorId(item) {
  const resp = await axios.get(urlResource + "/" + item.NumDocumento);
  return resp.data;
}


async function ActivarDesactivar(item) {
  const updatedItem = { ...item, Activo: !item.Activo };
  await axios.put(urlResource + "/" + item.NumDocumento, updatedItem);
  //await axios.delete(urlResource + "/" + item.IdSala);      //baja fisica
}


async function Grabar(item, Func) {
  if (Func === "A") {
    await axios.post(urlResource, item);
  } else {
    await axios.put(urlResource + "/" + item.NumDocumento, item);
  }
}


export const pacientesService = {
  Buscar,BuscarPorId,ActivarDesactivar,Grabar
};
