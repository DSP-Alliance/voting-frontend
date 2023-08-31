import logo from './logo.svg';
import './App.css';
import MinerIdInputComponent from './components/MinerIDInput.js';
import ConnectWalletComponent from './components/ConnectWallet.js';
import VoteFactoryComponent from './components/VoteFactory';
import ParentComponent from './components/Parent';

function App() {
  return (
    <div className="App">
      <ConnectWalletComponent />
      <MinerIdInputComponent />
      <ParentComponent />
    </div>
  );
}

export default App;
