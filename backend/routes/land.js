import express from "express";
import auth from "../middleware/auth.js";
import { contract } from "../config/web3.js";
const router = express.Router();

// Land Registry
router.post("/register", auth, async (req, res) => {
  try {
    const {
      thandaperNumber,
      owner,
      taluk,
      village,
      surveyNumber,
      area,
      landType,
      landTitle,
      protectedStatus,
      taxAmount,
      geoLocation,
      marketValue,
    } = req.body;

    const txData = {
      methodName: "registerLand",
      params: [
        thandaperNumber,
        owner,
        taluk,
        village,
        surveyNumber,
        area,
        landType,
        landTitle,
        protectedStatus,
        taxAmount,
        geoLocation,
        marketValue,
      ],
      to: contract.address,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (e) {
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
    const { thandaperNumber, buyer } = req.body;
    const txData = {
      methodName: "initiateSaleRequest",
      params: [thandaperNumber, buyer],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/sale/confirm-seller", auth, async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "confirmSaleBySeller",
      params: [thandaperNumber],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/sale/confirm-buyer", auth, async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "confirmSaleByBuyer",
      params: [thandaperNumber],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/sale/verify-registrar", auth, async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "verifySaleByRegistrar",
      params: [thandaperNumber],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/sale/approve-senior-registrar", auth, async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "approveSaleBySeniorRegistrar",
      params: [thandaperNumber],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Death Transfer Routes
router.post("/death-transfer/initiate", auth, async (req, res) => {
  try {
    const { thandaperNumber, beneficiary } = req.body;
    const txData = {
      methodName: "initiateDeathTransfer",
      params: [thandaperNumber, beneficiary],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/death-transfer/approve-beneficiary", auth, async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "approveDeathTransferByBeneficiary",
      params: [thandaperNumber],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/death-transfer/approve-registrar", auth, async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "approveDeathTransferByAnonymousRegistrar",
      params: [thandaperNumber],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/death-transfer/finalize", auth, async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "finalizeDeathTransfer",
      params: [thandaperNumber],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Tax Payment
router.post("/tax/pay", auth, async (req, res) => {
  try {
    const { thandaperNumber, amount } = req.body;
    const txData = {
      methodName: "payTax",
      params: [thandaperNumber, amount],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Protected Land Type Change
router.post("/protected-land-type/request", auth, async (req, res) => {
  try {
    const { thandaperNumber, newLandType } = req.body;
    const txData = {
      methodName: "requestProtectedLandTypeChange",
      params: [thandaperNumber, newLandType],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/protected-land-type/approve", auth, async (req, res) => {
  try {
    const { thandaperNumber, newLandType } = req.body;
    const txData = {
      methodName: "approveProtectedLandTypeChange",
      params: [thandaperNumber, newLandType],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/protected-land-type/finalize", auth, async (req, res) => {
  try {
    const { thandaperNumber, newLandType } = req.body;
    const txData = {
      methodName: "finalizeProtectedLandTypeChange",
      params: [thandaperNumber, newLandType],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Non-Protected Land Type Change
router.post("/non-protected-land-type/request", auth, async (req, res) => {
  try {
    const { thandaperNumber, newLandType } = req.body;
    const txData = {
      methodName: "requestNonProtectedLandTypeChange",
      params: [thandaperNumber, newLandType],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/non-protected-land-type/approve", auth, async (req, res) => {
  try {
    const { thandaperNumber, newLandType } = req.body;
    const txData = {
      methodName: "approveNonProtectedLandTypeChange",
      params: [thandaperNumber, newLandType],
      to: contract.address,
    };
    res.json({ success: true, data: txData });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

export default router;