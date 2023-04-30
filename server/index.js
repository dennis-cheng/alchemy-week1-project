const express = require("express")
const app = express()
const cors = require("cors")
const port = 3042
const { utf8ToBytes } = require("ethereum-cryptography/utils")
const { sha256 } = require("ethereum-cryptography/sha256")
const { secp256k1 } = require("ethereum-cryptography/secp256k1")

app.use(cors())
app.use(express.json())

const balances = {
  "02ec131f651a8e9733a3983669301f3986ff2dea52803bf680fea28e830f2bf411": 100,
  "02d84497bf821e41309eabe519e8205df122e87c10b192feed77cf30458071db8b": 50,
  "036c9aa1fba892574c4fa799a1f228f9ae2d73c8541851c4f6434784028198d6df": 75,
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params
  const balance = balances[address] || 0
  res.send({ balance })
})

app.post("/send", (req, res) => {
  // Get a signature from the client side applicaton
  const { signature, message, recovery } = req.body
  const { recipient, amount } = message
  const signatureObj = secp256k1.Signature.fromCompact(signature)
  signatureObj.recovery = recovery

  const messageBytes = utf8ToBytes(JSON.stringify(message))
  const messageHash = sha256(messageBytes)

  // recover the public key from the signature
  const sender = signatureObj.recoverPublicKey(messageHash).toHex()
  setInitialBalance(sender)
  setInitialBalance(recipient)

  const parsedAmount = parseInt(amount)
  if (balances[sender] < parsedAmount) {
    res.status(400).send({ message: "Not enough funds!" })
  } else if (parsedAmount < 0) {
    res.status(400).send({ message: "Amount must be a positive amount" })
  } else {
    balances[sender] -= parsedAmount
    balances[recipient] += parsedAmount
    res.send({ balance: balances[sender] })
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
})

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0
  }
}
