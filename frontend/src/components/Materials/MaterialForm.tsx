import { useForm, Controller } from 'react-hook-form';

interface Material {
  material_name: string;
  material_code: string;
  category: string;
  unit: string;
  quantity_available: number;
  reorder_level: number;
  location: string;
}

interface MaterialFormProps {
  onSubmit: (material: Material) => void;
  initialData?: Material;
}

const MaterialForm = ({ onSubmit, initialData }: MaterialFormProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm<Material>({
    defaultValues: initialData || {
      material_name: '',
      material_code: '',
      category: 'Raw',
      unit: '',
      quantity_available: 0,
      reorder_level: 0,
      location: '',
    },
  });

  const submitForm = (data: Material) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold">Material Name</label>
        <Controller
          name="material_name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="w-full p-2 border rounded"
            />
          )}
        />
        {errors.material_name && <span className="text-red-500 text-sm">{errors.material_name.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-semibold">Material Code</label>
        <Controller
          name="material_code"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="w-full p-2 border rounded"
            />
          )}
        />
        {errors.material_code && <span className="text-red-500 text-sm">{errors.material_code.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-semibold">Category</label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <select {...field} className="w-full p-2 border rounded">
              <option value="Raw">Raw</option>
              <option value="Finished">Finished</option>
              <option value="Semi-finished">Semi-finished</option>
            </select>
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold">Unit</label>
        <Controller
          name="unit"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="w-full p-2 border rounded"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold">Quantity Available</label>
        <Controller
          name="quantity_available"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              className="w-full p-2 border rounded"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold">Reorder Level</label>
        <Controller
          name="reorder_level"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              className="w-full p-2 border rounded"
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold">Location</label>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="w-full p-2 border rounded"
            />
          )}
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          {initialData ? 'Update Material' : 'Add Material'}
        </button>
      </div>
    </form>
  );
};

export default MaterialForm;
