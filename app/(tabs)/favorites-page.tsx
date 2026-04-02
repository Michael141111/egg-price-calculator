import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Image } from 'expo-image';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useCalculator } from '@/lib/calculator-context';
import { FavoriteQuantities } from '@/lib/types';
import { loadFavoriteQuantities } from '@/lib/storage';
import { useLanguage } from '@/lib/language-context';

const getEggTypes = (t: any) => [
  { id: 'red', label: t('eggTypes.red'), image: require('@/assets/images/egg-red.png'), color: '#EF4444' },
  { id: 'white', label: t('eggTypes.white'), image: require('@/assets/images/egg-white.png'), color: '#E5E7EB' },
  { id: 'local', label: t('eggTypes.local'), image: require('@/assets/images/egg-local.png'), color: '#D4A574' },
];

export default function FavoritesPageScreen() {
  const router = useRouter();
  const colors = useColors();
  const { settings } = useCalculator();
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<FavoriteQuantities>({ quantities: [1, 5, 10, 15, 30] });

  // Load favorites when component mounts
  useEffect(() => {
    loadFavoriteQuantities().then(setFavorites);
  }, []);

  // Refresh favorites whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadFavoriteQuantities().then(setFavorites);
    }, [])
  );

  const calculatePrice = (quantity: number, eggType: 'red' | 'white' | 'local') => {
    const cartonPrice = settings.prices[eggType];
    return (cartonPrice / 30 * quantity).toFixed(2);
  };

  return (
    <ScreenContainer className="flex-1 px-4 py-4" edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text className="text-2xl">←</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-foreground">{t('favorites')}</Text>
        <View className="w-8" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Table Header */}
        <View style={[styles.tableHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.headerCell, { color: colors.foreground, flex: 0.6, textAlign: 'center' }]}>العدد</Text>
          {getEggTypes(t).map((type: any) => (
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
              },
            ]}
          >
            <Text style={[styles.cell, { color: colors.foreground, flex: 0.6, textAlign: 'center' }]}>{quantity}</Text>
            {getEggTypes(t).map((type: any) => (
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
          <Text style={[styles.buttonText, { color: colors.background }]}>← رجوع</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
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
    flexDirection: 'row',
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
    color: '#000',
  },
  tableRow: {
    flexDirection: 'row',
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
