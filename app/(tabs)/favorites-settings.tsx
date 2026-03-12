import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, TextInput, StyleSheet, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { FavoriteQuantities } from '@/lib/types';
import { loadFavoriteQuantities, saveFavoriteQuantities, getDefaultFavoriteQuantities } from '@/lib/storage';

interface FavoritesSettingsScreenProps {
  onClose: () => void;
  onSave?: () => void;
}

export default function FavoritesSettingsScreen({ onClose, onSave }: FavoritesSettingsScreenProps) {
  const colors = useColors();
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
      Alert.alert('تنبيه', 'يجب أن يكون هناك عدد واحد على الأقل');
    }
  };

  const handleSave = async () => {
    const validQuantities = quantities
      .map((q) => parseInt(q, 10))
      .filter((q) => !isNaN(q) && q > 0)
      .sort((a, b) => a - b);

    if (validQuantities.length === 0) {
      Alert.alert('خطأ', 'يرجى إدخال أعداد صحيحة موجبة');
      return;
    }

    const favoriteQuantities: FavoriteQuantities = {
      quantities: validQuantities,
    };

    await saveFavoriteQuantities(favoriteQuantities);
    Alert.alert('نجح', 'تم حفظ الأعداد المفضلة');
    onSave?.();
    onClose();
  };

  const handleReset = () => {
    Alert.alert('تأكيد', 'هل تريد إعادة تعيين الأعداد المفضلة إلى الافتراضية؟', [
      { text: 'إلغاء', onPress: () => {} },
      {
        text: 'تأكيد',
        onPress: async () => {
          const defaults = getDefaultFavoriteQuantities();
          setQuantities(defaults.quantities.map(String));
          await saveFavoriteQuantities(defaults);
          Alert.alert('نجح', 'تم إعادة تعيين الأعداد المفضلة');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text style={{ color: colors.foreground }}>جاري التحميل...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1 px-4">
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Text style={[styles.closeBtnText, { color: colors.primary }]}>✕</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>إعدادات الأعداد المفضلة</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: colors.foreground }]}>الأعداد المفضلة:</Text>

        {quantities.map((quantity, index) => (
          <View key={index} style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
                },
              ]}
              placeholder="أدخل العدد"
              placeholderTextColor={colors.muted}
              value={quantity}
              onChangeText={(value) => handleQuantityChange(index, value)}
              keyboardType="number-pad"
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
          <Text style={[styles.addBtnText, { color: colors.background }]}>+ إضافة عدد</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleReset}
          style={[styles.button, { backgroundColor: '#FFA500' }]}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>إعادة تعيين</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>حفظ</Text>
        </Pressable>
        <Pressable
          onPress={onClose}
          style={[styles.button, { backgroundColor: colors.border }]}
        >
          <Text style={[styles.buttonText, { color: colors.foreground }]}>إلغاء</Text>
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  closeBtn: {
    padding: 8,
  },
  closeBtnText: {
    fontSize: 24,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  removeBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },
  addBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  addBtnText: {
    fontSize: 14,
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
    fontSize: 14,
    fontWeight: '600',
  },
});
