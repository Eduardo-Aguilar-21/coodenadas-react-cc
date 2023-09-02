import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { GrEdit } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import { coordenadasURL, coordenadaxRutaURL } from "../API/apiurls";
import { useListarElementos } from "../Hooks/CRUDHooks";
import { BsXCircleFill, BsPlusCircleFill } from "react-icons/bs";
import CoordenadasModal from "./CoordenadasModal";
import axios from "axios";
import Swal from "sweetalert2";

export function Coordenadas() {
  const [datos, setDatos] = useState([]);
  const navigation = useNavigate();
  const { ruta } = useParams();
  const [show, setShow] = useState(false);
  const [datosEdit, setDatosEdit] = useState(null);
  const nomRuta = localStorage.getItem("nomRuta");

  useListarElementos(`${coordenadaxRutaURL}${ruta}`, datos, setDatos);

  const handleShowModal = () => {
    setShow(true);
  };

  const handleCerrar = () => {
    setShow(false);
  };

  const handleGuardar = (datosFormulario) => {
    console.log("La ruta es: " + ruta);
    console.log(datosFormulario);
    const requestData = {
      latitud: datosFormulario.latitud,
      longitud: datosFormulario.longitud,
      radio: datosFormulario.radio,
      sonidosVelocidadModel: {
        id: datosFormulario.velocidad,
        nombre: datosFormulario.velocidadValor,
      },
      sonidoGeocerca: datosFormulario.sonidoGeocerca,
      rutasModel: {
        id: ruta,
      },
    };
  
    axios
      .post(`${coordenadasURL}`, requestData)
      .then((response) => {
        setDatos([...datos, response.data]);
        setShow(false);
      })
      .catch((error) => {
        console.error("Error al guardar los datos:", error);
      });
  };

  const handleEliminar = (id) => {
    Swal.fire({
      title: "¿Esta seguro de eliminar este registro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${coordenadasURL}/${id}`)
          .then(() => {
            // Filtra los datos para mantener solo los registros que no tienen el ID eliminado
            const nuevosDatos = datos.filter(
              (coordenada) => coordenada.id !== id
            );
            setDatos(nuevosDatos); // Actualiza la variable de estado
            Swal.fire("Eliminado", "El registro ha sido eliminado", "success");
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

  const datosAEditar = (camion) => {
    setDatosEdit(camion);
    setShow(true);
  };

  const handleEditar = (dato) => {

    const requestData = {
      latitud: dato.latitud,
      longitud: dato.longitud,
      radio: dato.radio,
      sonidosVelocidadModel: {
        id: dato.velocidad,
        nombre: dato.velocidadValor,
      },
      sonidoGeocerca: dato.sonidoGeocerca,
      rutasModel: {
        id: ruta,
      },
    };
    console.log(requestData)
    axios
      .put(`${coordenadasURL}/${dato.id}`, requestData)
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

  const generateTextFile = () => {
    const content = datos
      .map(
        (coordenada) =>
          `${coordenada.latitud} ${coordenada.longitud} ${coordenada.radio} ${coordenada.sonidosVelocidadModel.nombre} ${coordenada.sonidosVelocidadModel.id + 1} ${coordenada.sonidoGeocerca}\n`
      )
      .join("");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = "datos_coordenadas.txt";

    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    link.dispatchEvent(event);

    URL.revokeObjectURL(link.href);
  };

  return (
    <>
      <div className="camionesMenu-contenedor">
        <Button style={{ width: "100%" }} onClick={() => navigation("/rutas")}>
          Atras
        </Button>
        <h1>Coordenadas de la ruta {nomRuta}</h1>
        <Button
          variant="success"
          style={{ margin: "30px" }}
          onClick={() => handleShowModal()}
        >
          <BsPlusCircleFill /> Agregar
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Radio</th>
              <th>Velocidad</th>
              <th>Sonido Velocidad</th>
              <th>Sonido Geocerca</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((coordenada) => (
              <tr key={coordenada.id}>
                <td>{coordenada.id}</td>
                <td>{coordenada.latitud}</td>
                <td>{coordenada.longitud}</td>
                <td>{coordenada.radio}</td>
                <td>{coordenada.sonidosVelocidadModel.nombre}</td>
                <td>{coordenada.sonidosVelocidadModel.id + 1}</td>
                <td>{coordenada.sonidoGeocerca}</td>
                <td>
                  <Button
                    variant="warning"
                    style={{ marginInline: "10px" }}
                    onClick={() => datosAEditar(coordenada)}
                  >
                    <GrEdit /> Editar
                  </Button>
                  <Button
                    variant="danger"
                    style={{ marginInline: "10px" }}
                    onClick={() => handleEliminar(coordenada.id)}
                  >
                    <BsXCircleFill /> Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={generateTextFile}>Descargar txt</Button>
      </div>
      <CoordenadasModal
        mostrar={show}
        cerrar={handleCerrar}
        guardar={handleGuardar}
        datosaeditar={datosEdit}
        editar={handleEditar}
      />
    </>
  );
}
