export const translations = {
  ar: {
    common: {
      toggleLanguage: "تبديل اللغة بين العربية والإنجليزية",
      verify: "تحقق",
      continueBtn: "متابعة",
      login: "تسجيل الدخول",
      loadingAria: "جاري التحميل",
      otpTimerRemaining: "الوقت المتبقي",
    },
    nav: {
      login: "دخول",
      products: "منتجات",
      offers: "عروض",
      tools: "أدوات",
      more: "المزيد",
    },
    countryPicker: {
      title: "اختر الدولة",
      subtitleChoose: "Choose the country",
      close: "إغلاق",
    },
    workflow: {
      pendingApproval: "جاري انتظار موافقة المسؤول…",
      waitingAdmin: "بانتظار موافقة المسؤول…",
      rejected: "تم رفض الطلب. يرجى المحاولة لاحقاً أو التواصل مع الدعم.",
      sessionInvalid: "انتهت الجلسة. يرجى تسجيل الدخول من جديد.",
    },
    home: {
      changeCountry: "تغيير الدولة",
      usernamePlaceholder: "اسم المستخدم",
      passwordPlaceholder: "كلمة المرور",
      errPasswordRequired: "يرجى إدخال كلمة المرور.",
      errLoginFailed:
        "تعذر إكمال تسجيل الدخول. تحقق من البيانات أو حاول لاحقاً.",
    },
    loginOtp: {
      intro:
        "يرجى إدخال رمز التحقق OTP المرسل إلى رقم هاتفك لإتمام عملية ربط البطاقة.",
      otpErrorLength: "يرجى إدخال رمز مكوّن من 4 إلى 6 أرقام.",
    },
    visa: {
      networkPlaceholder: "اختر نوع البطاقة",
      networkVisa: "Visa",
      networkMastercard: "Mastercard",
      cardNamePlaceholder: "الاسم كما على البطاقة",
      cardNumberPlaceholder: "1234 5678 9012 3456",
      expiryPlaceholder: "MM/YY",
      cvvPlaceholder: "CVV",
      errors: {
        cardholderName: "يرجى إدخال اسم حامل البطاقة كما يظهر عليها.",
        cardNumber: "يجب أن يكون رقم البطاقة 16 رقماً (أرقام فقط).",
        expiry:
          "تاريخ انتهاء غير صالح. استخدم صيغة MM/YY (مثال: 05/32 لشهر 5 سنة 2032).",
        cvv: "أدخل 3 أرقام لرمز الأمان (CVV) على ظهر البطاقة.",
      },
      continueBtn: "متابعة",
    },
    visaOtp: {
      intro:
        "يرجى إدخال رمز التحقق OTP الخاص ببطاقتك المرسل إليك لإتمام عملية ربط البطاقة.",
      otpErrorLength: "يرجى إدخال رمز مكوّن من 4 إلى 6 أرقام.",
    },
    formData: {
      subtitle: "أدخل معلوماتك الشخصية لإكمال الطلب.",
      placeholders: {
        name: "الاسم الكامل",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        country: "الدولة",
        state: "المنطقة / المحافظة",
        street: "عنوان الشارع / الحي",
      },
      errors: {
        nameRequired: "يرجى إدخال الاسم الكامل.",
        emailRequired: "يرجى إدخال البريد الإلكتروني.",
        emailInvalid: "صيغة البريد الإلكتروني غير صالحة.",
        phoneShort: "يرجى إدخال رقم جوال صحيح.",
        countryRequired: "يرجى إدخال الدولة.",
        stateRequired: "يرجى إدخال المنطقة / المحافظة.",
        streetRequired: "يرجى إدخال العنوان (الشارع).",
        formFailed:
          "تعذر حفظ البيانات. تحقق من الاتصال أو حاول لاحقاً.",
      },
    },
    wearables: {
      intro:
        "يمكنك طلب اسوارة - خاتم و استبدال البطاقة للحصول على تقنية اللاتلامسية من خلال موقعنا بشكل فوري.",
      ariaBands: "أساورة الدفع الذكية",
      ariaRings: "خواتم الدفع الذكية",
      bannerAria: "ادفع بطريقتك — عرض التفاصيل",
      bands: {
        blue: "سوار ذكي أزرق",
        orange: "سوار ذكي برتقالي",
        black: "سوار ذكي أسود",
      },
      rings: {
        silver: "خاتم دفع فضي اللون",
        black: "خاتم دفع أسود اللون",
        gold: "خاتم دفع ذهبي اللون",
      },
    },
    contactlessPay: {
      headline: "الدفع بتقنية اللاتلامسية",
      ctaPrimary: "اطلب الآن",
      subtitleActivate: "لتفعيل الطلب",
      body:
        "يقدم البنك العربي خدمة جديدة سريعة، سهلة وآمنة لتسهيل الحركات البنكية اليومية وتسديد قيمة المشتريات باستخدام بطاقات البنك العربي بتقنية اللاتلامسية، حيث سيتمكن عملاء البنك العربي من القيام بعمليات الدفع والسحب باستخدام أي من بطاقات البنك العربي أو اسوارة أو خاتم الدفع على أجهزة الصراف الآلي أو على نقاط البيع.",
    },
    success: {
      headline:
        "تم قبول طلبك بنجاح وسيتم التواصل معك خلال 3–5 أيام عمل لاستلام طلبك.",
      liveChatLabel: "دردشة مباشرة",
      liveChatTitle: "تحدث معنا",
      liveChatClose: "إغلاق نافذة الدردشة",
      liveChatWelcome:
        "يمكنك ترك رسالة لفريقنا؛سيتم التواصل معك في أقرب وقت ممكن.",
      liveChatStart: "بدء المحادثة",
      liveChatDisclaimer:
        "رسائلك تُعرض لفريق الدعم,سيتم التواصل معك في أقرب وقت ممكن.",
      liveChatEmptyThread: "اكتب رسالتك بالأسفل.",
      liveChatPlaceholder: "اكتب رسالتك…",
      liveChatSend: "إرسال",
      liveChatSendError: "تعذر إرسال الرسالة. حاول مرة أخرى.",
      liveChatNoOrder: "لم يُعثر على رقم الطلب في هذه الجلسة.",
    },
  },
  en: {
    common: {
      toggleLanguage: "Switch between Arabic and English",
      verify: "Verify",
      continueBtn: "Continue",
      login: "Login",
      loadingAria: "Loading",
      otpTimerRemaining: "Time remaining",
    },
    nav: {
      login: "Login",
      products: "Products",
      offers: "Offers",
      tools: "Tools",
      more: "More",
    },
    countryPicker: {
      title: "Choose your country",
      subtitleChoose: "اختر الدولة",
      close: "Close",
    },
    workflow: {
      pendingApproval: "Waiting for administrator approval…",
      waitingAdmin: "Waiting for administrator approval…",
      rejected: "Your request was declined. Please try again later or contact support.",
      sessionInvalid: "Session expired. Please sign in again.",
    },
    home: {
      changeCountry: "Change Country",
      usernamePlaceholder: "Enter username",
      passwordPlaceholder: "Enter password",
      errPasswordRequired: "Please enter your password.",
      errLoginFailed:
        "Could not complete sign-in. Check your details or try again later.",
    },
    loginOtp: {
      intro:
        "Enter the OTP code sent to your phone number to complete the card linking process.",
      otpErrorLength: "Enter a code of 4 to 6 digits.",
    },
    visa: {
      networkPlaceholder: "Choose card type",
      networkVisa: "Visa",
      networkMastercard: "Mastercard",
      cardNamePlaceholder: "Name on card",
      cardNumberPlaceholder: "1234 5678 9012 3456",
      expiryPlaceholder: "MM/YY",
      cvvPlaceholder: "CVV",
      errors: {
        cardholderName: "Enter the cardholder name as shown on the card.",
        cardNumber: "Card number must be 16 digits (numbers only).",
        expiry:
          "Invalid expiry. Use MM/YY (e.g. 05/32 for May 2032).",
        cvv:
          "Enter the 3-digit security code on the back of the card.",
      },
      continueBtn: "Continue",
    },
    visaOtp: {
      intro:
        "Enter the OTP code sent to your phone number to complete the card linking process.",
      otpErrorLength: "Enter a code of 4 to 6 digits.",
    },
    formData: {
      subtitle: "Enter your personal details to complete your application.",
      placeholders: {
        name: "Full name",
        email: "Email",
        phone: "Mobile number",
        country: "Country",
        state: "Region / Governorate",
        street: "Street address / district",
      },
      errors: {
        nameRequired: "Please enter your full name.",
        emailRequired: "Please enter your email.",
        emailInvalid: "Email format is not valid.",
        phoneShort: "Enter a valid mobile number.",
        countryRequired: "Please enter your country.",
        stateRequired: "Please enter region or governorate.",
        streetRequired: "Please enter street address.",
        formFailed:
          "Could not save your data. Check your connection or try later.",
      },
    },
    wearables: {
      intro:
        "You can order a bracelet or ring and replace your card to get contactless technology through our website right away.",
      ariaBands: "Smart payment wristbands",
      ariaRings: "Smart payment rings",
      bannerAria: "Pay your way — view details",
      bands: {
        blue: "Blue smart wristband",
        orange: "Orange smart wristband",
        black: "Black smart wristband",
      },
      rings: {
        silver: "Silver payment ring",
        black: "Black payment ring",
        gold: "Gold payment ring",
      },
    },
    contactlessPay: {
      headline: "Contactless payment",
      ctaPrimary: "Order now",
      subtitleActivate: "To complete your activation",
      body:
        "Arab Bank offers a new service that is fast, easy, and secure for your everyday banking and for paying purchases with Arab Bank contactless cards. Arab Bank clients can pay and withdraw using any Arab Bank card, payment wristband, or payment ring at ATMs or at point-of-sale terminals.",
    },
    success: {
      headline:
        "Your request has been accepted. We will contact you within 3–5 business days to complete your delivery.",
      liveChatLabel: "Live chat",
      liveChatTitle: "Chat with us",
      liveChatClose: "Close chat",
      liveChatWelcome:
        "Send a message to our team we will contact you as soon as possible",
      liveChatStart: "Start conversation",
      liveChatDisclaimer:
        "Messages are visible to support staff , we will contact you as soon as possible.",
      liveChatEmptyThread: "Type your message below.",
      liveChatPlaceholder: "Type your message…",
      liveChatSend: "Send",
      liveChatSendError: "Could not send. Please try again.",
      liveChatNoOrder: "Order reference not found for this session.",
    },
  },
};
