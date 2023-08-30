import logo from './logo.svg';
import './App.css';
import MinerIdInputComponent from './components/MinerIDInput.js';
import ConnectWalletComponent from './components/ConnectWallet.js';

function App() {
  return (
    <div className="App">
      <ConnectWalletComponent />
      <MinerIdInputComponent />
    </div>
  );
}

export default App;
