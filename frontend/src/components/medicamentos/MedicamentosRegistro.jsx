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

export default function MedicamentosRegistro({
  AccionABMC,
  Item,
  Grabar,
  Volver,
  TipoMedicamentos,
  Func
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

          {/* campo Nombre */}
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

          {/* campo Precio */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="Precio">
                Precio<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="number" step=".01"
                {...register("Precio", {
                  required: { value: true, message: "Precio es requerido" },
                  min: {
                    value: 0.01,
                    message: "Precio debe ser mayor a 0",
                  },
                  max: {
                    value: 99999.99,
                    message: "Precio debe ser menor o igual a 99999.99",
                  },
                })}
                className={
                  "form-control " + (errors?.Precio ? "is-invalid" : "")
                }
              />
              <div className="invalid-feedback">{errors?.Precio?.message}</div>
            </div>
          </div>

          {/* campo FechaLanzamiento */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="FechaLanzamiento">
                Fecha Lanzamiento<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="date"
                {...register("FechaLanzamiento", {
                  required: { value: true, message: "Fecha Lanzamiento es requerido" },
                  validate: validateDate,
                })}
                className={
                  "form-control " + (errors?.FechaLanzamiento ? "is-invalid" : "")
                }
              />
              <div className="invalid-feedback">
                {errors?.FechaLanzamiento?.message}
              </div>
            </div>
          </div>

          {/* campo IdTipoMedicamento */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="IdTipoMedicamento">
                Tipo Medicamento<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <select
                {...register("IdTipoMedicamento", {
                  required: { value: true, message: "Tipo Medicamento es requerido" },
                  valueAsNumber: true,
                })}
                className={
                  "form-control " +
                  (errors?.IdTipoMedicamento ? "is-invalid" : "")
                }
              >
                <option value="" key={1}></option>
                {TipoMedicamentos?.map((x) => (
                  <option value={x.IdTipoMedicamento} key={x.IdTipoMedicamento}>
                    {x.Nombre}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                {errors?.IdTipoMedicamento?.message}
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
                disabled
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
