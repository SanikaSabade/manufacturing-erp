import React from 'react';
import { useTable, type Column } from 'react-table';

// Define the Material interface
interface Material {
  material_name: string;
  material_code: string;
  category: string;
  unit: string;
  quantity_available: number;
  reorder_level: number;
  location: string;
}

interface MaterialTableProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (materialId: string) => void;
}

const MaterialTable = ({ materials, onEdit, onDelete }: MaterialTableProps) => {
  const columns: Column<Material>[] = React.useMemo(
    () => [
      {
        Header: 'Material Name',
        accessor: 'material_name',
      },
      {
        Header: 'Material Code',
        accessor: 'material_code',
      },
      {
        Header: 'Category',
        accessor: 'category',
      },
      {
        Header: 'Unit',
        accessor: 'unit',
      },
      {
        Header: 'Quantity Available',
        accessor: 'quantity_available',
      },
      {
        Header: 'Reorder Level',
        accessor: 'reorder_level',
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
      {
        Header: 'Actions',
        Cell: ({ row }: any) => (
          <div>
            <button onClick={() => onEdit(row.original)} className="mr-2 text-blue-500">Edit</button>
            <button onClick={() => onDelete(row.original.material_code)} className="text-red-500">Delete</button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: materials,
  });

  return (
    <div className="overflow-x-auto">
      <table {...getTableProps()} className="min-w-full table-auto border-collapse">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className="px-4 py-2 border">{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="border-b">
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()} className="px-4 py-2 border">{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialTable;
