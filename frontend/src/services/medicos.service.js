import axios from "axios";
const urlResource = "http://localhost:3000/api/medicos";


async function Buscar(Nombre) {
  const resp = await axios.get(urlResource, {
    params: { Nombre },
  });
  return resp.data;
}

async function BuscarPorId(item) {
  const resp = await axios.get(urlResource + "/" + item.IdMedico);
  return resp.data;
}


async function ActivarDesactivar(item) {
  const updatedItem = { ...item, Activo: !item.Activo };
  await axios.put(urlResource + "/" + item.IdMedico, updatedItem);
}


async function Grabar(item, Func) {
  if (Func === "A") {
    await axios.post(urlResource, item);
  } else {
    await axios.put(urlResource + "/" + item.IdMedico, item);
  }
}


export const medicosService = {
  Buscar,BuscarPorId,ActivarDesactivar,Grabar
};
