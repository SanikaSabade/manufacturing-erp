import React, { useEffect, useState } from 'react';
import { useReactTable, type ColumnDef, flexRender, getCoreRowModel } from '@tanstack/react-table';
import axios from 'axios';

const UserTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  // Fetch the data
  const fetchData = async () => {
    const result = await axios.get('/api/users');
    setData(result.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Define columns for the table
  const columns: ColumnDef<any>[] = React.useMemo(
    () => [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Email', accessorKey: 'email' },
      { header: 'Role', accessorKey: 'role' },
      { header: 'Status', accessorKey: 'status' },
      {
        header: 'Actions',
        cell: ({ row }: any) => (
          <div className="flex space-x-2">
            <button className="btn" onClick={() => alert(`Edit user ${row.original._id}`)}>Edit</button>
            <button className="btn" onClick={() => alert(`Delete user ${row.original._id}`)}>Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  // Set up the table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="p-2 border-b">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-2 border-b">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
