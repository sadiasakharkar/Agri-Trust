
import { Language } from './types';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: "Agri-Trust",
    tagline: "Simple Carbon Credits for Small Farmers",
    loginLabel: "Farmer ID (Kisan ID)",
    verify: "Start Registration",
    step_info: "1. Land Records",
    step_map: "2. Mark Boundary",
    step_evidence: "3. Photos (Optional)",
    step_results: "4. My Credits",
    farmerName: "Farmer Name",
    farmSize: "Farm Size (Acres)",
    cropType: "Main Crop",
    tillage: "Plowing Method",
    stateSelect: "Select State",
    khasraLabel: "Survey/Khasra Number",
    verifyLand: "Verify with Bhu-Naksha",
    landVerified: "Land Record Verified (AgriStack)",
    drawInstructions: "Tap the corners of your farm on the map. Trace fences or tree lines.",
    uploadPrompt: "Take photos of soil or crops for extra bonus credits.",
    skipImages: "Skip & Get Result",
    submit: "Analyze My Farm",
    calculating: "AI is checking satellite and farm data...",
    carbonScore: "Carbon Health",
    credits: "Tradable Credits",
    earnings: "Estimated Value",
    khata: "Sales Ledger",
    inventory: "Farm Inventory",
    nudges: "Earn More",
    dbt_label: "Aadhaar-Linked Bank Account",
    accept: "Accept Offer",
    decline: "Decline",
    market_rate: "National Carbon Index",
    voice_welcome: "Welcome to Agri-Trust. Let's register your farm land records for carbon credits.",
    voice_map: "Please tap the corners of your farm on the map to show us your land.",
    voice_results: "Great news! Your farm is sequestering carbon. Here are your estimated credits.",
    tutorialTitle: "Mapping Your Farm",
    tutorialBody: "Use landmarks like big trees, ridges, or paths to mark your boundaries accurately.",
    closeTutorial: "Got It"
  },
  hi: { 
    welcome: "एग्री-ट्रस्ट", 
    tagline: "छोटे किसानों के लिए सरल कार्बन क्रेडिट", 
    loginLabel: "किसान आईडी", 
    verify: "पंजीकरण शुरू करें", 
    verifyLand: "भू-નક્શા से सत्यापित करें",
    credits: "बिक्री योग्य क्रेडिट",
    earnings: "अनुमानित मूल्य",
    khata: "खाता / लेजर",
    dbt_label: "आधार-लिंक्ड बैंक खाता",
    accept: "स्वीकार करें",
    decline: "अस्वीकार करें"
  },
  mr: {
    welcome: "एग्री-ट्रस्ट",
    tagline: "छोट्या शेतकऱ्यांसाठी सोपे कार्बन क्रेडिट्स",
    credits: "विकण्यायोग्य क्रेडिट्स",
    earnings: "अंदाजित मूल्य",
    khata: "खाता / विक्री नोंदणी",
    dbt_label: "आधार-लिंक्ड बँक खाते",
    accept: "स्वीकार करा",
    decline: "नकार द्या"
  },
  // Add other languages as needed...
  ta: { welcome: "அக்ரி-ட்ரஸ்ட்", tagline: "சிறு விவசாயிகளுக்கான எளிய கார்பன் கிரெடிட்கள்", loginLabel: "விவசாயி ஐடி", verify: "பதிவைத் தொடங்கவும்", verifyLand: "பு-நக்ஷா மூலம் சரிபார்க்கவும்" },
  te: { welcome: "అగ్రి-ట్రస్ట్", tagline: "చిన్న రైతులకు సాధారణ కార్బన్ క్రెడిట్లు", loginLabel: "రైతు ఐడి", verify: "రిజిస్ట్రేషన్ ప్రారంభించండి", verifyLand: "భూ-నక్షతో ధృవీకరించండి" },
  bn: { welcome: "এগ্রি-ট্রাস্ট", tagline: "ক্ষুদ্র কৃষকদের জন্য সহজ কার্বন ক্রেডিট", loginLabel: "কৃষক আইডি", verify: "নিবন্ধন শুরু করুন", verifyLand: "ভু-নকশা দিয়ে যাচাই করুন" },
  kn: { welcome: "ಅಗ్రి-ಟ್ರಸ್ಟ್", tagline: "ಸಣ್ಣ ರೈತರಿಗೆ ಸುಲಭ ಕಾರ್બన్ ಕ್ರೆಡಿಟ್ಸ್", loginLabel: "ರೈತ ಐಡಿ", verify: "ನೋಂದಣಿ ಪ್ರಾರಂಭಿಸಿ", verifyLand: "ಭూ-ನಕ್ಷಾದೊಂದಿಗೆ ಹೋಲಿಸಿ" },
  ml: { welcome: "അഗ്രി-ട്രസ്റ്റ്", tagline: "ചെറുകിട കർഷകർക്ക് ലളിതമായ കാർബൺ ക്ലഡിറ്റുകൾ", loginLabel: "കർഷക ஐடி", verify: "രജിസ്ട്രേഷൻ ആരംഭിക്കുക", verifyLand: "ഭൂ-നക്ഷ ഉപയോഗിച്ച് പരിശോധിക്കുക" },
  pa: { welcome: "ਐਗਰੀ-ਟਰੱਸਟ", tagline: "ਛੋਟੇ ਕਿਸਾਨਾਂ ਲਈ ਸਰਲ ਕਾਰਬਨ ਕ੍ਰੈਡਿટ", loginLabel: "ਕਿਸਾਨ ਆਈਡੀ", verify: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸ਼ੁਰੂ ਕਰੋ", verifyLand: "ਭੂ-ਨਕਸ਼ਾ ਨਾਲ ਤਸਦੀક ਕਰੋ" },
  gu: { welcome: "એગ્રી-ટ્રસ્ટ", tagline: "નાના ખેડૂતો માટે સરળ કાર્બન ક્રેડિટ", loginLabel: "ખેડૂત આઈડી", verify: "નોંધણી શરૂ કરો", verifyLand: "ભૂ-નકશા સાથે ચકાસો" },
  or: { welcome: "ଏଗ୍ରି-ଟ୍ରଷ୍ଟ", tagline: "କ୍ଷୁଦ୍ର ଚାଷୀଙ୍କ ପାଇଁ ସରଳ କାର୍ବନ କ୍ରେଡିଟ୍", loginLabel: "ଚାଷୀ ଆଇଡି", verify: "ପଞ୍ଜିକରଣ ଆৰମ୍ଭ କରନ୍ତુ", verifyLand: "ଭୂ-ନକ୍ସା ସହିତ ଯାଞ୍ચ କରନ୍ତୁ" },
  as: { welcome: "এগ্ৰি-ট্ৰাষ্ট", tagline: "ক্ষুদ্ৰ কৃষকৰ বাবে সৰল কাৰ্বন ক্ৰেডিট", loginLabel: "কৃষক আইডি", verify: "পঞ্জীয়ন আৰম্ভ কৰক", verifyLand: "ভূ-নক্সাৰ সৈতে পৰীক্ষা কৰক" }
};

export const getTranslation = (lang: Language, key: string): string => {
  return translations[lang]?.[key] || translations['en']?.[key] || key;
};
