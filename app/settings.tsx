import { ScrollView, Text, View, Pressable, TextInput, I18nManager } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useCalculator } from '@/lib/calculator-context';
import { useThemeContext, type ThemeMode } from '@/lib/theme-provider';
import { useColors } from '@/hooks/use-colors';
import { Prices } from '@/lib/types';

I18nManager.forceRTL(true);

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'فاتح', value: 'light' },
  { label: 'داكن', value: 'dark' },
  { label: 'تلقائي حسب النظام', value: 'system' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { settings, updatePrices, updateCurrency, resetToDefaults } = useCalculator();
  const { themeMode, setThemeMode } = useThemeContext();

  const [redPrice, setRedPrice] = useState(String(settings.prices.red));
  const [whitePrice, setWhitePrice] = useState(String(settings.prices.white));
  const [localPrice, setLocalPrice] = useState(String(settings.prices.local));
  const [currency, setCurrency] = useState(settings.currencyName);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const newPrices: Prices = {
        red: Math.max(0, parseInt(redPrice, 10) || 0),
        white: Math.max(0, parseInt(whitePrice, 10) || 0),
        local: Math.max(0, parseInt(localPrice, 10) || 0),
      };

      await updatePrices(newPrices);
      await updateCurrency(currency || 'جنيه مصري');
      await setThemeMode(selectedTheme);

      // Show success feedback
      alert('تم حفظ الإعدادات بنجاح');
      router.back();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreDefaults = async () => {
    setRedPrice('90');
    setWhitePrice('99');
    setLocalPrice('150');
    setCurrency('جنيه مصري');
    setSelectedTheme('system');
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
            <Text className="text-2xl font-bold text-foreground">الإعدادات</Text>
            <View className="w-8" />
          </View>

          {/* Prices Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">أسعار الكراتين</Text>

            {/* Red Egg Price */}
            <View>
              <Text className="text-sm font-semibold text-muted mb-1">سعر كرتونة البيض الأحمر</Text>
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
              <Text className="text-sm font-semibold text-muted mb-1">سعر كرتونة البيض الأبيض</Text>
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
              <Text className="text-sm font-semibold text-muted mb-1">سعر كرتونة البيض البلدي</Text>
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
            <Text className="text-lg font-bold text-foreground">العملة</Text>
            <View>
              <Text className="text-sm font-semibold text-muted mb-1">اسم العملة</Text>
              <TextInput
                value={currency}
                onChangeText={setCurrency}
                placeholder="جنيه مصري"
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

          {/* Theme Section */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">الثيم</Text>
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
                  <Text className="text-base font-semibold text-foreground">{option.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-2 mt-4">
            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  paddingVertical: 12,
                  opacity: pressed || isSaving ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-base font-bold text-white text-center">
                {isSaving ? 'جاري الحفظ...' : 'حفظ'}
              </Text>
            </Pressable>

            {/* Restore Defaults Button */}
            <Pressable
              onPress={handleRestoreDefaults}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingVertical: 12,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-base font-semibold text-foreground text-center">
                استعادة القيم الافتراضية
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
