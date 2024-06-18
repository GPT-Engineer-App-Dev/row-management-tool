import React, { useState } from 'react';
import { FaPlus, FaTrash, FaDownload } from 'react-icons/fa';
import Papa from 'papaparse';

const Index = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setHeaders(Object.keys(results.data[0]));
        setData(results.data);
      },
    });
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => {
      acc[header] = '';
      return acc;
    }, {});
    setData([...data, newRow]);
  };

  const handleRemoveRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleChange = (index, header, value) => {
    const newData = [...data];
    newData[index][header] = value;
    setData(newData);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'edited_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CSV Upload and Edit Tool</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
      {data.length > 0 && (
        <>
          <table className="table-auto w-full mb-4">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-4 py-2">{header}</th>
                ))}
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header) => (
                    <td key={header} className="border px-4 py-2">
                      <input
                        type="text"
                        value={row[header]}
                        onChange={(e) => handleChange(rowIndex, header, e.target.value)}
                        className="w-full"
                      />
                    </td>
                  ))}
                  <td className="border px-4 py-2 text-center">
                    <button onClick={() => handleRemoveRow(rowIndex)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleAddRow} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            <FaPlus className="inline mr-2" /> Add Row
          </button>
          <button onClick={handleDownload} className="bg-green-500 text-white px-4 py-2 rounded">
            <FaDownload className="inline mr-2" /> Download CSV
          </button>
        </>
      )}
    </div>
  );
};

export default Index;