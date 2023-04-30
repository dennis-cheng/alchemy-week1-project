import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privatekey, setPrivateKey] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        privatekey={privatekey}
        setPrivateKey={setPrivateKey}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} address={address} privatekey={privatekey}/>
    </div>
  );
}

export default App;
