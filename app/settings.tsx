import { ScrollView, Text, View, Pressable, TextInput, I18nManager, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useCalculator } from '@/lib/calculator-context';
import { useThemeContext, type ThemeMode } from '@/lib/theme-provider';
import { useColors } from '@/hooks/use-colors';
import { useLanguage } from '@/lib/language-context';
import { Prices } from '@/lib/types';
import { Language } from '@/lib/i18n';

I18nManager.forceRTL(true);

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { settings, customDefaults, updatePrices, updateCurrency, resetToDefaults, saveCurrentAsDefaults } = useCalculator();
  const { themeMode, setThemeMode } = useThemeContext();
  const { language, setLanguage, t } = useLanguage();

  const [redPrice, setRedPrice] = useState(String(settings.prices.red));
  const [whitePrice, setWhitePrice] = useState(String(settings.prices.white));
  const [localPrice, setLocalPrice] = useState(String(settings.prices.local));
  const [currency, setCurrency] = useState(settings.currencyName);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingDefaults, setIsSavingDefaults] = useState(false);

  const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
    { label: t('lightMode'), value: 'light' },
    { label: t('darkMode'), value: 'dark' },
    { label: t('autoSystem'), value: 'system' },
  ];

  const LANGUAGE_OPTIONS: { label: string; value: Language }[] = [
    { label: t('arabic'), value: 'ar' },
    { label: t('english'), value: 'en' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const newPrices: Prices = {
        red: Math.max(0, parseInt(redPrice, 10) || 0),
        white: Math.max(0, parseInt(whitePrice, 10) || 0),
        local: Math.max(0, parseInt(localPrice, 10) || 0),
      };

      await updatePrices(newPrices);
      await updateCurrency(currency || t('egyptianPound'));
      await setThemeMode(selectedTheme);
      await setLanguage(selectedLanguage);

      Alert.alert(t('successTitle'), t('settingsSavedSuccess'));
      router.back();
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert(t('errorTitle'), t('settingsSaveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreDefaults = async () => {
    Alert.alert(
      t('restoreDefaultsBtn'),
      `${t('restoreDefaultsConfirm')}\n\n🔴 ${t('redEgg')}: ${customDefaults.red} ${t('pound')}\n⚪ ${t('whiteEgg')}: ${customDefaults.white} ${t('pound')}\n🟤 ${t('localEgg')}: ${customDefaults.local} ${t('pound')}`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('reset'),
          style: 'destructive',
          onPress: async () => {
            setRedPrice(String(customDefaults.red));
            setWhitePrice(String(customDefaults.white));
            setLocalPrice(String(customDefaults.local));
            setCurrency(t('egyptianPound'));
            setSelectedTheme('system');
            await resetToDefaults();
            Alert.alert(t('successTitle'), t('defaultsRestoredSuccess'));
          },
        },
      ]
    );
  };

  const handleSaveAsDefaults = async () => {
    Alert.alert(
      t('saveAsDefaultsBtn'),
      `${t('saveAsDefaultsConfirm')}\n\n🔴 ${t('redEgg')}: ${redPrice} ${t('pound')}\n⚪ ${t('whiteEgg')}: ${whitePrice} ${t('pound')}\n🟤 ${t('localEgg')}: ${localPrice} ${t('pound')}`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('save'),
          style: 'default',
          onPress: async () => {
            setIsSavingDefaults(true);
            try {
              const newPrices: Prices = {
                red: Math.max(0, parseInt(redPrice, 10) || 0),
                white: Math.max(0, parseInt(whitePrice, 10) || 0),
                local: Math.max(0, parseInt(localPrice, 10) || 0),
              };
              await updatePrices(newPrices);
              await saveCurrentAsDefaults();
              Alert.alert(t('successTitle'), t('pricesSavedAsDefaultsSuccess'));
            } catch (error) {
              console.error('Error saving defaults:', error);
              Alert.alert(t('errorTitle'), t('pricesSaveError'));
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
            <Text className="text-2xl font-bold text-foreground">{t('settings')}</Text>
            <View className="w-8" />
          </View>

          {/* Prices Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">{t('cartonPrices')}</Text>

            {/* Red Egg Price */}
            <View>
              <Text className="text-sm font-semibold text-muted mb-1">{t('redEggPriceLabel')}</Text>
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
                  textAlign: language === 'ar' ? 'right' : 'left',
                }}
              />
            </View>

            {/* White Egg Price */}
            <View>
              <Text className="text-sm font-semibold text-muted mb-1">{t('whiteEggPriceLabel')}</Text>
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
                  textAlign: language === 'ar' ? 'right' : 'left',
                }}
              />
            </View>

            {/* Local Egg Price */}
            <View>
              <Text className="text-sm font-semibold text-muted mb-1">{t('localEggPriceLabel')}</Text>
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
                  textAlign: language === 'ar' ? 'right' : 'left',
                }}
              />
            </View>
          </View>

          {/* Currency Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">{t('currency')}</Text>
            <View>
              <Text className="text-sm font-semibold text-muted mb-1">{t('currencyName')}</Text>
              <TextInput
                value={currency}
                onChangeText={setCurrency}
                placeholder={t('currencyPlaceholder')}
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
                  textAlign: language === 'ar' ? 'right' : 'left',
                }}
              />
            </View>
          </View>

          {/* Language Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">{t('language')}</Text>
            <View className="gap-2">
              {LANGUAGE_OPTIONS.map((option) => (
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
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: selectedLanguage === option.value ? 'bold' : 'normal',
                      color: colors.foreground,
                    }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Theme Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">{t('theme')}</Text>
            <View className="gap-2">
              {THEME_OPTIONS.map((option) => (
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
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: selectedTheme === option.value ? 'bold' : 'normal',
                      color: colors.foreground,
                    }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Default Values Info */}
          <View className="mt-4 p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
            <Text className="text-sm font-bold text-foreground mb-2">{t('currentDefaultValues')}</Text>
            <View className="gap-1">
              <Text className="text-xs text-muted">🔴 {t('redEgg')}: {customDefaults.red} {t('pound')}</Text>
              <Text className="text-xs text-muted">⚪ {t('whiteEgg')}: {customDefaults.white} {t('pound')}</Text>
              <Text className="text-xs text-muted">🟤 {t('localEgg')}: {customDefaults.local} {t('pound')}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 mt-4 mb-8">
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  paddingVertical: 14,
                  borderRadius: 8,
                  alignItems: 'center',
                  opacity: pressed || isSaving ? 0.8 : 1,
                },
              ]}
            >
              <Text style={{ color: colors.background, fontSize: 16, fontWeight: 'bold' }}>
                {isSaving ? t('saving') : t('saveSettingsBtn')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSaveAsDefaults}
              disabled={isSavingDefaults}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  paddingVertical: 14,
                  borderRadius: 8,
                  alignItems: 'center',
                  opacity: pressed || isSavingDefaults ? 0.8 : 1,
                },
              ]}
            >
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: 'bold' }}>
                {isSavingDefaults ? t('saving') : t('saveAsDefaultsBtn')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleRestoreDefaults}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: '#EF4444',
                  paddingVertical: 14,
                  borderRadius: 8,
                  alignItems: 'center',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: 'bold' }}>
                {t('restoreDefaultsBtn')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
