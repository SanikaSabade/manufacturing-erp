import { useState } from 'react';
import MaterialForm from '../components/Materials/MaterialForm'
import MaterialTable from '../components/Materials/MaterialTable';

export default function Materials() {
  const [view, setView] = useState<'form' | 'table' | null>(null);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Materials Module</h2>
      <div className="space-x-4 mb-4">
        <button onClick={() => setView('form')} className="bg-green-500 text-white px-4 py-2 rounded">Go to Form</button>
        <button onClick={() => setView('table')} className="bg-gray-500 text-white px-4 py-2 rounded">Go to Table</button>
      </div>

      {view === 'form' && <MaterialForm />}
      {view === 'table' && <MaterialTable />}
    </div>
  );
}
