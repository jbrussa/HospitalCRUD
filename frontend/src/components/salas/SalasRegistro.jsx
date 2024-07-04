import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const validateDate = (value) => {
  const selectedDate = new Date(value);
  const currentDate = new Date();

  // Eliminar la hora, minutos, segundos y milisegundos para una comparación más precisa
  selectedDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  return (
    selectedDate <= currentDate ||
    "La fecha no puede ser mayor a la fecha actual"
  );
};

function SalasRegistro({
  AccionABMC,
  TipoSalas,
  setTipoSalas,
  Item,
  Grabar,
  Func,
  Volver,
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
          {/* campo IdSala */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="IdSala">
                Id de Sala<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                disabled={AccionABMC === "M"}
                type="number"
                {...register("IdSala", {
                  required: {
                    value: true,
                    message: "IdSala es requerido",
                  },
                  min: {
                    value: 0,
                    message: "Debe ser un numero positivo",
                  },
                })}
                className={
                  "form-control " + (errors?.IdSala ? "is-invalid" : "")
                }
              />
              <div className="invalid-feedback">{errors?.IdSala?.message}</div>
            </div>
          </div>

          {/* campo Ala */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="Ala">
                Ala<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="text"
                {...register("Ala", {
                  required: { value: true, message: "Ala es requerido" },
                  minLength: {
                    value: 2,
                    message: "Ala debe tener al menos 2 caracteres",
                  },
                  maxLength: {
                    value: 30,
                    message: "Ala debe tener como máximo 30 caracteres",
                  },
                })}
                autoFocus
                className={"form-control " + (errors?.Ala ? "is-invalid" : "")}
              />
              {errors?.Ala && touchedFields.Ala && (
                <div className="invalid-feedback">{errors?.Ala?.message}</div>
              )}
            </div>
          </div>

          {/* campo FechaUltimoControl */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="FechaUltimoControl">
                FechaUltimoControl<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <input
                type="date"
                {...register("FechaUltimoControl", {
                  required: {
                    value: true,
                    message: "FechaUltimoControl es requerido",
                  },
                  validate: validateDate,
                })}
                className={
                  "form-control " +
                  (errors?.FechaUltimoControl ? "is-invalid" : "")
                }
              />
              <div className="invalid-feedback">
                {errors?.FechaUltimoControl?.message}
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

          {/* campo NumTipoSala */}
          <div className="row">
            <div className="col-sm-4 col-md-3 offset-md-1">
              <label className="col-form-label" htmlFor="NumTipoSala">
                Tipo de Sala<span className="text-danger">*</span>:
              </label>
            </div>
            <div className="col-sm-8 col-md-6">
              <select
                {...register("NumTipoSala", {
                  required: {
                    value: true,
                    message: "NumTipoSala es requerido",
                  },
                })}
                className={
                  "form-control " + (errors?.NumTipoSala ? "is-invalid" : "")
                }
              >
                <option value="" key={1}></option>
                {TipoSalas?.map((x) => (
                  <option value={x.IdTipoSala} key={x.IdTipoSala}>
                    {x.NombreTipoSala}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                {errors?.NumTipoSala?.message}
              </div>
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

export { SalasRegistro };
