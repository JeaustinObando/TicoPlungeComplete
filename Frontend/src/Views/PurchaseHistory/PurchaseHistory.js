import React, { useState, useEffect, useMemo } from "react";
// import axios from '../../axiosConfig';
import axios from "axios";

import { useTable, useGlobalFilter, usePagination } from "react-table";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "./PurchaseHistory.css";

import {
  urlpurchasehistory,
  urlUsers,
  selectToBD,
} from "../../GlobalVariables";

// Componente para el buscador global
function GlobalFilter({ globalFilter, setGlobalFilter }) {
  return (
    <span className="global-filter">
      Buscar:{" "}
      <input
        value={globalFilter || ""}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder="Escribe para buscar..."
        className="m-4"
      />
    </span>
  );
}

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]); // Historial de compras
  const [showForm, setShowForm] = useState(false); // Mostrar u ocultar formulario de nueva compra
  const [buyerName, setBuyerName] = useState(""); // Nombre del comprador
  const [totalAmount, setTotalAmount] = useState(""); // Monto total de la compra
  const [detail, setDetail] = useState(""); // Detalle de la compra
  const [startDate, setStartDate] = useState(""); // Fecha de inicio para filtrado
  const [endDate, setEndDate] = useState(""); // Fecha de fin para filtrado
  const [clients, setClients] = useState([]); // Lista de clientes

  // Función para obtener todos los clientes
  const fetchClients = async () => {
    try {
      const response = await selectToBD(urlUsers + "/getClients");
      setClients(response);
    } catch (err) {
      console.error("Error al obtener los clientes:", err);
    }
  };

  // Efecto para cargar el historial de compras al iniciar el componente
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(urlpurchasehistory);
        setHistory(response.data);
      } catch (err) {
        console.error("Error al obtener el historial de compras:", err);
      }
    fetchClients();
    };

    fetchHistory();
  }, []);

  // Función para añadir una nueva compra
  const handleAddPurchase = async (e) => {
    e.preventDefault();
    try {
      const newPurchase = {
        buyerName,
        totalAmount: parseFloat(totalAmount), // Asegúrate de convertir a número
        detail,
      };

      const response = await axios.post(urlpurchasehistory, newPurchase);
      setHistory([...history, response.data]);
      setShowForm(false);
      setBuyerName("");
      setTotalAmount("");
      setDetail("");
    } catch (err) {
      console.error(err);
    }
  };

  // Función para eliminar una compra
  const handleDeletePurchase = async (id) => {
    try {
      await axios.delete(`${urlpurchasehistory}/${id}`);
      setHistory(history.filter((purchase) => purchase._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Función para exportar el historial a Excel
  const handleExportToExcel = () => {
    const adjustedEndDate = endDate ? new Date(endDate) : null;
    if (adjustedEndDate) {
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
    }

    const filteredData = history
      .filter((item) => {
        const purchaseDate = new Date(item.purchaseDate);
        return (
          (!startDate || purchaseDate >= new Date(startDate)) &&
          (!adjustedEndDate || purchaseDate < adjustedEndDate)
        );
      })
      .map((item) => ({
        Cliente: item.buyerName,
        "Fecha de compra": new Date(item.purchaseDate).toLocaleDateString(),
        Detalle: item.detail,
      }));
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PurchaseHistory");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "HistorialDeCompra.xlsx");
  };

  // Configuración de columnas para react-table
  const columns = useMemo(
    () => [
      {
        Header: "Cliente",
        accessor: "buyerName",
      },
      {
        Header: "Fecha de compra",
        accessor: "purchaseDate",
        Cell: ({ value }) => {
          return new Date(value).toLocaleDateString();
        },
      },
      {
        Header: "Monto total",
        accessor: "totalAmount",
      },
      {
        Header: "Detalle",
        accessor: "detail",
      },
      {
        Header: "Acciones",
        accessor: "_id",
        Cell: ({ value }) => (
          <button
            className="btn btn-danger m-2"
            onClick={() => handleDeletePurchase(value)}
          >
            Eliminar
          </button>
        ),
      },
    ],
    [history]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: history,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    usePagination
  );

  // Obtener propiedades y funciones de react-table
  const { globalFilter, pageIndex, pageSize } = state;

  // Instancia de react-table para manejar tabla, filtros y paginación
  return (
    <div className="purchase-history-Style">
      <div className="purchase-history">
        <h2>Historial de compras</h2>
        <button
          className="btn btn-success m-4"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancelar" : "Añadir compra"}
        </button>
        <button className="btn btn-primary m-4" onClick={handleExportToExcel}>
          Exportar a Excel
        </button>
        <div>
          <label>
            Fecha de inicio:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            Fecha de fin:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        {showForm && (
          <div className="purchase-form-container m-4">
            <form onSubmit={handleAddPurchase} className="purchase-form">
              <div>
                <select
                  id="inputActivityreserve"
                  className="m-2"
                  onChange={(e) =>
                    setBuyerName(e.target.value)
                  }
                >
                  <option value="">Seleccione un cliente</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client.firstName + " " + client.lastName}>
                      {client.firstName} {client.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Monto total:</label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Detalle:</label>
                <br />
                <textarea
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  required
                ></textarea>
              </div>
              <button className="btn btn-primary m-4" type="submit">
                Añadir compra
              </button>
            </form>
          </div>
        )}
        <div>
          <GlobalFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="purchase-history-page-boton m-3">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>
          <span>
            Página{" "}
            <strong>
              {pageIndex + 1} de {pageOptions.length}
            </strong>{" "}
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
