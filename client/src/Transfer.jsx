import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1"
import { sha256 } from "ethereum-cryptography/sha256"
import { utf8ToBytes } from "ethereum-cryptography/utils"

function Transfer({ address, setBalance, privatekey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const message = {
      recipient,
      amount: sendAmount
    }
    const messageBytes = utf8ToBytes(JSON.stringify(message))
    const messageHash = sha256(messageBytes)

    const signature = secp256k1.sign(messageHash, privatekey)

    const requestPayload = {
      message,
      signature: signature.toCompactHex(),
      recovery: signature.recovery
    }



    try {
      const {
        data: { balance },
      } = await server.post(`send`, requestPayload);
      setBalance(balance);
    } catch (ex) {
      console.log(ex)
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
