import React, { useState } from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import "../Styles/Rutas.css";
import { useNavigate } from "react-router-dom";
import { useListarElementos } from "../Hooks/CRUDHooks";
import { rutasURL, rutasxEmpresaURL } from "../API/apiurls";
import { BsXCircleFill } from "react-icons/bs";
import { GrEdit } from "react-icons/gr";
import Swal from "sweetalert2";
import axios from "axios";
import RutasModal from "./RutasModal";
import { paisesURL } from "./../API/apiurls";

export function Rutas() {
  const [datos, setDatos] = useState([]);
  const navigation = useNavigate();
  const empresaid = localStorage.getItem("empresa");
  const empresaNombre = localStorage.getItem("empresaNombre");
  const [show, setShow] = useState(false);
  const [datosEdit, setDatosEdit] = useState(null);
  useListarElementos(`${rutasxEmpresaURL}${empresaid}`, datos, setDatos);

  const handleVerCoordenadas = async (dato) => {
    await localStorage.setItem("nomRuta", dato.nomruta);
    navigation(`/coordenadas/${dato.id}`);
  };

  const handleEliminar = (id) => {
    Swal.fire({
      title: `¿Esta seguro de eliminar esta ruta? ${id}`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar ruta",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${rutasURL}/${id}`)
          .then(() => {
            // Filtra los datos para mantener solo los registros que no tienen el ID eliminado
            const nuevosDatos = datos.filter((ruta) => ruta.id !== id);
            setDatos(nuevosDatos); // Actualiza la variable de estado
            Swal.fire("Eliminado", "La ruta ha sido eliminada", "success");
          })
          .catch((error) => {
            console.error("Error al eliminar los datos:", error);
            Swal.fire(
              "Error",
              "Hubo un error al eliminar el registro",
              "error"
            );
          });
      }
    });
  };

  const handleAbrir = () => {
    setShow(true);
  };

  const handleCerrar = () => {
    setShow(false);
  };

  const datosAEditar = (camion) => {
    setDatosEdit(camion);
    setShow(true);
  };

  const handleGuardar = (datosFormulario) => {
    const requestData = {
      nomruta: datosFormulario.nomruta,
      empresasModel: {
        id: empresaid,
      },
      paisesModel: {
        id: datosFormulario.paisId,
        nombre: datosFormulario.paisNombre
      },
    };

    axios
      .post(`${rutasURL}`, requestData)
      .then((response) => {
        setDatos([...datos, response.data]);
        setShow(false);
      })
      .catch((error) => {
        console.error("Error al guardar los datos:", error);
      });
  };

  const handleEditar = (dato) => {
    console.log(dato)
    const requestData = {
        nomruta: dato.nomruta,
        empresasModel: {
          id: empresaid,
        },
        paisesModel: {
          id: dato.paisId,
          nombre: dato.paisNombre
        },
      };
  
    axios
      .put(`${rutasURL}/${dato.id}`, requestData)
      .then((response) => {
        // Actualiza los datos localmente en la lista
        const indice = datos.findIndex((item) => item.id === dato.id);
        if (indice !== -1) {
          const nuevosDatos = [...datos];
          nuevosDatos[indice] = response.data;
          setDatos(nuevosDatos);
        }
  
        setShow(false);
      })
      .catch((error) => {
        console.error("Error al editar los datos:", error);
        Swal.fire("Error", "Hubo un error al editar el registro", "error");
      });
  };

  return (
    <div >
      <h1>Rutas de la empresa {empresaid}</h1>
      <Button style={{ margin: "10px" }} onClick={() => handleAbrir()}>
        Crear nueva ruta
      </Button>
      <div className="camionesMenu-contenedor"SS>
        {datos.map((ruta) => (
          <Card key={ruta.id} style={{ width: "18rem", marginBottom: "20px" }}>
            <Card.Body>
              <Card.Title>ID: {ruta.id}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Nombre de Ruta: {ruta.nomruta}
              </Card.Subtitle>
              <Card.Text>Empresa: {empresaNombre}</Card.Text>
              <Card.Text>País: {ruta.paisesModel.nombre}</Card.Text>
            </Card.Body>
            <Button onClick={() => handleVerCoordenadas(ruta)}>
              Ver Coordenadas
            </Button>
            <Button>Descargar txt</Button>
            <ButtonGroup>
              <Button variant="warning" onClick={() => datosAEditar(ruta)}>
                <GrEdit /> Editar
              </Button>
              <Button variant="danger" onClick={() => handleEliminar(ruta.id)}>
                {" "}
                <BsXCircleFill /> Eliminar
              </Button>
            </ButtonGroup>
          </Card>
        ))}
      </div>
      <RutasModal
        mostrar={show}
        cerrar={() => handleCerrar()}
        guardar={handleGuardar}
        datosaeditar={datosEdit}
        editar={handleEditar}
      />
    </div>
  );
}
