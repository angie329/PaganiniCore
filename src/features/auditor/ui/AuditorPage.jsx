import { useNavigate } from 'react-router-dom';
import AuditorLayout from "./AuditorLayout";

export default function AuditorPage() {
  const navigate = useNavigate();
  return <AuditorLayout onBack={() => navigate('/')} />;
}
