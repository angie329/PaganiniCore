// WalletApp — orchestrates all wallet screens within the phone frame
import PhoneFrame from '../common/PhoneFrame';
import LoginScreen from './LoginScreen';
import WalletDashboard from './WalletDashboard';
import SendPayment from './SendPayment';
import QRScanner from './QRScanner';
import QRConfirmation from './QRConfirmation';
import RechargeForm from './RechargeForm';
import WithdrawForm from './WithdrawForm';
import PinScreen from './PinScreen';
import { useApp } from '../../../context/AppContext';

export default function WalletApp() {
  const { state } = useApp();
  const screen = state.isAuthenticated ? state.walletScreen : 'login';

  const renderScreen = () => {
    switch (screen) {
      case 'login':      return <LoginScreen />;
      case 'dashboard':  return <WalletDashboard />;
      case 'send':       return <SendPayment />;
      case 'qr':         return <QRScanner />;
      case 'qr_confirm': return <QRConfirmation />;
      case 'recharge':   return <RechargeForm />;
      case 'withdraw':   return <WithdrawForm />;
      case 'pin':        return <PinScreen />;
      default:           return <WalletDashboard />;
    }
  };

  return (
    <PhoneFrame>
      {renderScreen()}
    </PhoneFrame>
  );
}
