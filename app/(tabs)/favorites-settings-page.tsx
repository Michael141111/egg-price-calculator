import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, TextInput, StyleSheet, Alert, I18nManager } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { loadFavoriteQuantities, saveFavoriteQuantities, getDefaultFavoriteQuantities } from '@/lib/storage';

I18nManager.forceRTL(true);

export default function FavoritesSettingsPageScreen() {
  const router = useRouter();
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

    await saveFavoriteQuantities({ quantities: validQuantities });
    Alert.alert('نجح', 'تم حفظ الأعداد المفضلة بنجاح');
    router.back();
  };

  const handleResetToDefaults = async () => {
    Alert.alert(
      'إعادة تعيين',
      'هل تريد إعادة تعيين الأعداد المفضلة إلى القيم الافتراضية؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'إعادة تعيين',
          style: 'destructive',
          onPress: async () => {
            const defaults = await getDefaultFavoriteQuantities();
            setQuantities(defaults.quantities.map(String));
            await saveFavoriteQuantities(defaults);
            Alert.alert('نجح', 'تم إعادة تعيين الأعداد المفضلة');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text className="text-foreground">جاري التحميل...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1 px-4 py-4" edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text className="text-2xl">←</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-foreground">إعدادات الأعداد المفضلة</Text>
        <View className="w-8" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-bold text-foreground mb-4">الأعداد المفضلة:</Text>

        {quantities.map((quantity, index) => (
          <View key={index} style={styles.quantityRow}>
            <TextInput
              value={quantity}
              onChangeText={(value) => handleQuantityChange(index, value)}
              keyboardType="number-pad"
              placeholder="أدخل العدد"
              placeholderTextColor={colors.muted}
              style={[
                styles.quantityInput,
                {
                  borderColor: colors.border,
                  color: colors.foreground,
                  backgroundColor: colors.surface,
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
          <Text style={[styles.addBtnText, { color: colors.background }]}>+ إضافة عدد</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleSave}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>✓ حفظ</Text>
        </Pressable>
        <Pressable
          onPress={handleResetToDefaults}
          style={[styles.button, { backgroundColor: '#8B5CF6' }]}
        >
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>↻ إعادة تعيين</Text>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          style={[styles.button, { backgroundColor: colors.border }]}
        >
          <Text style={[styles.buttonText, { color: colors.foreground }]}>← إلغاء</Text>
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
  quantityRow: {
    flexDirection: 'row',
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
    textAlign: 'center',
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
