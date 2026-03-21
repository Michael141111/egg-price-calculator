// Multi-language support for the app
export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // App title and navigation
    appTitle: 'حاسبة أسعار البيض',
    home: 'الرئيسية',
    favorites: 'المفضلات',
    settings: 'الإعدادات',
    analytics: 'التحليلات',
    back: '← رجوع',

    // Main page
    eggCount: 'عدد البيض',
    eggPrice: 'سعر الكرتونة',
    total: 'الإجمالي',
    clear: 'مسح',
    remainder: 'الباقي',

    // Egg types
    redEgg: 'بيض أحمر',
    whiteEgg: 'بيض أبيض',
    localEgg: 'بيض بلدي',
    eggType: 'نوع البيض',

    // Favorites
    favoritePrices: 'الأسعار المفضلة',
    quantity: 'الكمية',
    addToFavorites: 'إضافة للمفضلات',
    removeFromFavorites: 'إزالة من المفضلات',
    favoriteQuantities: 'الكميات المفضلة',
    favoritesSettings: 'إعدادات المفضلات',
    priceList: 'قائمة الأسعار',

    // Settings
    appSettings: 'إعدادات التطبيق',
    language: 'اللغة',
    currency: 'العملة',
    theme: 'المظهر',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الداكن',
    auto: 'تلقائي',
    save: 'حفظ',
    reset: 'إعادة تعيين',
    export: 'تصدير',
    import: 'استيراد',

    // Analytics
    priceAnalytics: 'تحليل الأسعار',
    daily: 'يومي',
    weekly: 'أسبوعي',
    monthly: 'شهري',
    yearly: 'سنوي',
    highestPrice: 'أعلى سعر',
    lowestPrice: 'أقل سعر',
    averagePrice: 'متوسط السعر',
    priceHistory: 'سجل الأسعار',
    noData: 'لا توجد بيانات',
    selectPeriod: 'اختر الفترة الزمنية',

    // Currency
    egyptianPound: 'جنيه مصري',
    usDollar: 'دولار أمريكي',
    euro: 'يورو',

    // Messages
    success: 'تم بنجاح',
    error: 'حدث خطأ',
    loading: 'جاري التحميل...',
    noFavorites: 'لا توجد أسعار مفضلة',
    addFavoritesMessage: 'أضف كميات مفضلة لتتبع أسعارها',
  },
  en: {
    // App title and navigation
    appTitle: 'Egg Price Calculator',
    home: 'Home',
    favorites: 'Favorites',
    settings: 'Settings',
    analytics: 'Analytics',
    back: 'Back ←',

    // Main page
    eggCount: 'Egg Count',
    eggPrice: 'Carton Price',
    total: 'Total',
    clear: 'Clear',
    remainder: 'Remainder',

    // Egg types
    redEgg: 'Red Eggs',
    whiteEgg: 'White Eggs',
    localEgg: 'Local Eggs',
    eggType: 'Egg Type',

    // Favorites
    favoritePrices: 'Favorite Prices',
    quantity: 'Quantity',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    favoriteQuantities: 'Favorite Quantities',
    favoritesSettings: 'Favorites Settings',
    priceList: 'Price List',

    // Settings
    appSettings: 'App Settings',
    language: 'Language',
    currency: 'Currency',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    auto: 'Auto',
    save: 'Save',
    reset: 'Reset',
    export: 'Export',
    import: 'Import',

    // Analytics
    priceAnalytics: 'Price Analytics',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    highestPrice: 'Highest Price',
    lowestPrice: 'Lowest Price',
    averagePrice: 'Average Price',
    priceHistory: 'Price History',
    noData: 'No Data',
    selectPeriod: 'Select Time Period',

    // Currency
    egyptianPound: 'Egyptian Pound',
    usDollar: 'US Dollar',
    euro: 'Euro',

    // Messages
    success: 'Success',
    error: 'Error',
    loading: 'Loading...',
    noFavorites: 'No favorite prices',
    addFavoritesMessage: 'Add favorite quantities to track their prices',
  },
};

export function t(key: keyof typeof translations.ar, language: Language = 'ar'): string {
  return translations[language][key] || key;
}
