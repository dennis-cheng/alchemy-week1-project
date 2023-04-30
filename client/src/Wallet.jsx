import server from "./server";

const publicToPrivate = {
  '02d84497bf821e41309eabe519e8205df122e87c10b192feed77cf30458071db8b': 'da5082d7ec6af2a2c2d0b31b5b99eaff1a2be83cc68365d4b2dc59962f8d12a0',
  '02ec131f651a8e9733a3983669301f3986ff2dea52803bf680fea28e830f2bf411': '8de33178e781e86048603ed47d4b2fe43a581db8f91898607a30ee987109c484',
  '036c9aa1fba892574c4fa799a1f228f9ae2d73c8541851c4f6434784028198d6df': '660a584c8a43ae8d5e09d8acf847e9406032b3944bec5bff6b626a3f97486e51',
}

const publicAddresses = Object.keys(publicToPrivate)

function Wallet({ address, setAddress, balance, setBalance, privatekey, setPrivateKey }) {
  const walletChanged = async (event) => {
    const address = event.target.value
    const privateKey = publicToPrivate[address]
    setPrivateKey(privateKey)
    setAddress(address)
    
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

        <select value={address} onChange={walletChanged}>
          <option value="">Select wallet</option>
          {publicAddresses.map((address) => <option value={address} key={address}>{address}</option>)}
        </select>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
