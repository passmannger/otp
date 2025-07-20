const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { phone } = JSON.parse(event.body || "{}");

  if (!phone) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing phone number" }),
    };
  }

  let results = [];

  // 1. Meesho
  try {
    const meesho = await fetch("https://www.meesho.com/api/v1/user/login/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: phone }),
    });
    results.push({ meesho: meesho.status });
  } catch (err) {
    results.push({ meesho: "error" });
  }

  // 2. Bewakoof
  try {
    const bewakoof = await fetch("https://api-prod.bewakoof.com/v3/user/auth/login/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: phone, country_code: "+91" }),
    });
    results.push({ bewakoof: bewakoof.status });
  } catch (err) {
    results.push({ bewakoof: "error" });
  }

  // 3. Blinkit
  try {
    const blinkit = await fetch("https://blinkit.com/v2/accounts/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `user_phone=${phone}`,
    });
    results.push({ blinkit: blinkit.status });
  } catch (err) {
    results.push({ blinkit: "error" });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ phone, results }),
  };
};
