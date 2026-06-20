import { useNavigate } from 'react-router-dom';
import AdminLayout from "./AdminLayout";

export default function AdminPage() {
  const navigate = useNavigate();
  return <AdminLayout onBack={() => navigate('/')} />;
}
