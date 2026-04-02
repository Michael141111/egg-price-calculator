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

    // Additional strings for main page
    enterQuantity: 'أدخل الكمية',
    enterPrice: 'أدخل السعر',
    addQuantity: 'إضافة كمية',
    deleteQuantity: 'حذف الكمية',
    edit: 'تعديل',
    delete: 'حذف',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    close: 'إغلاق',
    selectEggType: 'اختر نوع البيض',
    enterCartonPrice: 'أدخل سعر الكرتونة',
    pricePerEgg: 'سعر البيضة الواحدة',
    cartonPrice: 'سعر الكرتونة',
    calculatePrice: 'حساب السعر',
    switchMode: 'تبديل طريقة الحساب',
    pricePerEggMode: 'حساب بالبيضة الواحدة',
    cartonPriceMode: 'حساب بالكرتونة',

    // Settings page
    cartonPrices: 'أسعار الكراتين',
    currentPrices: 'الأسعار الحالية',
    defaultPrices: 'القيم الافتراضية الحالية',
    redEggPrice: 'سعر كرتونة البيض الأحمر',
    whiteEggPrice: 'سعر كرتونة البيض الأبيض',
    localEggPrice: 'سعر كرتونة البيض البلدي',
    currencyName: 'اسم العملة',
    saveSettings: 'حفظ الإعدادات',
    saveAsDefaults: 'حفظ كأسعار افتراضية',
    restoreDefaults: 'استعادة القيم الافتراضية',
    savingSettings: 'جاري حفظ الإعدادات...',
    settingsSaved: 'تم حفظ الإعدادات بنجاح',
    settingsError: 'حدث خطأ أثناء حفظ الإعدادات',

    // Favorites settings
    addFavoriteQuantity: 'إضافة كمية مفضلة',
    removeFavoriteQuantity: 'إزالة كمية مفضلة',
    editFavoriteQuantity: 'تعديل كمية مفضلة',
    quantityAlreadyExists: 'هذه الكمية موجودة بالفعل',
    quantityAdded: 'تمت إضافة الكمية بنجاح',
    quantityRemoved: 'تمت إزالة الكمية بنجاح',
    quantityUpdated: 'تم تحديث الكمية بنجاح',

    // Analytics page
    statistics: 'الإحصائيات',
    recordCount: 'عدد السجلات',
    noRecords: 'لا توجد سجلات',
    selectDateRange: 'اختر نطاق التاريخ',
    from: 'من',
    to: 'إلى',
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

    // Additional strings for main page
    enterQuantity: 'Enter quantity',
    enterPrice: 'Enter price',
    addQuantity: 'Add quantity',
    deleteQuantity: 'Delete quantity',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    selectEggType: 'Select egg type',
    enterCartonPrice: 'Enter carton price',
    pricePerEgg: 'Price per egg',
    cartonPrice: 'Carton price',
    calculatePrice: 'Calculate price',
    switchMode: 'Switch calculation mode',
    pricePerEggMode: 'Calculate by single egg',
    cartonPriceMode: 'Calculate by carton',

    // Settings page
    cartonPrices: 'Carton Prices',
    currentPrices: 'Current Prices',
    defaultPrices: 'Current Default Values',
    redEggPrice: 'Red Egg Carton Price',
    whiteEggPrice: 'White Egg Carton Price',
    localEggPrice: 'Local Egg Carton Price',
    currencyName: 'Currency Name',
    saveSettings: 'Save Settings',
    saveAsDefaults: 'Save as Default Prices',
    restoreDefaults: 'Restore Default Values',
    savingSettings: 'Saving settings...',
    settingsSaved: 'Settings saved successfully',
    settingsError: 'Error saving settings',

    // Favorites settings
    addFavoriteQuantity: 'Add favorite quantity',
    removeFavoriteQuantity: 'Remove favorite quantity',
    editFavoriteQuantity: 'Edit favorite quantity',
    quantityAlreadyExists: 'This quantity already exists',
    quantityAdded: 'Quantity added successfully',
    quantityRemoved: 'Quantity removed successfully',
    quantityUpdated: 'Quantity updated successfully',

    // Analytics page
    statistics: 'Statistics',
    recordCount: 'Record Count',
    noRecords: 'No records',
    selectDateRange: 'Select date range',
    from: 'From',
    to: 'To',
  },
};

export function t(key: keyof typeof translations.ar, language: Language = 'ar'): string {
  return translations[language][key] || key;
}
