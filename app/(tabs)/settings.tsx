import { ScrollView, Text, View, Pressable, TextInput, I18nManager, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useCalculator } from '@/lib/calculator-context';
import { useThemeContext, type ThemeMode } from '@/lib/theme-provider';
import { useLanguage } from '@/lib/language-context';
import { useColors } from '@/hooks/use-colors';
import { Prices } from '@/lib/types';
import type { Language } from '@/lib/i18n';

I18nManager.forceRTL(true);

const getThemeOptions = (language: Language) => [
  { label: language === 'ar' ? 'فاتح' : 'Light', value: 'light' as ThemeMode },
  { label: language === 'ar' ? 'داكن' : 'Dark', value: 'dark' as ThemeMode },
  { label: language === 'ar' ? 'تلقائي حسب النظام' : 'Auto', value: 'system' as ThemeMode },
];

const getLanguageOptions = (language: Language) => [
  { label: language === 'ar' ? 'العربية' : 'Arabic', value: 'ar' as Language },
  { label: language === 'ar' ? 'English' : 'English', value: 'en' as Language },
];

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { settings, customDefaults, updatePrices, updateCurrency, resetToDefaults, saveCurrentAsDefaults } = useCalculator();
  const { themeMode, setThemeMode } = useThemeContext();
  const { language, setLanguage } = useLanguage();

  const [redPrice, setRedPrice] = useState(String(settings.prices.red));
  const [whitePrice, setWhitePrice] = useState(String(settings.prices.white));
  const [localPrice, setLocalPrice] = useState(String(settings.prices.local));
  const [currency, setCurrency] = useState(settings.currencyName);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingDefaults, setIsSavingDefaults] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const newPrices: Prices = {
        red: Math.max(0, parseInt(redPrice, 10) || 0),
        white: Math.max(0, parseInt(whitePrice, 10) || 0),
        local: Math.max(0, parseInt(localPrice, 10) || 0),
      };

      await updatePrices(newPrices);
      await updateCurrency(currency || (language === 'ar' ? 'جنيه مصري' : 'Egyptian Pound'));
      await setThemeMode(selectedTheme);
      if (selectedLanguage !== language) {
        await setLanguage(selectedLanguage);
      }

      alert(language === 'ar' ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully');
      router.back();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(language === 'ar' ? 'حدث خطأ أثناء حفظ الإعدادات' : 'Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreDefaults = async () => {
    Alert.alert(
      language === 'ar' ? 'استعادة القيم الافتراضية' : 'Restore Default Values',
      language === 'ar'
        ? `هل أنت متأكد من رغبتك في استعادة القيم الافتراضية\n\n🔴 البيض الأحمر: ${customDefaults.red} جنيه\n⚪ البيض الأبيض: ${customDefaults.white} جنيه\n🟤 البيض البلدي: ${customDefaults.local} جنيه`
        : `Are you sure you want to restore default values?\n\n🔴 Red Eggs: ${customDefaults.red}\n⚪ White Eggs: ${customDefaults.white}\n🟤 Local Eggs: ${customDefaults.local}`,
      [
        { text: language === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: language === 'ar' ? 'استعادة' : 'Restore',
          style: 'destructive',
          onPress: async () => {
            setRedPrice(String(customDefaults.red));
            setWhitePrice(String(customDefaults.white));
            setLocalPrice(String(customDefaults.local));
            setCurrency(language === 'ar' ? 'جنيه مصري' : 'Egyptian Pound');
            setSelectedTheme('system');
            await resetToDefaults();
            alert(language === 'ar' ? 'تم استعادة القيم الافتراضية بنجاح' : 'Default values restored successfully');
          },
        },
      ]
    );
  };

  const handleSaveAsDefaults = async () => {
    Alert.alert(
      language === 'ar' ? 'حفظ كأسعار افتراضية' : 'Save as Default Prices',
      language === 'ar'
        ? `هل الأسعار الحالية ستبقى القيم الافتراضية\n\n🔴 البيض الأحمر: ${redPrice} جنيه\n⚪ البيض الأبيض: ${whitePrice} جنيه\n🟤 البيض البلدي: ${localPrice} جنيه`
        : `Will these prices be saved as default values?\n\n🔴 Red Eggs: ${redPrice}\n⚪ White Eggs: ${whitePrice}\n🟤 Local Eggs: ${localPrice}`,
      [
        { text: language === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: language === 'ar' ? 'حفظ' : 'Save',
          style: 'default',
          onPress: async () => {
            setIsSavingDefaults(true);
            try {
              const newPrices: Prices = {
                red: Math.max(0, parseInt(redPrice, 10) || 0),
                white: Math.max(0, parseInt(whitePrice, 10) || 0),
                local: Math.max(0, parseInt(localPrice, 10) || 0),
              };
              // First, save the prices to current prices
              await updatePrices(newPrices);
              // Then, save them as defaults
              await saveCurrentAsDefaults();
              alert(language === 'ar' ? 'تم حفظ الأسعار الحالية كأسعار افتراضية بنجاح' : 'Prices saved as defaults successfully');
            } catch (error) {
              console.error('Error saving defaults:', error);
              alert(language === 'ar' ? 'حدث خطأ أثناء حفظ الأسعار' : 'Error saving prices');
            } finally {
              setIsSavingDefaults(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="flex-1 px-4 py-4" edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-2">
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Text className="text-2xl">←</Text>
            </Pressable>
            <Text className="text-2xl font-bold text-foreground">{language === 'ar' ? 'الإعدادات' : 'Settings'}</Text>
            <View className="w-8" />
          </View>

          {/* Prices Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">{language === 'ar' ? 'أسعار الكراتين' : 'Carton Prices'}</Text>

            {/* Red Egg Price */}
            <View>
              <Text className="text-sm font-semibold text-muted mb-1">🔴 {language === 'ar' ? 'سعر كرتونة البيض الأحمر' : 'Red Egg Carton Price'}</Text>
              <TextInput
                value={redPrice}
                onChangeText={setRedPrice}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={colors.muted}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 16,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                  textAlign: 'right',
                }}
              />
            </View>

            {/* White Egg Price */}
            <View>
              <Text className="text-sm font-semibold text-muted mb-1">⚪ {language === 'ar' ? 'سعر كرتونة البيض الأبيض' : 'White Egg Carton Price'}</Text>
              <TextInput
                value={whitePrice}
                onChangeText={setWhitePrice}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={colors.muted}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 16,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                  textAlign: 'right',
                }}
              />
            </View>

            {/* Local Egg Price */}
            <View>
              <Text className="text-sm font-semibold text-muted mb-1">🟤 {language === 'ar' ? 'سعر كرتونة البيض البلدي' : 'Local Egg Carton Price'}</Text>
              <TextInput
                value={localPrice}
                onChangeText={setLocalPrice}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={colors.muted}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 16,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                  textAlign: 'right',
                }}
              />
            </View>
          </View>

          {/* Currency Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">{language === 'ar' ? 'العملة' : 'Currency'}</Text>
            <View>
              <Text className="text-sm font-semibold text-muted mb-1">{language === 'ar' ? 'اسم العملة' : 'Currency Name'}</Text>
              <TextInput
                value={currency}
                onChangeText={setCurrency}
                placeholder={language === 'ar' ? 'جنيه مصري' : 'Egyptian Pound'}
                placeholderTextColor={colors.muted}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 16,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                  textAlign: 'right',
                }}
              />
            </View>
          </View>

          {/* Language Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">{language === 'ar' ? 'اللغة' : 'Language'}</Text>
            <View className="gap-2">
              {getLanguageOptions(language).map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setSelectedLanguage(option.value)}
                  style={({ pressed }) => [
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderWidth: 2,
                      borderColor:
                        selectedLanguage === option.value ? colors.primary : colors.border,
                      borderRadius: 6,
                      backgroundColor:
                        selectedLanguage === option.value ? colors.surface : colors.background,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: selectedLanguage === option.value ? colors.primary : colors.border,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    {selectedLanguage === option.value && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: colors.primary,
                        }}
                      />
                    )}
                  </View>
                  <Text className="text-base font-semibold text-foreground">{option.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Theme Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">{language === 'ar' ? 'المظهر' : 'Theme'}</Text>
            <View className="gap-2">
              {getThemeOptions(language).map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setSelectedTheme(option.value)}
                  style={({ pressed }) => [
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderWidth: 2,
                      borderColor:
                        selectedTheme === option.value ? colors.primary : colors.border,
                      borderRadius: 6,
                      backgroundColor:
                        selectedTheme === option.value ? colors.surface : colors.background,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: selectedTheme === option.value ? colors.primary : colors.border,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    {selectedTheme === option.value && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: colors.primary,
                        }}
                      />
                    )}
                  </View>
                  <Text className="text-base font-semibold text-foreground">{option.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Default Prices Display */}
          <View className="gap-2 p-3 bg-surface rounded-lg border border-border">
            <Text className="text-sm font-bold text-foreground">{language === 'ar' ? 'القيم الافتراضية الحالية:' : 'Current Default Values:'}</Text>
            <Text className="text-xs text-muted">🔴 {language === 'ar' ? 'البيض الأحمر' : 'Red Eggs'}: {customDefaults.red} {language === 'ar' ? 'جنيه' : ''}</Text>
            <Text className="text-xs text-muted">⚪ {language === 'ar' ? 'البيض الأبيض' : 'White Eggs'}: {customDefaults.white} {language === 'ar' ? 'جنيه' : ''}</Text>
            <Text className="text-xs text-muted">🟤 {language === 'ar' ? 'البيض البلدي' : 'Local Eggs'}: {customDefaults.local} {language === 'ar' ? 'جنيه' : ''}</Text>
          </View>

          {/* Buttons */}
          <View className="gap-2 mt-4">
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  alignItems: 'center',
                  opacity: pressed || isSaving ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-base font-bold text-background">
                ✓ {isSaving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSaveAsDefaults}
              disabled={isSavingDefaults}
              style={({ pressed }) => [
                {
                  backgroundColor: '#8B5CF6',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  alignItems: 'center',
                  opacity: pressed || isSavingDefaults ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-base font-bold text-background">
                📋 {isSavingDefaults ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ كأسعار افتراضية' : 'Save as Default Prices')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleRestoreDefaults}
              style={({ pressed }) => [
                {
                  backgroundColor: '#EF4444',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  alignItems: 'center',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-base font-bold text-background">
                ⚠️ {language === 'ar' ? 'استعادة القيم الافتراضية' : 'Restore Default Values'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
