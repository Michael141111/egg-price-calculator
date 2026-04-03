import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, TextInput, StyleSheet, Alert, I18nManager } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { loadFavoriteQuantities, saveFavoriteQuantities, getDefaultFavoriteQuantities } from '@/lib/storage';
import { useLanguage } from '@/lib/language-context';

export default function FavoritesSettingsPageScreen() {
  const router = useRouter();
  const colors = useColors();
  const { language, t } = useLanguage();
  const [quantities, setQuantities] = useState<string[]>(['1', '5', '10', '15', '30']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavoriteQuantities().then((fav) => {
      setQuantities(fav.quantities.map(String));
      setLoading(false);
    });
  }, []);

  const handleQuantityChange = (index: number, value: string) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
  };

  const handleAddQuantity = () => {
    setQuantities([...quantities, '']);
  };

  const handleRemoveQuantity = (index: number) => {
    if (quantities.length > 1) {
      setQuantities(quantities.filter((_, i) => i !== index));
    } else {
      Alert.alert(t('alertTitle'), t('minQuantityAlert'));
    }
  };

  const handleSave = async () => {
    const validQuantities = quantities
      .map((q) => parseInt(q, 10))
      .filter((q) => !isNaN(q) && q > 0)
      .sort((a, b) => a - b);

    if (validQuantities.length === 0) {
      Alert.alert(t('errorTitle'), t('invalidQuantityError'));
      return;
    }

    await saveFavoriteQuantities({ quantities: validQuantities });
    Alert.alert(t('successTitle'), t('success'));
    router.back();
  };

  const handleResetToDefaults = async () => {
    Alert.alert(
      t('reset'),
      t('resetFavoritesConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('reset'),
          style: 'destructive',
          onPress: async () => {
            const defaults = await getDefaultFavoriteQuantities();
            setQuantities(defaults.quantities.map(String));
            await saveFavoriteQuantities(defaults);
            Alert.alert(t('successTitle'), t('favoritesResetSuccess'));
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text className="text-foreground">{t('loading')}</Text>
      </ScreenContainer>
    );
  }

  const flexDirection = language === 'ar' ? 'row-reverse' : 'row';
  const textAlign = language === 'ar' ? 'right' : 'left';

  return (
    <ScreenContainer className="flex-1 px-4 py-4" edges={['top', 'left', 'right']}>
      <View style={[styles.header, { flexDirection }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text className="text-2xl">{language === 'ar' ? '→' : '←'}</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-foreground">{t('favoriteCountsSettings')}</Text>
        <View className="w-8" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.label, { color: colors.foreground, textAlign }]}>{t('favoriteCountsLabel')}</Text>

        {quantities.map((quantity, index) => (
          <View key={index} style={[styles.quantityRow, { flexDirection }]}>
            <TextInput
              value={quantity}
              onChangeText={(value) => handleQuantityChange(index, value)}
              keyboardType="number-pad"
              placeholder={t('enterCountPlaceholder')}
              placeholderTextColor={colors.muted}
              style={[
                styles.quantityInput,
                {
                  borderColor: colors.border,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                  textAlign: 'center',
                },
              ]}
            />
            <Pressable
              onPress={() => handleRemoveQuantity(index)}
              style={[styles.removeBtn, { backgroundColor: '#EF4444' }]}
            >
              <Text style={styles.removeBtnText}>−</Text>
            </Pressable>
          </View>
        ))}

        <Pressable
          onPress={handleAddQuantity}
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.addBtnText, { color: colors.background }]}>{t('addCountBtn')}</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleSave}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>{t('save')}</Text>
        </Pressable>
        <Pressable
          onPress={handleResetToDefaults}
          style={[styles.button, { backgroundColor: '#8B5CF6' }]}
        >
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>{t('reset')}</Text>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          style={[styles.button, { backgroundColor: colors.border }]}
        >
          <Text style={[styles.buttonText, { color: colors.foreground }]}>{t('cancel')}</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
  },
  content: {
    flexGrow: 1,
    paddingVertical: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quantityRow: {
    gap: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  quantityInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  removeBtn: {
    width: 40,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 12,
    gap: 8,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
