import type { Article, ArticleBlock } from "@/src/app/types/article";
import partsShopBlocks from "./content/parts-shop-management.json";
import autoPartsInventoryBlocks from "./content/auto-parts-inventory-management-guide";
import repeatPurchaseBlocks from "./content/increase-repeat-purchase-auto-parts-customers";
import autoPartsSalesManagementBlocks from "./content/auto-parts-sales-and-customer-management";
import autoPartsStoreWorkflowBlocks from "./content/auto-parts-store-order-to-delivery-workflow";
import choosingManagementSoftwareBlocks from "./content/choosing-auto-parts-workshop-management-software";
import autoPartsSalesGrowthBlocks from "./content/auto-parts-sales-growth-and-customer-retention";
import autoPartsStockoutPreventionBlocks from "./content/prevent-auto-parts-stockouts-and-overstock";
import autoPartsManagementSoftwareBuyersGuideBlocks from "./content/auto-parts-workshop-distributor-software-buyers-guide";
import autoPartsManagementSoftwareEnglishBlocks from "./content/auto-parts-management-software-buyers-guide.en";
import autoPartsInventoryManagementEnglishBlocks from "./content/auto-parts-inventory-management-guide.en";
import autoPartsSalesCustomerManagementEnglishBlocks from "./content/auto-parts-sales-and-customer-management.en";
import increaseRepeatPurchaseEnglishBlocks from "./content/increase-repeat-purchase-auto-parts-customers.en";
import preventStockoutsOverstockEnglishBlocks from "./content/prevent-auto-parts-stockouts-and-overstock.en";
import autoPartsSalesGrowthEnglishBlocks from "./content/auto-parts-sales-growth-and-customer-retention.en";
import choosingManagementSoftwareEnglishBlocks from "./content/choosing-auto-parts-workshop-management-software.en";
import autoPartsStoreWorkflowEnglishBlocks from "./content/auto-parts-store-order-to-delivery-workflow.en";
import reduceOrderErrorsReturnsEnglishBlocks from "./content/reduce-auto-parts-order-errors-and-returns.en";

/**
 * Every article the /articles page renders lives in this array.
 * To add a new article:
 *   1. Drop its cover image in /public/images/articles/
 *   2. Write its body as an ArticleBlock[] — either hand-written here, or
 *      generated the same way this one was (see README) — and put it in
 *      /data/content/<slug>.json
 *   3. Push a new Article object below.
 * Nothing else in the app needs to change — the list, the accordion and
 * the logo-stamped cover are all driven by this array.
 */
export const articles: Article[] = [
  {
    language: "en",
    slug: "auto-parts-sales-and-customer-management-en",
    title: "How to Manage Auto Parts Sales and Customers Efficiently",
    excerpt: "A practical guide to connecting customers, products, inventory, quotations, orders, and follow-up into a scalable sales operation.",
    category: "Sales Management",
    readMinutes: 18,
    publishedAt: "2026-08-17",
    cover: { src: "/images/articles/auto-parts-sales-and-customer-management-en.svg", alt: "Managing auto parts sales and customer relationships", width: 1200, height: 800 },
    content: autoPartsSalesCustomerManagementEnglishBlocks,
  },
  {
    language: "en",
    slug: "auto-parts-inventory-management-guide-en",
    title: "Auto Parts Inventory Management: A Practical Guide to Organizing Inventory and Reducing Waste",
    excerpt: "A practical guide to accurate part data, stock movement, reordering, supplier management, inventory KPIs, and reducing dead stock.",
    category: "Inventory Management",
    readMinutes: 18,
    publishedAt: "2026-08-17",
    cover: { src: "/images/articles/auto-parts-inventory-management-guide-en.svg", alt: "Organized auto parts inventory in a warehouse", width: 1200, height: 800 },
    content: autoPartsInventoryManagementEnglishBlocks,
  },
  {
    language: "en",
    slug: "auto-parts-management-software-buyers-guide",
    title: "How to Choose Auto Parts Management Software for Shops, Workshops, and Distributors",
    excerpt: "A practical pre-purchase guide to selecting auto parts management software for inventory, sales, suppliers, customers, reporting, and business growth.",
    category: "Operations Management",
    readMinutes: 18,
    publishedAt: "2026-08-17",
    cover: { src: "/images/articles/auto-parts-management-software-buyers-guide.svg", alt: "Auto parts management software selection guide", width: 1200, height: 800 },
    content: autoPartsManagementSoftwareEnglishBlocks,
  },
  {
    language: "en",
    slug: "increase-repeat-purchase-auto-parts-customers-en",
    title: "How to Increase Repeat Purchases from Auto Parts Customers",
    excerpt: "A practical guide to building customer loyalty: segment customers, track purchase history, measure retention, and turn service quality into a reason to come back.",
    category: "Customer Management",
    readMinutes: 18,
    publishedAt: "2026-08-17",
    cover: { src: "/images/articles/increase-repeat-purchase-auto-parts-customers-en.svg", alt: "A customer receiving an auto part from a store employee", width: 1200, height: 800 },
    content: increaseRepeatPurchaseEnglishBlocks,
  },
  {
    language: "en",
    slug: "prevent-auto-parts-stockouts-and-overstock-en",
    title: "How to Prevent Auto Parts Stockouts and Overstocking",
    excerpt: "A smart guide to inventory management for auto parts stores and repair shops: balance part availability against tied-up capital using data, not guesswork.",
    category: "Inventory Management",
    readMinutes: 18,
    publishedAt: "2026-08-17",
    cover: { src: "/images/articles/prevent-auto-parts-stockouts-and-overstock-en.svg", alt: "Preventing stockouts and overstocking in an auto parts store", width: 1200, height: 800 },
    content: preventStockoutsOverstockEnglishBlocks,
  },
  {
    language: "en",
    slug: "auto-parts-sales-growth-and-customer-retention-en",
    title: "How to Increase Auto Parts Store Sales and Retain Customers",
    excerpt: "A practical guide to sustainable growth: know your customers, speed up part search, compete beyond price, and turn every sale into a source of data.",
    category: "Sales Management",
    readMinutes: 17,
    publishedAt: "2026-08-17",
    cover: { src: "/images/articles/auto-parts-sales-growth-and-customer-retention-en.svg", alt: "Increasing auto parts store sales and retaining customers", width: 1200, height: 800 },
    content: autoPartsSalesGrowthEnglishBlocks,
  },
  {
    language: "en",
    slug: "choosing-auto-parts-workshop-management-software-en",
    title: "How to Choose the Right Management Software for an Auto Parts Store or Repair Shop",
    excerpt: "A practical guide to organizing customers, products, inventory, sales, and orders, and choosing software that helps your business grow efficiently.",
    category: "Operations Management",
    readMinutes: 16,
    publishedAt: "2026-08-17",
    cover: { src: "/images/articles/choosing-auto-parts-workshop-management-software-en.svg", alt: "Choosing management software for an auto parts store or repair shop", width: 1200, height: 800 },
    content: choosingManagementSoftwareEnglishBlocks,
  },
  {
    language: "en",
    slug: "auto-parts-store-order-to-delivery-workflow-en",
    title: "Managing Auto Parts Store Operations from Order to Delivery",
    excerpt: "How to build a more efficient workflow, from receiving the order to delivery, with clear statuses, responsibilities, and connected data.",
    category: "Operations Management",
    readMinutes: 16,
    publishedAt: "2026-08-17",
    cover: { src: "/images/articles/auto-parts-store-order-to-delivery-workflow-en.svg", alt: "Managing auto parts store operations from order to delivery", width: 1200, height: 800 },
    content: autoPartsStoreWorkflowEnglishBlocks,
  },
  {
    language: "en",
    slug: "reduce-auto-parts-order-errors-and-returns",
    title: "How to Reduce Automotive Spare Parts Order Errors and Returns",
    excerpt: "A practical guide to improving sales accuracy: standardize part data, verify compatibility, and turn returns into a source of operational insight.",
    category: "Sales Management",
    readMinutes: 18,
    publishedAt: "2026-08-17",
    cover: { src: "/images/articles/reduce-auto-parts-order-errors-and-returns.svg", alt: "Reducing auto parts order errors and returns", width: 1200, height: 800 },
    content: reduceOrderErrorsReturnsEnglishBlocks,
  },
  {
    language: "ar",
    slug: "auto-parts-workshop-distributor-software-buyers-guide",
    title: "كيف تختار برنامج إدارة قطع غيار السيارات والورش والموزعين؟",
    excerpt: "دليل عملي قبل الشراء لتقييم برامج إدارة قطع الغيار والورش والتوزيع، من المخزون والمبيعات إلى التكاملات والأمان وقابلية التوسع.",
    category: "إدارة العمليات",
    readMinutes: 18,
    publishedAt: "2026-08-17",
    cover: {
      src: "/images/articles/auto-parts-workshop-distributor-software-buyers-guide.svg",
      alt: "دليل اختيار برنامج إدارة قطع غيار السيارات والورش والموزعين",
      width: 1200,
      height: 800,
    },
    content: autoPartsManagementSoftwareBuyersGuideBlocks,
  },
  {
    language: "ar",
    slug: "prevent-auto-parts-stockouts-and-overstock",
    title: "كيف تمنع نفاد قطع الغيار وتكدس المخزون؟",
    excerpt: "دليل ذكي لإدارة مخزون محلات وورش قطع غيار السيارات: توازن بين توفر القطعة عند الحاجة وتقليل رأس المال المتجمد والمخزون الراكد.",
    category: "إدارة المخزون",
    readMinutes: 18,
    publishedAt: "2026-08-17",
    cover: {
      src: "/images/articles/prevent-auto-parts-stockouts-and-overstock.svg",
      alt: "منع نفاد قطع الغيار وتكدس المخزون في محل قطع غيار سيارات",
      width: 1200,
      height: 800,
    },
    content: autoPartsStockoutPreventionBlocks,
  },
  {
    language: "ar",
    slug: "auto-parts-sales-growth-and-customer-retention",
    title: "كيف تزيد مبيعات محل قطع غيار السيارات وتحافظ على العملاء؟",
    excerpt: "دليل عملي لزيادة مبيعات قطع الغيار عبر تنظيم بيانات العملاء والطلبات والمخزون، وتحسين تجربة الشراء وبناء علاقات تعيد العميل للشراء.",
    category: "إدارة المبيعات",
    readMinutes: 17,
    publishedAt: "2026-08-17",
    cover: {
      src: "/images/articles/auto-parts-sales-growth-and-customer-retention.svg",
      alt: "زيادة مبيعات محل قطع غيار السيارات والحفاظ على العملاء",
      width: 1200,
      height: 800,
    },
    content: autoPartsSalesGrowthBlocks,
  },
  {
    language: "ar",
    slug: "choosing-auto-parts-workshop-management-software",
    title: "كيف تختار برنامج إدارة مناسب لمحل قطع غيار السيارات أو الورشة؟",
    excerpt: "دليل عملي لاختيار برنامج إدارة ينظم العملاء والمنتجات والمخزون والمبيعات والطلبات، ويساعد محل قطع الغيار أو الورشة على النمو بكفاءة.",
    category: "إدارة العمليات",
    readMinutes: 16,
    publishedAt: "2026-08-17",
    cover: {
      src: "/images/articles/choosing-auto-parts-workshop-management-software.svg",
      alt: "دليل اختيار برنامج إدارة لمحل قطع غيار السيارات أو الورشة",
      width: 1200,
      height: 800,
    },
    content: choosingManagementSoftwareBlocks,
  },
  {
    language: "ar",
    slug: "auto-parts-shop-inventory-management",
    title:
      "إدارة محل قطع غيار السيارات: الدليل العملي لتنظيم المخزون والمبيعات والعملاء",
    excerpt:
      "إدارة محل قطع غيار السيارات لا تبدأ من رفوف المخزن، ولا تنتهي عند تسجيل عملية البيع. دليل عملي لتوحيد بيانات القطع، وضبط الجرد، ومتابعة العملاء والموردين.",
    category: "إدارة المخزون",
    readMinutes: 14,
    publishedAt: "2026-08-17",
    cover: {
      src: "/images/articles/auto-parts-shop-inventory-management.svg",
      alt: "رفوف مخزون في محل قطع غيار سيارات مع لوحة عنوان الدليل العملي لإدارة المخزون والمبيعات والعملاء",
      width: 1200,
      height: 800,
    },
    content: partsShopBlocks as ArticleBlock[],
  },


  {
    language: "ar",
    slug: "auto-parts-inventory-management-guide",
    title:
      "إدارة مخزون قطع غيار السيارات: الدليل العملي لتنظيم المخزون وتقليل الهدر",
    excerpt:
      "إدارة مخزون قطع غيار السيارات لا تتوقف عند تسجيل الكميات على الرف، بل تمتد لتشمل دقة بيانات القطع، وحركة المخزون، والموردين، وربط ذلك كله بالمبيعات. دليل عملي لتنظيم المخزون، ضبط الجرد، وتقليل الهدر والمخزون الراكد.",
    category: "إدارة المخزون",
    readMinutes: 14,
    publishedAt: "2026-08-17",
    cover: {
      src: "/images/articles/auto-parts-inventory-management-guide.svg",
      alt: "رفوف مخزون منظمة بالأكواد في محل قطع غيار سيارات مع لوحة عنوان الدليل العملي لتنظيم المخزون وتقليل الهدر",
      width: 1200,
      height: 800,
    },
    content: autoPartsInventoryBlocks  as ArticleBlock[],
  },

  {
    language: "ar",
    slug: "increase-repeat-purchase-auto-parts-customers",
    title:
      "كيف تزيد تكرار الشراء من عملاء قطع غيار السيارات؟ دليل عملي لبناء ولاء العملاء وزيادة المبيعات",
    excerpt:
      "تكرار الشراء لدى عملاء قطع غيار السيارات لا يحدث تلقائيًا؛ فالعميل يقارن الأسعار والتوافر وسرعة الاستجابة، وقد ينتقل لمورد آخر بسهولة. دليل عملي لفهم دورة شراء العميل، وبناء سجل تاريخي له، وتحسين الخدمة لرفع ولائه ومعدل تكرار شرائه.",
    category: "إدارة العملاء",
    readMinutes: 16,
    publishedAt: "2026-08-17",
    cover: {
      src: "/images/articles/increase-repeat-purchase-auto-parts-customers.svg",
      alt: "عميل يستلم قطعة غيار سيارة من موظف محل قطع غيار مع لوحة عنوان الدليل العملي لزيادة تكرار الشراء وبناء ولاء العملاء",
      width: 1200,
      height: 800,
    },
    content: repeatPurchaseBlocks  as ArticleBlock[],
  },


  
  {
    language: "ar",
    slug: "auto-parts-sales-and-customer-management",
    title: "كيف تدير مبيعات قطع غيار السيارات والعملاء بكفاءة؟ دليل عملي للنمو وتنظيم العمليات",
    excerpt: "دليل عملي لتنظيم دورة البيع بالكامل، من بيانات العميل والمنتج إلى عروض الأسعار والمخزون والمتابعة وقياس الأداء.",
    category: "إدارة المبيعات",
    readMinutes: 18,
    publishedAt: "2026-08-17",
    cover: { src: "/images/articles/auto-parts-sales-and-customer-management.svg", alt: "إدارة مبيعات قطع غيار السيارات والعملاء", width: 1200, height: 800 },
    content: autoPartsSalesManagementBlocks,
  },
  {
    language: "ar",
    slug: "auto-parts-store-order-to-delivery-workflow",
    title: "إدارة عمليات محل قطع غيار السيارات من الطلب إلى التسليم",
    excerpt: "إدارة محل قطع غيار السيارات لا تتوقف عند بيع القطعة وتسليمها للعميل.",
    category: "إدارة العمليات",
    readMinutes: 16,
    publishedAt: "2026-08-17",
    cover: {"src":"/images/articles/auto-parts-store-order-to-delivery-workflow.svg","alt":"إدارة عمليات محل قطع غيار السيارات من الطلب إلى التسليم: كيف تبني دورة عمل أكثر كفاءة؟","width":1200,"height":800},
    content: autoPartsStoreWorkflowBlocks,
  },
];
