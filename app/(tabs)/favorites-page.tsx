import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Image } from 'expo-image';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useCalculator } from '@/lib/calculator-context';
import { FavoriteQuantities } from '@/lib/types';
import { loadFavoriteQuantities } from '@/lib/storage';

const EGG_TYPES = [
  { id: 'red', label: 'بيض أحمر', image: require('@/assets/images/egg-red.png'), color: '#DC2626' },
  { id: 'white', label: 'بيض أبيض', image: require('@/assets/images/egg-white.png'), color: '#3B82F6' },
  { id: 'local', label: 'بيض بلدي', image: require('@/assets/images/egg-local.png'), color: '#D97706' },
];

export default function FavoritesPageScreen() {
  const router = useRouter();
  const colors = useColors();
  const { settings } = useCalculator();
  const [favorites, setFavorites] = useState<FavoriteQuantities>({ quantities: [1, 5, 10, 15, 30] });
  const { width } = Dimensions.get('window');

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

  // Responsive card width
  const cardWidth = width < 380 ? (width - 24) / 2 : (width - 32) / 3;

  return (
    <ScreenContainer className="flex-1 px-4 py-4" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text className="text-2xl">←</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-foreground">الأسعار المفضلة</Text>
        <View className="w-8" />
      </View>

      {/* Product Cards */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.cardsContainer, { gap: width < 380 ? 8 : 12 }]}>
          {EGG_TYPES.map((egg) => (
            <View
              key={egg.id}
              style={[
                styles.card,
                {
                  width: cardWidth,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Card Header - Image and Name */}
              <View style={styles.cardHeader}>
                <Image
                  source={egg.image}
                  style={styles.eggImage}
                  contentFit="contain"
                />
                <Text
                  className="text-foreground text-center font-semibold"
                  style={styles.cardLabel}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                >
                  {egg.label}
                </Text>
              </View>

              {/* Prices Table */}
              <View style={[styles.pricesTable, { borderTopColor: colors.border }]}>
                {favorites.quantities.map((quantity, index) => (
                  <View
                    key={quantity}
                    style={[
                      styles.priceRow,
                      {
                        borderTopColor: colors.border,
                        borderTopWidth: index > 0 ? 1 : 0,
                      },
                    ]}
                  >
                    <Text style={[styles.quantityLabel, { color: colors.muted }]}>
                      {quantity}
                    </Text>
                    <Text style={[styles.priceValue, { color: colors.foreground }]}>
                      {calculatePrice(quantity, egg.id as 'red' | 'white' | 'local')}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
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
    paddingVertical: 8,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 8,
  },
  cardHeader: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  eggImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  pricesTable: {
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quantityLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 13,
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
