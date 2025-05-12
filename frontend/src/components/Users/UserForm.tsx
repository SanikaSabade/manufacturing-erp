import { useForm } from 'react-hook-form';
import axios from '../../api/axios';

export default function UserForm() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    await axios.post('/users', data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input {...register('name')} placeholder="Name" className="border p-2" />
      <input {...register('email')} placeholder="Email" className="border p-2" />
      <input {...register('password_hash')} placeholder="Password" className="border p-2" />
      <select {...register('role')} className="border p-2">
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="operator">Operator</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Add User</button>
    </form>
  );
}

