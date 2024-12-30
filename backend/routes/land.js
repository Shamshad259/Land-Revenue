import express from "express";
import auth from "../middleware/auth.js";
import { provider } from "../config/web3.js";
const router = express.Router();

// Land Registry
router.post("/register", auth, async (req, res) => {
  try {
    console.log("Received request to register land:", req.body);
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    console.error("Error in register route:", e.message);
    res.status(400).send({ error: e.message });
  }
});

// Land Queries
router.get("/owned-lands/:address", auth, async (req, res) => {
  try {
    const lands = await contract.getOwnedLands(req.params.address);
    res.json({ success: true, data: lands });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.get("/details/:thandaperNumber", auth, async (req, res) => {
  try {
    const land = await contract.getLandDetails(req.params.thandaperNumber);
    res.json({ success: true, data: land });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Land Sale Routes
router.post("/sale/initiate", auth, async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/sale/confirm-seller", auth, async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/sale/confirm-buyer", auth, async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/sale/verify-registrar", auth, async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/sale/approve-senior-registrar", auth, async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Death Transfer Routes
router.post("/death-transfer/initiate", auth, async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/death-transfer/approve-beneficiary", auth, async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/death-transfer/approve-registrar", auth, async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/death-transfer/finalize", auth, async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Protected Land Type Change
router.post("/protected-land-type/request", auth, async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/protected-land-type/approve", auth, async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/protected-land-type/finalize", auth, async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Non-Protected Land Type Change
router.post("/non-protected-land-type/request", auth, async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/non-protected-land-type/approve", auth, async (req, res) => {
  try {
    const { signedTransaction } = req.body;

    // Send the signed transaction to the blockchain
    const txResponse = await provider.sendTransaction(signedTransaction);
    const receipt = await txResponse.wait();

    res.json({
      success: true,
      data: receipt,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

export default router;