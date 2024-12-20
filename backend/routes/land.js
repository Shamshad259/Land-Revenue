const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const { abi } = require("../config/contract");

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  provider
);

//Register Land
router.post(
  "/register",
  auth,
  roleCheck(["Subregistrar"]),
  async (req, res) => {
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
        to: process.env.CONTRACT_ADDRESS,
      };
      res.json({
        success: true,
        data: txData,
      });
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }
);

//Get Owned Lands
router.get("/ownedLands:address", auth, async (req, res) => {
  try {
    const lands = await contract.getOwnedLands(req.params.address);
    res.json({ success: true, data: lands });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
});

//Get Land Details
router.get("details:thandaperNumber", auth, async (req, res) => {
  try {
    const land = await contract.getLandDetails(req.params.thandaperNumber);
    res.json({ success: true, data: land });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
});

//Initiate Sale
router.post("sale/initiate", auth, async (req, res) => {
  try {
    const { thandaperNumber, buyer } = req.body;
    const txData = {
      methodName: "initiateSaleRequest",
      params: [thandaperNumber, buyer],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
});

//Confirm Sale - Seller
router.post("sale/confirm-seller", auth, async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "confirmSaleBySeller",
      params: [thandaperNumber],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
});

//Confirm Sale - Buyer
router.post("sale/confirm-buyer", auth, async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "confirmSaleByBuyer",
      params: [thandaperNumber],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
});

//Verify Sale - Sub-Registrar
router.post("sale/verify-registrar", auth, roleCheck(["SubRegistrar"]), async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "verifySaleByRegistrar",
      params: [thandaperNumber],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
});

//Approve Sale - Senior Registrar
router.post("sale/approve-senior-registrar", auth, roleCheck(["SeniorRegistrar"]), async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "approveSaleBySeniorRegistrar",
      params: [thandaperNumber],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
});


//Death Transfer
router.post('death-transfer/initiate', auth, roleCheck(["SubRegistrar"]), async (req, res) => {
  try {
    const { thandaperNumber, beneficiary } = req.body;
    const txData = {
      methodName: "initiateDeathTransfer",
      params: [thandaperNumber, beneficiary],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
})

//Approve Death Transfer - Beneficiary
router.post('death-transfer/approve-beneficiary', auth, roleCheck(["LandOwner"]), async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "approveDeathTransferByBeneficiary",
      params: [thandaperNumber],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
})

//Approve Death Transfer - Sub-Registrar
router.post('death-transfer/approve-registrar', auth, roleCheck(["SubRegistrar"]), async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "approveDeathTransferByAnonymousRegistrar",
      params: [thandaperNumber],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
})

//Finalize Death Transfer
router.post('death-transfer/finalize', auth, roleCheck(["SeniorRegistrar"]), async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "finalizeDeathTransfer",
      params: [thandaperNumber],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
})

//Tax Payment
router.post('tax-payment/initiate', auth, roleCheck(["LandOwner"]), async (req, res) => {
  try {
    const { thandaperNumber, amount } = req.body;
    const txData = {
      methodName: "payTax",
      params: [thandaperNumber, amount],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
})

//Protected Land Type Change
router.post('protected-land-type-change/initiate', auth, roleCheck(["Tahsildar"]), async (req, res) => {
  try {
    const { thandaperNumber, newLandType } = req.body;
    const txData = {
      methodName: "requestProtectedLandTypeChange",
      params: [thandaperNumber, newLandType],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
})

//Approve Protected Land Type Change - Collector
router.post('protected-land-type-change/approve', auth, roleCheck(["Collector"]), async (req, res) => {
  try {
    const { thandaperNumber, newLandType } = req.body;
    const txData = {
      methodName: "approveProtectedLandTypeChange",
      params: [thandaperNumber, newLandType],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
})

//Finalize Protected Land Type Change
router.post('protected-land-type-change/finalize', auth, roleCheck(["ChiefSecretary"]), async (req, res) => {
  try {
    const { thandaperNumber } = req.body;
    const txData = {
      methodName: "finalizeProtectedLandTypeChange",
      params: [thandaperNumber],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
})

//Non-Protected Land Type Change
router.post('non-protected-land-type-change/initiate', auth, roleCheck(["LandOwner"]), async (req, res) => {
  try {
    const { thandaperNumber, newLandType } = req.body;
    const txData = {
      methodName: "requestNonProtectedLandTypeChange",
      params: [thandaperNumber, newLandType],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
})

//Approve Non-Protected Land Type Change - Village Officer
router.post('non-protected-land-type-change/approve', auth, roleCheck(["VillageOfficer"]), async (req, res) => {
  try {
    const { thandaperNumber, newLandType } = req.body;
    const txData = {
      methodName: "approveNonProtectedLandTypeChange",
      params: [thandaperNumber, newLandType],
      to: process.env.CONTRACT_ADDRESS,
    };
    res.json({
      success: true,
      data: txData,
    });
  } catch (error) {
    res.status(400).send({ error: e.message });
  }
})



module.exports = router;
