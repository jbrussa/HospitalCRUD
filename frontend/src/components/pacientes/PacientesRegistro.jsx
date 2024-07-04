import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const validateDate = (value) => {
  const selectedDate = new Date(value);
  const currentDate = new Date();
  
  // Eliminar la hora, minutos, segundos y milisegundos para una comparación más precisa
  selectedDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  return selectedDate <= currentDate || "La fecha no puede ser mayor a la fecha actual";
};

export default function PacientesRegistro({
  AccionABMC,
  Item,
  Grabar,
  Func,
  Volver,
  ObrasSociales,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid, isSubmitted },
  } = useForm({ values: Item });

  const onSubmit = (data) => {
    Grabar(data, Func);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="container-fluid">
        <fieldset disabled={AccionABMC === "C"}>
          {/* campo Numero Documento */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="NumDocumento">
                Numero de Documento<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input disabled={AccionABMC === "M"}
                type="number"
                {...register("NumDocumento", {
                  required: { value: true, message: "Numero de Documento es requerido" },
                  min: {
                    value: 1000000,
                    message: "Debe tener 7 o mas caracteres positivos",
                  },
                  max: {
                    value: 100000000,
                    message: "No debe tener mas de 9 caracteres",
                  },
                })}
                className={
                  "form-control " + (errors?.NumDocumento ? "is-invalid" : "")
                }
              />
              <div className="invalid-feedback">{errors?.NumDocumento?.message}</div>
            </div>
          </div>

          {/* campo nombre */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="Nombre">
                Nombre<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="text"
                {...register("Nombre", {
                  required: { value: true, message: "Nombre es requerido" },
                  minLength: {
                    value: 2,
                    message: "Nombre debe tener al menos 2 caracteres",
                  },
                  maxLength: {
                    value: 30,
                    message: "Nombre debe tener como máximo 30 caracteres",
                  },
                })}
                autoFocus
                className={
                  "form-control " + (errors?.Nombre ? "is-invalid" : "")
                }
              />
              {errors?.Nombre && touchedFields.Nombre && (
                <div className="invalid-feedback">
                  {errors?.Nombre?.message}
                </div>
              )}
            </div>
          </div>

          {/* campo apellido */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="Apellido">
              Apellido<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="text"
                {...register("Apellido", {
                  required: { value: true, message: "Apellido es requerido" },
                  minLength: {
                    value: 2,
                    message: "Apellido debe tener al menos 2 caracteres",
                  },
                  maxLength: {
                    value: 30,
                    message: "Apellido debe tener como máximo 30 caracteres",
                  },
                })}
                autoFocus
                className={
                  "form-control " + (errors?.Apellido ? "is-invalid" : "")
                }
              />
              {errors?.Apellido && touchedFields.Apellido && (
                <div className="invalid-feedback">
                  {errors?.Apellido?.message}
                </div>
              )}
            </div>
          </div>

          {/* campo FechaNacimiento */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="FechaNacimiento">
                Fecha de Nacimiento<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="date"
                {...register("FechaNacimiento", {
                  required: { value: true, message: "Fecha de Nacimiento es requerido" },
                  validate: validateDate
                })}
                className={
                  "form-control " + (errors?.FechaNacimiento ? "is-invalid" : "")
                }
              />
              <div className="invalid-feedback">
                {errors?.FechaNacimiento?.message}
              </div>
            </div>
          </div>

          {/* campo IdObraSocial */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="IdObraSocial">
                Obra Social<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <select
                {...register("IdObraSocial", {
                  required: { value: true, message: "Obra Social es requerido" },
                })}
                className={
                  "form-control " +
                  (errors?.IdObraSocial ? "is-invalid" : "")
                }
              >
                <option value="" key={1}>Elija una obra social</option>
                {ObrasSociales?.map((x) => (
                  <option value={x.IdObraSocial} key={x.IdObraSocial}>
                    {x.Nombre}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                {errors?.IdObraSocial?.message}
              </div>
            </div>
          </div>


          {/* campo Activo */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="Activo">
                Activo<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <select
                name="Activo"
                {...register("Activo", {
                  required: { value: true, message: "Activo es requerido" },
                })}
                className={
                  "form-control" + (errors?.Activo ? " is-invalid" : "")
                }
              >
                <option value={null}></option>
                <option value={false}>NO</option>
                <option value={true}>SI</option>
              </select>
              <div className="invalid-feedback">{errors?.Activo?.message}</div>
            </div>
          </div>

        </fieldset>

        {/* Botones Grabar, Cancelar/Volver' */}
        <hr />
        <div className="row justify-content-center">
          <div className="col text-center botones">
            {AccionABMC !== "C" && (
              <button type="submit" className="btn btn-primary">
                <i className="fa fa-check"></i> Grabar
              </button>
            )}
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => Volver()}
            >
              <i className="fa fa-undo"></i>
              {AccionABMC === "C" ? " Volver" : " Cancelar"}
            </button>
          </div>
        </div>

        {/* texto: Revisar los datos ingresados... */}
        {!isValid && isSubmitted && (
          <div className="row alert alert-danger mensajesAlert">
            <i className="fa fa-exclamation-sign"></i>
            Revisar los datos ingresados...
          </div>
        )}

      </div>
    </form>
  );
}

