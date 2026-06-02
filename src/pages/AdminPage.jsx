import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';

export default function AdminPage() {
  const navigate = useNavigate();
  return <AdminLayout onBack={() => navigate('/')} />;
}
