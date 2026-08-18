"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Locale = "ar" | "en";

type LanguageContextValue = {
  locale: Locale;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ======================================================
// English translations
// ======================================================

const englishCopy: Record<string, string> = {
  الرئيسية: "Home",
  المميزات: "Features",
  "كيف تعمل": "How it works",
  الأسعار: "Pricing",
  المقالات: "Articles",
  "من نحن": "About us",

  "تسجيل الدخول": "Log in",
  "ابدأ الآن مجانًا": "Start free",
  "ابدأ تجربتك المجانية": "Start your free trial",
  "استعرض المميزات": "Explore features",

  "منصة متكاملة": "One complete platform",
  "لإدارة أعمال قطع الغيار": "for managing auto-parts businesses",

  "Partiva تساعدك على إدارة عملائك، مخزونك، مشترياتك، مبيعاتك وتقاريرك بسهولة من منصة واحدة متكاملة وآمنة.":
    "Partiva helps you manage customers, inventory, purchasing, sales, and reports from one secure, integrated platform.",

  "تجربة مجانية 14 يوم": "14-day free trial",
  "لا تحتاج بطاقة ائتمانية": "No credit card required",
  "إلغاء في أي وقت": "Cancel anytime",

  "كل ما تحتاجه لإدارة عملك بكفاءة":
    "Everything you need to run your business efficiently",

  "اعرف المزيد": "Learn more",

  "إدارة المخزون": "Inventory management",
  "إدارة المبيعات والمشتريات": "Sales & purchasing",
  "إدارة العملاء والموردين": "Customers & suppliers",
  "التقارير والتحليلات": "Reports & analytics",
  "صلاحيات مرنة": "Flexible permissions",
  "متوافق مع جميع الأجهزة": "Works on every device",

  "تتبع فريقك للمخزون مع تنبيهات ذكية للمخزون المنخفض وإدارة متعددة المستودعات":
    "Track inventory with low-stock alerts and multi-warehouse management.",

  "إدارة كاملة للعملية من الطلب حتى الفاتورة مع تقارير دقيقة وتحليلات متقدمة":
    "Manage the whole process from order to invoice with accurate reports and analytics.",

  "قاعدة بيانات متكاملة تجمع العملاء والموردين مع سجل كامل للمعاملات والتواصل":
    "A complete customer and supplier database with a full transaction history.",

  "تقارير شاملة تساعدك على اتخاذ قرارات أفضل وتنمية أعمالك":
    "Clear reports that help you make better decisions and grow.",

  "إدارة المستخدمين والصلاحيات بيئة لضمان أمان بيانات عملك":
    "Manage users and permissions to keep your business data secure.",

  "استخدم Partiva من أي مكان وفي أي وقت عبر الجوال أو الكمبيوتر":
    "Use Partiva anywhere, anytime, on mobile or desktop.",

  "جاهز للانطلاق?": "Ready to get started?",

  "جاهز للانطلاق؟": "Ready to get started?",

  "ابدأ تجربتك المجانية الآن واكتشف كيف يمكن لـ Partiva تحويل إدارة عملك إلى تجربة أكثر ذكاءً وسهولة":
    "Start your free trial and see how Partiva makes business management smarter and simpler.",

  "تواصل معنا": "Contact us",
  "الرياض، المملكة العربية السعودية": "Riyadh, Saudi Arabia",

  المنتج: "Product",
  الشركة: "Company",
  الدعم: "Support",
  التكاملات: "Integrations",
  التحديثات: "Updates",
  المدونة: "Blog",
  الوظائف: "Careers",
  "اتصل بنا": "Contact us",
  "مركز المساعدة": "Help center",
  "الدعم الفني": "Technical support",

  "سياسة الخصوصية": "Privacy policy",
  "الشروط والأحكام": "Terms & conditions",

  "منصة متكاملة لإدارة أعمال قطع الغيار مصممة لمساعدتك على النمو والنجاح":
    "A complete auto-parts business platform designed to help you grow and succeed.",

  "منصة متكاملة لإدارة أعمال قطع الغيار":
    "A complete platform for managing auto-parts businesses",

  "مصممة لمساعدتك على النمو والنجاح": "Designed to help you grow and succeed",

  "جميع الحقوق محفوظة": "All rights reserved",

  "الأسئلة الشائعة": "Frequently asked questions",

  "نسيت كلمة المرور؟": "Forgot your password?",
  "تسجيل حساب جديد": "Create an account",
  "البريد الإلكتروني": "Email address",
  "كلمة المرور": "Password",
  "إرسال الطلب": "Submit request",
  "جارٍ الإرسال...": "Submitting...",

  "يثق بنا الشركات والمتاجر في جميع أنحاء المملكة":
    "Trusted by businesses and stores across the Kingdom",

  "أنشئ حسابك": "Create your account",
  "سجل حسابك في دقائق بدون أي تعقيد.":
    "Register in minutes with no complexity.",

  "أضف منتجاتك": "Add your products",
  "استورد أو أضف منتجاتك ومخزونك بسهولة.":
    "Import or add your products and inventory with ease.",

  "أضف بيانات شركتك": "Add your company details",
  "أدخل بيانات شركتك والإعدادات الأساسية.":
    "Enter your company details and basic settings.",

  "ابدأ العمل": "Start working",
  "ابدأ إدارة مبيعاتك ومشترياتك وتقاريرك فور جهوزك.":
    "Start managing sales, purchases, and reports when you are ready.",

  "ابدأ خلال دقائق فقط": "Get started in minutes",

  "شركة ومنجر": "Businesses and stores",
  "يثقون بمنصتنا": "trust our platform",

  "منتج قدار": "Products managed",
  "عبر المنصة": "through the platform",

  "عملية مكتملة": "Completed transactions",
  بنجاح: "successfully",

  "وقت تشغيل": "Uptime",
  "امنصة مستقرة وآمنة": "A stable and secure platform",

  الأساسية: "Basic",
  "للأنشطة الصغيرة": "For small businesses",
  "ابدأ الآن": "Get started",
  "مستخدم واحد": "One user",
  "تقارير أساسية": "Basic reports",
  "دعم عبر البريد": "Email support",

  الاحترافية: "Professional",
  "للأنشطة المتنامية": "For growing businesses",
  "حتى 5 مستخدمين": "Up to 5 users",
  "إدارة الفروع والمخزون": "Branch and inventory management",
  "تقارير متقدمة": "Advanced reports",
  "صلاحيات الموظفين": "Employee permissions",

  المؤسسية: "Enterprise",
  "للشركات الكبيرة": "For large businesses",
  "حتى 15 مستخدم": "Up to 15 users",
  "إدارة متقدمة للفروع": "Advanced branch management",
  "تحليلات وتقارير": "Analytics and reports",
  "دعم مخصص": "Dedicated support",

  "خطط تناسب جميع أحجام الأعمال": "Plans for every business size",

  "اختر الخطة المناسبة لك وابدأ رحلتك نحو إدارة أكثر احترافية":
    "Choose the plan that fits you and start managing your business professionally.",

  "الأكثر شعبية": "Most popular",
  "الشهر/": "/ month",

  "محتاج خطة مخصصة؟": "Need a custom plan?",

  "لو نشاطك التجاري له احتياجات خاصة أو محتاج حلول مخصصة، تواصل معنا ونصمم لك الخطة المناسبة.":
    "If your business has special requirements, contact us and we will design the right plan for you.",

  "ضمان استرجاع كامل خلال 14 يوم من الدفع":
    "Full refund guarantee within 14 days of payment",

  "آراء عملائنا": "Customer testimonials",
  "ماذا يقول عملاؤنا عن Partiva": "What our customers say about Partiva",

  "منصة ممتازة وسهلة الاستخدام، ساعدتنا على تنظيم مخزوننا وزيادة مبيعاتنا بشكل ملحوظ.":
    "An excellent, easy-to-use platform that helped us organize inventory and increase sales significantly.",

  "أحمد القحطاني": "Ahmed Al-Qahtani",
  "متجر قطع الغيار الذكي": "Smart Spare Parts Store",

  "التقارير دقيقة والدعم الفني سريع. أنصح بها لكل صاحب عمل في مجال قطع الغيار.":
    "The reports are accurate and support is fast. I recommend it to every auto-parts business owner.",

  "سلمان العتيبي": "Salman Al-Otaibi",
  "شركة مسار القطع": "Masar Parts Company",

  "أفضل نظام استخدمناه لإدارة أعمالنا، وفر علينا الكثير من الوقت والجهد.":
    "The best system we have used to manage our business; it saved us considerable time and effort.",

  "محمد الشهري": "Mohammed Al-Shahri",
  "ورشة النخبة": "Elite Workshop",

  "الصفحة غير موجودة": "Page not found",

  "عذرًا، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها إلى مكان آخر.":
    "Sorry, the page you are looking for does not exist or may have moved.",

  "العودة للرئيسية": "Back to home",
  "جاري التحميل...": "Loading...",

  "لأصحاب المحلات": "For shop owners",
  للورش: "For workshops",
  للموزعين: "For distributors",

  "إدارة المخزون والفروع": "Inventory and branch management",
  "متابعة المنتجات وكل فروعك من مكان واحد.":
    "Manage products and all branches from one place.",

  "الشبكة التجارية": "Trade network",
  "قارن الأسعار وتواصل مع موردين آخرين — اختياري.":
    "Compare prices and connect with other suppliers — optional.",

  "حدد مين يشوف ومين يعدّل حسب دوره.":
    "Choose who can view and edit based on their role.",

  "التقارير والإشعارات": "Reports and notifications",
  "تنبيهات فورية وتقارير أداء تفصيلية.":
    "Instant alerts and detailed performance reports.",

  المزايا: "Benefits",

  "كل اللي محتاجه لإدارة نشاطك، وربطه بالسوق لما تحتاج":
    "Everything you need to manage your business and connect it to the market when needed.",

  "وصف تسويقي يشرح القدرات بلغة بسيطة، بدون أي مصطلح داخلي.":
    "A simple overview of capabilities without internal terminology.",

  "تصفية المزايا حسب الفئة": "Filter benefits by category",
  "مجموعات القدرات": "Capability groups",

  "مش كل القدرات متاحة في كل خطة":
    "Not every capability is available in every plan.",

  "شوف الفروقات بين الخطط الثلاث بالتفصيل.":
    "See the detailed differences between the three plans.",

  "قارن الخطط": "Compare plans",
  "جرّب المزايا دي بنفسك": "Try these benefits yourself",
  "سجّل شركتك": "Register your business",
  "شاهد الأسعار": "View pricing",

  "تاجر تجزئة": "Retailer",
  "إدارة سريعة وسهلة لفرع واحد": "Fast, simple management for one branch",

  "ورش الصيانة": "Maintenance workshops",
  "مقارنة الأسعار والتوفر بين الموردين":
    "Compare prices and availability between suppliers",

  "موزّعون ومستوردون": "Distributors and importers",
  "إدارة متعددة الفروع بصلاحيات مخصصة":
    "Multi-branch management with tailored permissions",

  التسجيل: "Registration",
  المراجعة: "Review",
  الاعتماد: "Approval",
  "البدء الفعلي": "Getting started",

  "عن المنصة": "About the platform",

  "نظام لإدارة أعمالك، وشبكة اختيارية توصلك بباقي السوق":
    "A system to manage your business, plus an optional network that connects you with the market.",

  "نص يشرح الفكرة المزدوجة بشكل مبسط، بدون مصطلحات تقنية داخلية (WEB-FR-014).":
    "A simple explanation of the dual model, without internal technical terms.",

  "الموديل المزدوج": "The dual model",
  "إدارة عملك بشكل مستقل": "Manage your business independently",

  "نظام كامل لإدارة نشاطك التجاري وحده، بدون أي التزام بالشبكة.":
    "A complete system to manage your business independently, with no network commitment.",

  "شبكة تجارية اختيارية": "Optional trade network",

  "انضم اختياريًا للبحث والبيع والشراء مع تجار آخرين على الشبكة.":
    "Optionally join the network to search, sell, and buy with other traders.",

  "حلول لكل فئة": "Solutions for every segment",
  "كيف تبدأ": "How to start",
  "سجّل كـ": "Register as",

  "التسجيل يخضع للمراجعة قبل التفعيل، ولا يمنح دخولًا فوريًا.":
    "Registration is reviewed before activation and does not grant immediate access.",

  "جاهز تبدأ؟": "Ready to begin?",

  "هل لازم أنضم للشبكة التجارية؟": "Do I have to join the trade network?",

  "لا، الانضمام للشبكة اختياري تمامًا. تقدر تستخدم Partiva لإدارة نشاطك فقط بدون الانضمام لأي شبكة.":
    "No. Joining the network is completely optional. You can use Partiva to manage your business without joining any network.",

  "بيانات نشاطي هتبقى منفصلة عن التجار التانيين؟":
    "Will my business data be separate from other traders?",

  "أيوه، كل نشاط تجاري ليه بياناته الخاصة، ومفيش أي نشاط تاني يقدر يشوفها إلا لو انت فعّلت مشاركتها عبر الشبكة الاختيارية.":
    "Yes. Every business has its own data, and no other business can see it unless you enable sharing through the optional network.",

  "بيحصل إيه بعد ما أسجل؟": "What happens after I register?",

  "طلبك بيدخل في مراجعة قبل التفعيل، وهتوصلك رسالة على الإيميل بقرار الطلب — القبول أو الرفض.":
    "Your request is reviewed before activation, and you will receive an email with the decision — approval or rejection.",

  "هل التفعيل بيكون فوري؟": "Is activation immediate?",

  "لا، التسجيل يخضع للمراجعة أولًا ولا يمنح دخولًا فوريًا.":
    "No. Registration is reviewed first and does not grant immediate access.",

  "أقدر أغيّر خطتي بعد التسجيل؟": "Can I change my plan after registration?",

  "أيوه، تقدر تغيّر خطتك في أي وقت.":
    "Yes, you can change your plan at any time.",

  "بيحصل إيه لو تعديت حدود خطتي؟": "What happens if I exceed my plan limits?",

  "الحدود بتتطبّق فورًا مع أي تغيير في الخطة.":
    "Limits are applied immediately whenever the plan changes.",

  "الخصوصية والبيانات": "Privacy and data",
  "التسجيل والمراجعة": "Registration and review",
  "الأسعار والخطط": "Pricing and plans",

  "أسئلة بتتكرر كتير عن Partiva": "Common questions about Partiva",

  "إجابات مباشرة عن الشبكة الاختيارية، الخصوصية، ومراحل المراجعة.":
    "Direct answers about the optional network, privacy, and the review stages.",

  "لسه عندك سؤال؟": "Still have a question?",

  "أدخل البريد الإلكتروني": "Enter your email address",
  "أدخل بريد إلكتروني صحيح": "Enter a valid email address",

  "تعذر إرسال رابط استعادة كلمة المرور":
    "Unable to send the password reset link",

  "تعذر إرسال الطلب، حاول مرة أخرى":
    "Unable to send the request. Please try again.",

  "تحقق من بريدك الإلكتروني": "Check your email",

  "إذا كان البريد الإلكتروني مرتبطًا بحساب، فسيصلك رابط لإعادة تعيين كلمة المرور.":
    "If the email is linked to an account, you will receive a password reset link.",

  "العودة لتسجيل الدخول": "Back to sign in",

  "أدخل البريد الإلكتروني المرتبط بحسابك وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.":
    "Enter the email linked to your account and we will send a password reset link.",

  "إرسال رابط الاستعادة": "Send reset link",
  "جارِ الإرسال...": "Sending...",

  "أدخل كلمة المرور": "Enter your password",

  "كلمة المرور يجب أن تكون 8 أحرف على الأقل":
    "Password must be at least 8 characters",

  "البريد الإلكتروني أو كلمة المرور غير صحيحة":
    "Incorrect email address or password",

  "تعذر تسجيل الدخول، حاول مرة أخرى": "Unable to sign in. Please try again.",

  "سجّل الدخول إلى حسابك في Partiva": "Sign in to your Partiva account",

  "إخفاء كلمة المرور": "Hide password",
  "إظهار كلمة المرور": "Show password",
  تذكرني: "Remember me",
  "جارِ تسجيل الدخول...": "Signing in...",

  "ليس لديك حساب؟": "Don’t have an account?",
  "إنشاء حساب جديد": "Create a new account",

  "موزع بالجملة": "Wholesale distributor",
  مستورد: "Importer",
  ورشة: "Workshop",

  "أدخل اسم النشاط التجاري": "Enter the business name",

  "أدخل رقم سجل تجاري صحيح": "Enter a valid commercial registration number",

  "اختر النشاط التجاري": "Choose a business activity",
  "أدخل اسم جهة الاتصال": "Enter the contact name",

  "أدخل رقم جوال صحيح": "Enter a valid mobile number",

  "اختر خطة الاشتراك": "Choose a subscription plan",

  "يجب الموافقة على سياسة الخصوصية والشروط للمتابعة":
    "You must agree to the privacy policy and terms to continue",

  "هذا رقم السجل التجاري مسجل بالفعل":
    "This commercial registration number is already registered",

  "تعذر إرسال الطلب": "Unable to submit the request",

  "تم استلام طلبك": "Your request has been received",

  "تم استلام طلبك وهو الآن قيد المراجعة. سنقوم بإعلامك عبر البريد الإلكتروني بمجرد اتخاذ القرار.":
    "Your request has been received and is now under review. We will notify you by email once a decision is made.",

  "سجّل نشاطك التجاري": "Register your business",

  "أدخل بياناتك وسيتم مراجعة طلبك من قبل فريقنا":
    "Enter your details and our team will review your request",

  "اسم النشاط التجاري": "Business name",
  "رقم السجل التجاري": "Commercial registration number",
  "النشاط التجاري": "Business activity",
  "اسم جهة الاتصال": "Contact name",
  "المدينة / الفرع": "City / branch",
  "رقم الجوال": "Mobile number",
  "خطة الاشتراك": "Subscription plan",

  "أوافق على سياسة الخصوصية والشروط والأحكام":
    "I agree to the privacy policy and terms and conditions",

  // ==========================================
  // How It Works
  // ==========================================

  "من التسجيل لحد ما تبدأ تستخدم Partiva":
    "From registration until you start using Partiva",

  "الطلب بيمر بمراجعة قبل التفعيل — مش دخول فوري.":
    "Your request goes through a review before activation — access is not immediate.",

  "خطوات الانضمام": "Joining steps",

  "تملى بيانات نشاطك التجاري وتختار الخطة المناسبة لك.":
    "Fill in your business details and choose the plan that fits you.",

  "فريقنا بيراجع الطلب قبل أي تفعيل — الطلب بيكون بحالة قيد المراجعة.":
    "Our team reviews your request before activation — the request remains under review.",

  "بتوصلك رسالة على الإيميل بقرار الطلب — قبول أو رفض.":
    "You receive an email with the request decision — approved or rejected.",

  "لما يتم قبول طلبك، تقدر تدخل بحسابك وتبدأ تستخدم المنصة.":
    "Once your request is approved, you can sign in and start using the platform.",

  "عندك أسئلة عن الخصوصية أو مدة المراجعة؟":
    "Have questions about privacy or the review time?",

  "جاوبنا على أكتر الأسئلة اللي بتتكرر.":
    "We answered the most frequently asked questions.",

  "جاهز تبدأ رحلتك مع Partiva؟": "Ready to start your journey with Partiva?",

  "الطلب قيد المراجعة": "Request under review",

  "طلبك قيد المراجعة": "Your request is under review",

  "يتم مراجعة طلبك قبل تفعيل الحساب":
    "Your request is reviewed before your account is activated",

  "سيتم التواصل معك عبر البريد الإلكتروني": "You will be contacted by email",

  "بعد الموافقة": "After approval",

  "ابدأ استخدام المنصة": "Start using the platform",

  "من التسجيل إلى التفعيل": "From registration to activation",

  "رحلة بسيطة وواضحة للانضمام إلى Partiva":
    "A simple and clear journey to join Partiva",

  "ابدأ رحلتك": "Start your journey",

  "اختار نوع نشاطك": "Choose your business type",

  "اختر نوع النشاط التجاري المناسب لك":
    "Choose the business type that fits your business",

  "أرسل طلب التسجيل": "Submit your registration request",

  "أدخل بيانات نشاطك التجاري وأرسل الطلب للمراجعة":
    "Enter your business details and submit your request for review",

  "انتظر المراجعة": "Wait for review",

  "فريق Partiva يراجع بياناتك قبل التفعيل":
    "The Partiva team reviews your information before activation",

  "استلم قرار الطلب": "Receive the decision",

  "ستصلك رسالة عبر البريد الإلكتروني بنتيجة المراجعة":
    "You will receive an email with the review decision",

  "ابدأ استخدام Partiva": "Start using Partiva",

  "بعد الموافقة، يمكنك تسجيل الدخول والبدء في إدارة نشاطك":
    "After approval, you can sign in and start managing your business",

  "تسجيل نشاطك التجاري": "Register your business",

  "مراجعة الطلب": "Request review",

  "تفعيل الحساب": "Account activation",

  "بدء استخدام المنصة": "Start using the platform",

  "أكمل بيانات نشاطك التجاري": "Complete your business details",

  "اختار الخطة المناسبة": "Choose the right plan",

  "سيتم مراجعة طلبك": "Your request will be reviewed",

  "سيصلك إشعار بالنتيجة": "You will receive a notification with the result",

  "ابدأ إدارة نشاطك": "Start managing your business",

  // Pricing
  مجاني: "Free",

  "ر.س": "SAR",

  شهريًا: "monthly",

  "أسئلة عن الأسعار": "Pricing questions",

  "لو قللت خطتي، هيحصل إيه للبيانات اللي فوق الحد الجديد؟":
    "What happens to data that exceeds the new limit if I downgrade?",

  "مش متأكد من الخطة المناسبة؟": "Not sure which plan is right for you?",

  "الأسعار بالريال السعودي": "Prices are in Saudi Riyals",

  "التجربة المجانية": "Free Trial",

  "جرب Partiva لمدة أسبوع": "Try Partiva for one week",

  "لمدة 7 أيام": "for 7 days",

  "تجربة مجانية لمدة أسبوع": "7-day free trial",

  "ابدأ بالتجربة المجانية لمدة أسبوع واكتشف Partiva بنفسك.":
    "Start your free one-week trial and discover Partiva for yourself.",

  الاسئلة: "questions",

  // ==========================================
  // Contact page
  // ==========================================

  "تواصل مع فريق Partiva": "Get in touch with the Partiva team",

  "عندك سؤال عن المنصة أو الأسعار أو الشراكة معنا؟ املأ النموذج أو تواصل معنا مباشرة وسيرد عليك فريقنا في أقرب وقت.":
    "Have a question about the platform, pricing, or partnering with us? Fill out the form or reach us directly, and our team will get back to you shortly.",

  "طرق التواصل": "Ways to reach us",
  واتساب: "WhatsApp",
  "الموقع الإلكتروني": "Website",
  الموقع: "Location",

  "أرسل لنا رسالة": "Send us a message",
  "الاسم الكامل": "Full name",
  "أدخل اسمك الكامل": "Enter your full name",

  "نوع الاستفسار": "Inquiry type",
  "اختر نوع الاستفسار": "Select inquiry type",
  المبيعات: "Sales",
  الشراكات: "Partnership",
  الإعلام: "Press",
  أخرى: "Other",

  الرسالة: "Message",
  "من فضلك اكتب رسالة لا تقل عن 10 أحرف":
    "Please write a message of at least 10 characters.",

  "(اختياري)": "(Optional)",

  "إرسال الرسالة": "Send message",
  "إرسال رسالة أخرى": "Send another message",

  "تم استلام رسالتك": "Your message has been received",
  "شكرًا لتواصلك معنا! سيقوم فريقنا بالرد عليك في أقرب وقت ممكن.":
    "Thank you for reaching out! Our team will get back to you as soon as possible.",

  // ==========================================
  // Features page
  // ==========================================

  "أدوات ومميزات تساعدك على تنظيم نشاطك ومتابعة أعمالك بطريقة أبسط وأكثر وضوحًا.":
    "Tools and features that help you organize your business and manage your operations in a simpler and clearer way.",

  // Audience headings
  "مميزات لأصحاب المحلات": "Features for shop owners",
  "مميزات للورش": "Features for workshops",
  "مميزات للموزعين": "Features for distributors",

  "اكتشف المميزات المناسبة لطبيعة نشاطك.":
    "Discover the features designed for your type of business.",

  // ==========================================
  // Shop owners
  // ==========================================

  "تابع منتجاتك ومخزونك وسهّل إدارة احتياجات محلك وفروعك من مكان واحد.":
    "Track your products and inventory while making it easier to manage your shop and branches from one place.",

  "تنظيم أعمالك اليومية": "Organize your daily operations",

  "خلّي متابعة عمليات نشاطك أكثر تنظيمًا وسهولة.":
    "Keep track of your business operations in a more organized and efficient way.",

  "التواصل مع السوق": "Connect with the market",

  "استفد من إمكانية التواصل والوصول إلى أطراف أخرى في السوق عند الحاجة.":
    "Connect with other market participants and benefit from opportunities when needed.",

  "التقارير والمتابعة": "Reports and insights",

  "تابع أداء نشاطك واحصل على رؤية أوضح تساعدك في اتخاذ قرارات أفضل.":
    "Track your business performance and gain clearer insights to support better decisions.",

  // ==========================================
  // Workshops
  // ==========================================

  "إدارة احتياجات الورشة": "Manage workshop needs",

  "نظّم المنتجات والاحتياجات المرتبطة بالعمل اليومي للورشة.":
    "Organize the products and needs related to your workshop's daily operations.",

  "متابعة المخزون": "Inventory tracking",

  "تابع الكميات المتوفرة واعرف احتياجاتك بشكل أسهل.":
    "Keep track of available quantities and understand your needs more easily.",

  "تنظيم عملياتك": "Organize your operations",

  "خلّي إدارة ومتابعة عمليات الورشة أكثر وضوحًا وتنظيمًا.":
    "Make your workshop operations clearer, easier to manage, and more organized.",

  "تابع أداء نشاطك من خلال المعلومات والتقارير المتاحة.":
    "Track your business performance through the available information and reports.",

  // ==========================================
  // Distributors
  // ==========================================

  "إدارة المنتجات والمخزون": "Product and inventory management",

  "تابع منتجاتك وكميات المخزون وسهّل إدارة عمليات التوزيع.":
    "Track your products and inventory while making distribution operations easier to manage.",

  "إدارة الفروع": "Branch management",

  "تابع نشاط الفروع المختلفة ونظّم عملياتها من مكان واحد.":
    "Monitor your different branches and organize their operations from one place.",

  "تواصل مع أطراف أخرى في السوق واستفد من فرص التعاون عند الحاجة.":
    "Connect with other market participants and benefit from collaboration opportunities when needed.",

  "احصل على رؤية أوضح لأداء نشاطك وساعد في اتخاذ قرارات أفضل.":
    "Gain clearer insights into your business performance and make better decisions.",

  // ==========================================
  // Pricing teaser
  // ==========================================

  "شوف الفروقات بين الخطط واختار الأنسب لاحتياجات نشاطك.":
    "Compare the plans and choose the one that best fits your business needs.",

  // ==========================================
  // Closing CTA
  // ==========================================

  "اكتشف المزايا المناسبة لنشاطك":
    "Discover the features that fit your business",

  "ابدأ مع Partiva واكتشف كيف يمكن للمنصة مساعدتك في تنظيم وإدارة نشاطك.":
    "Get started with Partiva and discover how the platform can help you organize and manage your business.",

    "المجانية":"Free"
};

// ======================================================
// Context
// ======================================================

export default function LanguageProvider({
  children,
  initialLocale = "ar",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>("ar");
  const [initialized, setInitialized] = useState(false);

  // ==========================================
  // Read saved language ONCE
  // ==========================================

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("partiva-locale");

    if (savedLocale === "ar" || savedLocale === "en") {
      setLocale(savedLocale);
    } else {
      setLocale(initialLocale);
    }

    setInitialized(true);
  }, [initialLocale]);

  // ==========================================
  // Apply language
  // ==========================================

  useEffect(() => {
    // Don't run until localStorage has been checked
    if (!initialized) return;

    document.documentElement.lang = locale;

    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";

    document.documentElement.dataset.locale = locale;

    // Save selected language
    window.localStorage.setItem("partiva-locale", locale);

    // Also save it in cookie
    document.cookie = `partiva-locale=${locale}; path=/; max-age=31536000; samesite=lax`;

    // Translate page
    const observer = translatePage(locale);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [locale, initialized]);

  // ==========================================
  // Toggle language
  // ==========================================

  const toggleLocale = () => {
    setLocale((currentLocale) => (currentLocale === "ar" ? "en" : "ar"));
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        toggleLocale,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// ======================================================
// DOM Translation
// ======================================================

const originalText = new WeakMap<Node, string>();

function translatePage(locale: Locale) {
  const translate = () => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );

    const nodes: Text[] = [];

    while (walker.nextNode()) {
      nodes.push(walker.currentNode as Text);
    }

    nodes.forEach((node) => {
      if (node.parentElement?.closest("[data-language-managed]")) {
        return;
      }

      const source = originalText.get(node) ?? node.nodeValue ?? "";

      if (!originalText.has(node)) {
        originalText.set(node, source);
      }

      const key = source.replace(/\s+/g, " ").trim();

      const nextValue = locale === "en" ? (englishCopy[key] ?? source) : source;

      if (node.nodeValue !== nextValue) {
        node.nodeValue = nextValue;
      }
    });
  };

  translate();

  return new MutationObserver(translate);
}

// ======================================================
// Hook
// ======================================================

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
