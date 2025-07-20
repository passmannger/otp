const fetch = require("node-fetch");

// Simple helper to define an API easily
const makeApi = ({ name, url, method, headers, getBody }) => ({
  name,
  url,
  method,
  headers,
  body: (phone) => getBody(phone),
});

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

  // ✅ Define all APIs here
  const apis = [
    makeApi({
      name: "khatabook",
      url: "https://api.khatabook.com/v1/auth/request-otp",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) =>
        JSON.stringify({
          app_signature: "Jc/Zu7qNqQ2",
          country_code: "+91",
          phone: phone,
        }),
    }),
    
    makeApi({
      name: "samsung",
      url: "https://www.samsung.com/in/api/v1/sso/otp/init",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({ user_id: phone }),
    }),
    // 🆕 Add more APIs here like this 👇
    // makeApi({ ... })
  ];

  let results = [];

  for (const api of apis) {
    try {
      const res = await fetch(api.url, {
        method: api.method,
        headers: api.headers,
        body: api.body(phone),
      });
      results.push({ [api.name]: res.status });
    } catch (err) {
      results.push({ [api.name]: "error" });
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ phone, results }),
  };
};
