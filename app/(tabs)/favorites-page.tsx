import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, Text, View, Pressable, StyleSheet, I18nManager } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Image } from 'expo-image';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useCalculator } from '@/lib/calculator-context';
import { FavoriteQuantities } from '@/lib/types';
import { loadFavoriteQuantities } from '@/lib/storage';
import { useLanguage } from '@/lib/language-context';

export default function FavoritesPageScreen() {
  const router = useRouter();
  const colors = useColors();
  const { settings } = useCalculator();
  const { language, t } = useLanguage();
  const [favorites, setFavorites] = useState<FavoriteQuantities>({ quantities: [1, 5, 10, 15, 30] });

  const EGG_TYPES = useMemo(() => [
    { id: 'red', label: t('redEgg'), image: require('@/assets/images/egg-red.png'), color: '#EF4444' },
    { id: 'white', label: t('whiteEgg'), image: require('@/assets/images/egg-white.png'), color: '#E5E7EB' },
    { id: 'local', label: t('localEgg'), image: require('@/assets/images/egg-local.png'), color: '#D4A574' },
  ], [t]);

  useEffect(() => {
    loadFavoriteQuantities().then(setFavorites);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadFavoriteQuantities().then(setFavorites);
    }, [])
  );

  const calculatePrice = (quantity: number, eggType: 'red' | 'white' | 'local') => {
    const cartonPrice = settings.prices[eggType];
    return (cartonPrice / 30 * quantity).toFixed(2);
  };

  const flexDirection = language === 'ar' ? 'row-reverse' : 'row';

  return (
    <ScreenContainer className="flex-1 px-4 py-4" edges={['top', 'left', 'right']}>
      <View style={[styles.header, { flexDirection }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text className="text-2xl">{language === 'ar' ? '→' : '←'}</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-foreground">{t('favorites')}</Text>
        <View className="w-8" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Table Header */}
        <View style={[styles.tableHeader, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection }]}>
          <Text style={[styles.headerCell, { color: colors.foreground, flex: 0.6, textAlign: 'center' }]}>{t('count')}</Text>
          {EGG_TYPES.map((type) => (
            <View key={type.id} style={[styles.headerCellProduct, { flex: 1 }]}>
              <Image
                source={type.image}
                style={styles.headerImage}
                contentFit="contain"
              />
              <Text style={[styles.headerLabel, { color: colors.foreground }]}>
                {type.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Table Rows */}
        {favorites.quantities.map((quantity, index) => (
          <View
            key={quantity}
            style={[
              styles.tableRow,
              {
                backgroundColor: index % 2 === 0 ? colors.background : colors.surface,
                borderColor: colors.border,
                flexDirection,
              },
            ]}
          >
            <Text style={[styles.cell, { color: colors.foreground, flex: 0.6, textAlign: 'center' }]}>{quantity}</Text>
            {EGG_TYPES.map((type) => (
              <Text key={type.id} style={[styles.cell, { color: colors.foreground, flex: 1, textAlign: 'center' }]}>
                {calculatePrice(quantity, type.id as 'red' | 'white' | 'local')}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>{t('back')}</Text>
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
  tableHeader: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  headerCell: {
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  headerCellProduct: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
  tableRow: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cell: {
    fontSize: 13,
    textAlign: 'center',
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
