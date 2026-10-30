const productsData = [
  {
    "id": 1,
    "name": "تصميم سيرفر دسكورد احترافي",
    "description": "تصميم كامل للسيرفر مع رتب، رومانات تنظيمية، حماية متقدمة، وبوتات أساسية جاهزة",
    "category": "server",
    "badge": "الأكثر طلبا",
    "badgeType": "popular",
    "price": "طلب خاص",
    "features": [],
    "icon": "fa-brands fa-discord",
    "hasImage": false,
    "imageUrl": null
  },
  {
    "id": 2,
    "name": "بوت برودكاست",
    "description": "ارتقِ بإدارة سيرفرك مع بوت برودكاست احترافي، مصمم لإرسال الإعلانات والتنبيهات بسرعة وسهولة. آمن، مستقر، ويعمل بكفاءة عالية على السيرفرات الصغيرة والكبيرة.",
    "category": "bots",
    "badge": "🚀 بوت احترافي",
    "badgeType": "bot",
    "price": "طلب خاص",
    "features": [
      { "text": "Python", "icon": "🐍" },
      { "text": "إرسال للجميع", "icon": "🚀" },
      { "text": "ملكك بالكامل", "icon": "👑" },
      { "text": "معرفة الـ Ping", "icon": "📡" },
      { "text": "آمن ومستقر", "icon": "🔒" },
      { "text": "قابل للتطوير", "icon": "🔄" }
    ],
    "icon": null,
    "hasImage": true,
    "imageUrl": "assets/broadcast-bot.png"
  },
  {
    "id": 3,
    "name": "برمجة بوت دسكورد مخصص",
    "description": "برمجة بوت بلغة بايثون أو جافاسكريبت حسب طلبك (تذاكر، ترحيب، حماية، أو ألعاب)",
    "category": "bots",
    "badge": "برمجة خاصة",
    "badgeType": "custom",
    "price": "تواصل للاتفاق",
    "features": [
      { "text": "Python", "icon": "🐍" },
      { "text": "JavaScript", "icon": "⚡" },
      { "text": "مخصص", "icon": "🔧" }
    ],
    "icon": "fa-solid fa-robot",
    "hasImage": false,
    "imageUrl": null
  },
  {
    "id": 4,
    "name": "حزم الحماية والإدارة",
    "description": "أنظمة حماية ضد التخريب (Anti-Nuke)، تفعيل نظام التحقق التلقائي، وإدارة الرتب الحساسة",
    "category": "protection",
    "badge": "حماية وإدارة",
    "badgeType": "protection",
    "price": "استشارة مجانية",
    "features": [
      { "text": "Anti-Nuke", "icon": "🛡️" },
      { "text": "تحقق تلقائي", "icon": "✅" },
      { "text": "إدارة الرتب", "icon": "👑" }
    ],
    "icon": "fa-solid fa-shield-halved",
    "hasImage": false,
    "imageUrl": null
  },
  {
    "id": 5,
    "name": "ضبط سيرفر دسكورد كامل",
    "description": "خدمة شاملة لضبط سيرفرك من الصفر - تصميم وتنظيم وحماية كاملة لتكون جاهزاً للاستخدام الاحترافي من أول يوم",
    "category": "server",
    "badge": "✨ ضبـط كامل",
    "badgeType": "popular",
    "price": "حسب الطلب",
    "features": [
      { "text": "تصميم رومات فخم", "icon": "🎨" },
      { "text": "إعداد البوتات والأنظمة", "icon": "⚙️" },
      { "text": "حماية قوية ضد التخريب", "icon": "🛡️" },
      { "text": "تنظيم الرتب والصلاحيات", "icon": "👥" },
      { "text": "نظام تذاكر ودعم فني", "icon": "💬" },
      { "text": "سجلات وإحصائيات متقدمة", "icon": "📊" },
      { "text": "نظام ترحيب ذكي", "icon": "🤝" },
      { "text": "إيموجيات وستيكرات مخصصة", "icon": "🎉" },
      { "text": "ربط السوشال ميديا", "icon": "🔗" },
      { "text": "رومات ألعاب ومجتمع", "icon": "🎮" },
      { "text": "تحسين الشكل العام", "icon": "✨" }
    ],
    "icon": "fa-solid fa-sliders",
    "hasImage": false,
    "imageUrl": null
  }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { _target } = req.query || {};
  if (_target === 'settings') {
    return res.status(200).json({ storeName: '7SO STORE', discordLink: 'https://discord.gg/gupu65sVck' });
  }
  return res.status(200).json(productsData);
};
