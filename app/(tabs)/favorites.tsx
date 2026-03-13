import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { useCalculator } from '@/lib/calculator-context';
import { FavoriteQuantities } from '@/lib/types';
import { loadFavoriteQuantities } from '@/lib/storage';

const EGG_TYPES = [
  { id: 'red', label: 'بيض أحمر', color: '#EF4444' },
  { id: 'white', label: 'بيض أبيض', color: '#E5E7EB' },
  { id: 'local', label: 'بيض بلدي', color: '#D4A574' },
];

interface FavoritesScreenProps {
  onClose: () => void;
}

export default function FavoritesScreen({ onClose }: FavoritesScreenProps) {
  const colors = useColors();
  const { settings } = useCalculator();
  const [favorites, setFavorites] = useState<FavoriteQuantities>({ quantities: [1, 5, 10, 15, 30] });

  useEffect(() => {
    loadFavoriteQuantities().then(setFavorites);
  }, []);

  const calculatePrice = (quantity: number, eggType: 'red' | 'white' | 'local') => {
    const cartonPrice = settings.prices[eggType];
    return (cartonPrice / 30 * quantity).toFixed(2);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Text style={[styles.closeBtnText, { color: colors.primary }]}>✕</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>الأسعار المفضلة</Text>
        <Pressable style={styles.settingsBtn}>
          <Text style={[styles.settingsBtnText, { color: colors.primary }]}>⚙️</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Table Header */}
        <View style={[styles.tableHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.headerCell, { color: colors.foreground, flex: 1 }]}>العدد</Text>
          {EGG_TYPES.map((type) => (
            <Text key={type.id} style={[styles.headerCell, { color: colors.foreground, flex: 1 }]}>
              {type.label}
            </Text>
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
            <Text style={[styles.cell, { color: colors.foreground, flex: 1 }]}>{quantity}</Text>
            {EGG_TYPES.map((type) => (
              <Text key={type.id} style={[styles.cell, { color: colors.foreground, flex: 1 }]}>
                {calculatePrice(quantity, type.id as 'red' | 'white' | 'local')}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Pressable
          onPress={onClose}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>إغلاق</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 8,
  },
  closeBtnText: {
    fontSize: 24,
  },
  settingsBtn: {
    padding: 8,
  },
  settingsBtnText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingVertical: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    marginBottom: 4,
  },
  headerCell: {
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
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
