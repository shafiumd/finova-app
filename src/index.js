// verify-account-details-function/src/index.js
const axios = require('axios');

// --- CORRECT SIGNATURE: Use a single 'context' object ---
module.exports = async (context) => {
  const { req, res, log, error } = context;

  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!paystackSecretKey) {
    error("CRITICAL: PAYSTACK_SECRET_KEY is not set in environment variables.");
    // --- Use res.json() to send the response ---
    return res.json({ success: false, message: "Server configuration error." }, 500);
  }

  try {
    // Access payload from context.req
    const { accountNumber } = JSON.parse(req.payload);

    if (!accountNumber || typeof accountNumber !== 'string' || accountNumber.length !== 10) {
      return res.json({ success: false, message: "Invalid account number. It must be 10 digits." }, 400);
    }

    const commonBankCodes = [
        "058", "011", "033", "057", "044", "070", "214", "035", "232",
    ];

    log(`Verifying ${accountNumber} against ${commonBankCodes.length} banks...`);

    const promises = commonBankCodes.map(bankCode =>
      axios.get(
        `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
        {
          headers: { Authorization: `Bearer ${paystackSecretKey}` },
          timeout: 7000
        }
      )
    );

    const results = await Promise.allSettled(promises);

    const successfulResult = results.find(result => 
      result.status === 'fulfilled' && result.value.data && result.value.data.status === true
    );

    if (successfulResult) {
      const accountName = successfulResult.value.data.data.account_name;
      log(`SUCCESS: Resolved name is "${accountName}".`);
      return res.json({ success: true, accountName: accountName });
    } else {
      error(`FAILURE: Could not resolve ${accountNumber} with any common banks.`);
      return res.json({ success: false, message: "Could not verify account. Please check the number." }, 404);
    }

  } catch (err) {
    error("CRITICAL error in verify-account-details function:", err.message);
    return res.json({ success: false, message: "An unexpected server error occurred." }, 500);
  }
};