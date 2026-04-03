import { View, Text, Pressable, StyleSheet, ScrollView, I18nManager, useWindowDimensions } from 'react-native';
import { useEffect, useRef, useState, useMemo } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useCalculator } from '@/lib/calculator-context';
import { useColors } from '@/hooks/use-colors';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/lib/language-context';

// Responsive sizing utility
const getResponsiveSizes = (screenWidth: number) => {
  if (screenWidth < 380) {
    return {
      keypadBtnHeight: 35,
      keypadBtnFontSize: 14,
      keypadGap: 2,
      totalBoxHeight: 50,
      totalFontSize: 24,
      totalLabelSize: 10,
      totalCurrencySize: 9,
      addBtnHeight: 36,
      addBtnFontSize: 11,
      inputHeight: 36,
      inputFontSize: 12,
      changeBoxHeight: 40,
      changeValueSize: 14,
      changeLabelSize: 9,
      containerGap: 2,
    };
  } else if (screenWidth < 480) {
    return {
      keypadBtnHeight: 42,
      keypadBtnFontSize: 16,
      keypadGap: 3,
      totalBoxHeight: 56,
      totalFontSize: 26,
      totalLabelSize: 11,
      totalCurrencySize: 10,
      addBtnHeight: 40,
      addBtnFontSize: 12,
      inputHeight: 40,
      inputFontSize: 13,
      changeBoxHeight: 44,
      changeValueSize: 16,
      changeLabelSize: 10,
      containerGap: 3,
    };
  } else {
    return {
      keypadBtnHeight: 50,
      keypadBtnFontSize: 18,
      keypadGap: 4,
      totalBoxHeight: 64,
      totalFontSize: 32,
      totalLabelSize: 12,
      totalCurrencySize: 11,
      addBtnHeight: 44,
      addBtnFontSize: 13,
      inputHeight: 44,
      inputFontSize: 14,
      changeBoxHeight: 50,
      changeValueSize: 18,
      changeLabelSize: 11,
      containerGap: 4,
    };
  }
};

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { width } = useWindowDimensions();
  const sizes = getResponsiveSizes(width);
  const { language, t } = useLanguage();
  const eggCountFieldRef = useRef<View>(null);
  const [showCart, setShowCart] = useState(false);
  const [cartAmountPaid, setCartAmountPaid] = useState('');
  const {
    state,
    settings,
    selectEgg,
    addDigit,
    clearField,
    clearAll,
    setActiveField,
    toggleCalculationMode,
    addToCart,
    clearCart,
    isLoading,
  } = useCalculator();

  const EGG_TYPES = useMemo(() => [
    { id: 'red', label: t('redEgg'), image: require('@/assets/images/egg-red.png'), color: '#DC2626' },
    { id: 'white', label: t('whiteEgg'), image: require('@/assets/images/egg-white.png'), color: '#3B82F6' },
    { id: 'local', label: t('localEgg'), image: require('@/assets/images/egg-local.png'), color: '#D97706' },
  ], [t]);

  useEffect(() => {
    I18nManager.forceRTL(language === 'ar');
  }, [language]);

  const selectedEggData = EGG_TYPES.find((egg) => egg.id === state.selectedEgg);
  const cartonPrice = selectedEggData
    ? settings.prices[state.selectedEgg as keyof typeof settings.prices]
    : 0;
  const eggPrice = cartonPrice > 0 ? cartonPrice / 30 : 0;

  let eggCount = 0;
  let total = 0;
  let amountPaid = 0;
  let change = 0;
  let eggsReceived = 0;
  let remainder = 0;

  if (state.calculationMode === 'byCount') {
    eggCount = parseInt(state.eggCount, 10) || 0;
    total = eggCount * eggPrice;
    amountPaid = parseFloat(state.amountPaid) || 0;
    change = amountPaid - total;
  } else {
    const amount = parseFloat(state.amountPaid) || 0;
    eggsReceived = Math.floor(amount / eggPrice);
    remainder = amount - (eggsReceived * eggPrice);
  }

  const cartTotal = state.cart.reduce((sum, item) => sum + (item.quantity * (item.price / 30)), 0);
  const cartAmountPaidNum = parseFloat(cartAmountPaid) || 0;
  const cartChange = cartAmountPaidNum - cartTotal;

  if (isLoading) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-foreground">{t('loading')}</Text>
      </ScreenContainer>
    );
  }

  const textAlign = language === 'ar' ? 'right' : 'left';
  const flexDirection = language === 'ar' ? 'row-reverse' : 'row';

  return (
    <View style={{ flex: 1 }}>
      <ScreenContainer className="flex-1 px-1" edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView style={[styles.container, { gap: sizes.containerGap }]} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable onPress={() => router.push('/(tabs)/favorites-page')} style={styles.settingsBtn}><Text style={styles.settingsIcon}>⭐</Text></Pressable>
            <Pressable onPress={() => router.push('/(tabs)/favorites-settings-page')} style={styles.settingsBtn}><Text style={styles.settingsIcon}>⚙️</Text></Pressable>
            <Pressable onPress={() => router.push('/(tabs)/settings')} style={styles.settingsBtn}><Text style={styles.settingsIcon}>🔧</Text></Pressable>
            <Pressable onPress={() => router.push('/(tabs)/analytics-page')} style={styles.settingsBtn}><Text style={styles.settingsIcon}>📊</Text></Pressable>
          </View>
          <View style={styles.headerRight}>
            <Pressable
              onPress={() => { toggleCalculationMode(); clearAll(); }}
              style={[styles.modeToggleBtn, { backgroundColor: state.calculationMode === 'byAmount' ? colors.primary : colors.surface }]}
            >
              <Text style={styles.modeToggleIcon}>{state.calculationMode === 'byCount' ? '💰' : '🥚'}</Text>
            </Pressable>
            {state.cart.length > 0 && (
              <Pressable onPress={() => setShowCart(!showCart)} style={[styles.cartBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.cartBadgeText}>{state.cart.length}</Text>
              </Pressable>
            )}
          </View>
        </View>

        {showCart && state.cart.length > 0 && (
          <View style={styles.cartViewContainer}>
            <View style={[styles.cartItemsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text className="text-foreground font-bold" style={[styles.cartViewTitle, { textAlign }]}>{t('cartTitle')}</Text>
              <ScrollView style={styles.cartItemsList}>
                {state.cart.map((item, index) => {
                  const eggLabel = EGG_TYPES.find(e => e.id === item.eggType)?.label || '';
                  const itemTotal = item.quantity * (item.price / 30);
                  return (
                    <View key={index} style={[styles.cartItemRow, { borderBottomColor: colors.border, flexDirection }]}>
                      <View style={styles.cartItemLeft}><Text className="text-foreground font-semibold" style={styles.cartItemLabel}>{eggLabel}</Text></View>
                      <View style={[styles.cartItemMiddle, { flexDirection }]}><Text className="text-foreground font-semibold" style={styles.cartItemQtyLabel}>{t('quantityLabel')}</Text><Text className="text-foreground font-bold" style={styles.cartItemQty}>{item.quantity}</Text></View>
                      <View style={[styles.cartItemRight, { flexDirection }]}><Text className="text-muted" style={styles.cartItemPriceLabel}>{t('priceLabel')}</Text><Text className="text-foreground font-semibold" style={styles.cartItemPrice}>{itemTotal.toFixed(2)}</Text></View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
            <View style={[styles.totalBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.totalLabel}>{t('total')}</Text>
              <Text style={styles.totalValue} numberOfLines={1} adjustsFontSizeToFit>{cartTotal.toFixed(2)}</Text>
              <Text style={styles.totalCurrency}>{settings.currencyName}</Text>
            </View>
            <View style={styles.cartInputWrapper}>
              <Text className="text-muted font-semibold" style={[styles.cartInputLabel, { textAlign }]}>{t('paidAmount')}</Text>
              <Pressable style={[styles.cartInputField, { borderColor: colors.primary, backgroundColor: colors.surface }]}>
                <Text className="font-bold text-foreground" style={[styles.cartInputText, { textAlign }]}>{cartAmountPaid || '0'}</Text>
              </Pressable>
            </View>
            <View style={[styles.changeBox, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection }]}>
              <View style={styles.changeItem}>
                <Text style={[styles.changeLabel, { color: colors.muted }]}>{cartChange < 0 ? t('remainingForCustomer') : t('remainder')}</Text>
                <Text style={[styles.changeValue, { color: cartChange < 0 ? '#EF4444' : colors.primary }]}>{Math.abs(cartChange).toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.cartActions}>
              <Pressable onPress={() => { clearCart(); setShowCart(false); }} style={[styles.clearCartBtn, { borderColor: '#EF4444' }]}><Text style={styles.clearCartBtnText}>{t('clearAll')}</Text></Pressable>
              <Pressable onPress={() => setShowCart(false)} style={[styles.closeCartBtn, { backgroundColor: colors.primary }]}><Text style={styles.closeCartBtnText}>{t('close')}</Text></Pressable>
            </View>
          </View>
        )}

        {!showCart && (
          <>
            <View style={styles.eggTypeGrid}>
              {EGG_TYPES.map((egg) => (
                <Pressable
                  key={egg.id}
                  onPress={() => selectEgg(egg.id)}
                  style={[styles.eggCard, { backgroundColor: state.selectedEgg === egg.id ? colors.primary : colors.surface, borderColor: colors.border }]}
                >
                  <Image source={egg.image} style={styles.eggImage} contentFit="contain" />
                  <Text style={[styles.eggLabel, { color: state.selectedEgg === egg.id ? colors.background : colors.foreground }]}>{egg.label}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.mainContent}>
              <View style={styles.inputSection}>
                <View style={styles.inputRow}>
                  <View style={styles.inputWrapper}>
                    <Text style={[styles.inputLabel, { color: colors.muted, textAlign }]}>{state.calculationMode === 'byCount' ? t('eggCount') : t('requiredAmount')}</Text>
                    <Pressable
                      onPress={() => setActiveField(state.calculationMode === 'byCount' ? 'eggCount' : 'amountPaid')}
                      style={[styles.inputField, { borderColor: state.activeField === (state.calculationMode === 'byCount' ? 'eggCount' : 'amountPaid') ? colors.primary : colors.border, backgroundColor: colors.surface }]}
                    >
                      <Text style={[styles.inputText, { color: colors.foreground, textAlign }]}>{state.calculationMode === 'byCount' ? (state.eggCount || '0') : (state.amountPaid || '0')}</Text>
                    </Pressable>
                  </View>
                  {state.calculationMode === 'byCount' && (
                    <View style={styles.inputWrapper}>
                      <Text style={[styles.inputLabel, { color: colors.muted, textAlign }]}>{t('paidAmount')}</Text>
                      <Pressable
                        onPress={() => setActiveField('amountPaid')}
                        style={[styles.inputField, { borderColor: state.activeField === 'amountPaid' ? colors.primary : colors.border, backgroundColor: colors.surface }]}
                      >
                        <Text style={[styles.inputText, { color: colors.foreground, textAlign }]}>{state.amountPaid || '0'}</Text>
                      </Pressable>
                    </View>
                  )}
                </View>

                <View style={styles.priceInfoRow}>
                  <Pressable onPress={() => addToCart(parseInt(state.eggCount, 10) || 0, cartonPrice)} style={[styles.addBtn, { backgroundColor: colors.primary }]}><Text style={styles.addBtnText}>{t('addProduct')}</Text></Pressable>
                  <View style={styles.priceItem}><Text style={styles.priceLabel}>{t('cartonPriceLabel')}</Text><Text style={[styles.priceValue, { color: colors.foreground }]}>{cartonPrice.toFixed(2)}</Text></View>
                  <View style={styles.priceItem}><Text style={styles.priceLabel}>{t('pricePerEggLabel')}</Text><Text style={[styles.priceValue, { color: colors.foreground }]}>{eggPrice.toFixed(2)}</Text></View>
                </View>
              </View>

              <View style={[styles.totalBox, { backgroundColor: colors.primary, height: sizes.totalBoxHeight }]}>
                <Text style={[styles.totalLabel, { fontSize: sizes.totalLabelSize }]}>{t('total')}</Text>
                <Text style={[styles.totalValue, { fontSize: sizes.totalFontSize }]} numberOfLines={1} adjustsFontSizeToFit>{state.calculationMode === 'byCount' ? total.toFixed(2) : eggsReceived}</Text>
                <Text style={[styles.totalCurrency, { fontSize: sizes.totalCurrencySize }]}>{state.calculationMode === 'byCount' ? settings.currencyName : t('eggCountLabel')}</Text>
              </View>

              <View style={[styles.changeBox, { backgroundColor: colors.surface, borderColor: colors.border, height: sizes.changeBoxHeight, flexDirection }]}>
                <View style={styles.changeItem}>
                  <Text style={[styles.changeLabel, { color: colors.muted, fontSize: sizes.changeLabelSize }]}>{state.calculationMode === 'byCount' ? (change < 0 ? t('remainingForCustomer') : t('remainder')) : t('remainder')}</Text>
                  <Text style={[styles.changeValue, { color: state.calculationMode === 'byCount' && change < 0 ? '#EF4444' : colors.primary, fontSize: sizes.changeValueSize }]}>{state.calculationMode === 'byCount' ? Math.abs(change).toFixed(2) : remainder.toFixed(2)}</Text>
                </View>
              </View>

              <View style={[styles.keypad, { gap: sizes.keypadGap }]}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                  <Pressable key={num} onPress={() => { if (showCart) { setCartAmountPaid(prev => prev + num); } else { addDigit(String(num)); } }} style={[styles.keypadBtn, { backgroundColor: colors.surface, borderColor: colors.border, height: sizes.keypadBtnHeight }]}><Text style={[styles.keypadText, { color: colors.foreground, fontSize: sizes.keypadBtnFontSize }]}>{num}</Text></Pressable>
                ))}
                <Pressable onPress={() => { if (showCart) { setCartAmountPaid(''); } else { clearField(); } }} style={[styles.keypadBtn, { backgroundColor: '#EF4444', borderColor: '#EF4444', height: sizes.keypadBtnHeight, width: '65.5%' }]}><Text style={[styles.keypadText, { color: '#FFFFFF', fontWeight: 'bold', fontSize: sizes.keypadBtnFontSize }]}>{t('clear')}</Text></Pressable>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingsBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center' },
  settingsIcon: { fontSize: 18 },
  modeToggleBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  modeToggleIcon: { fontSize: 18 },
  cartBadge: { position: 'absolute', top: -5, right: -5, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fff' },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  eggTypeGrid: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  eggCard: { flex: 1, borderRadius: 12, padding: 8, alignItems: 'center', borderWidth: 1 },
  eggImage: { width: 40, height: 40, marginBottom: 4 },
  eggLabel: { fontSize: 12, fontWeight: 'bold' },
  mainContent: { flex: 1, gap: 8 },
  inputSection: { gap: 8 },
  inputRow: { flexDirection: 'row', gap: 8 },
  inputWrapper: { flex: 1, gap: 4 },
  inputLabel: { fontSize: 12, fontWeight: '600' },
  inputField: { height: 44, borderRadius: 8, borderWidth: 2, justifyContent: 'center', paddingHorizontal: 12 },
  inputText: { fontSize: 18, fontWeight: 'bold' },
  priceInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 4 },
  addBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  priceItem: { flex: 1, alignItems: 'center' },
  priceLabel: { fontSize: 10, color: '#888' },
  priceValue: { fontSize: 14, fontWeight: 'bold' },
  totalBox: { borderRadius: 12, padding: 8, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  totalLabel: { color: 'rgba(255,255,255,0.8)', fontWeight: '600', position: 'absolute', top: 4, right: 12 },
  totalValue: { color: '#fff', fontWeight: '900' },
  totalCurrency: { color: 'rgba(255,255,255,0.8)', fontWeight: '600', position: 'absolute', bottom: 4, left: 12 },
  changeBox: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, justifyContent: 'center' },
  changeItem: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  changeLabel: { fontWeight: '600' },
  changeValue: { fontWeight: 'bold' },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'center' },
  keypadBtn: { width: '32%', borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  keypadText: { fontWeight: '600' },
  cartViewContainer: { flex: 1, gap: 12 },
  cartViewTitle: { fontSize: 18, marginBottom: 8 },
  cartItemsContainer: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12 },
  cartItemsList: { flex: 1 },
  cartItemRow: { paddingVertical: 8, borderBottomWidth: 1, alignItems: 'center' },
  cartItemLeft: { flex: 1.5 },
  cartItemMiddle: { flex: 1.5, alignItems: 'center', gap: 4 },
  cartItemRight: { flex: 1.5, alignItems: 'flex-end' },
  cartItemLabel: { fontSize: 14 },
  cartItemQtyLabel: { fontSize: 12 },
  cartItemQty: { fontSize: 14 },
  cartItemPriceLabel: { fontSize: 10 },
  cartItemPrice: { fontSize: 14 },
  cartInputWrapper: { gap: 4 },
  cartInputLabel: { fontSize: 14 },
  cartInputField: { height: 50, borderRadius: 8, borderWidth: 2, justifyContent: 'center', paddingHorizontal: 16 },
  cartInputText: { fontSize: 20 },
  cartActions: { flexDirection: 'row', gap: 12 },
  clearCartBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  clearCartBtnText: { color: '#EF4444', fontWeight: 'bold' },
  closeCartBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  closeCartBtnText: { color: '#fff', fontWeight: 'bold' }
});
