import { View, Text, Pressable, StyleSheet, ScrollView, I18nManager } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useCalculator } from '@/lib/calculator-context';
import { useThemeContext } from '@/lib/theme-provider';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

// Set RTL for Arabic
I18nManager.forceRTL(true);

const EGG_TYPES = [
  { id: 'red', label: 'بيض أحمر', image: require('@/assets/images/egg-red.png'), color: '#DC2626' },
  { id: 'white', label: 'بيض أبيض', image: require('@/assets/images/egg-white.png'), color: '#3B82F6' },
  { id: 'local', label: 'بيض بلدي', image: require('@/assets/images/egg-local.png'), color: '#D97706' },
];

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { themeMode } = useThemeContext();
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

  // Auto-focus on egg count when activeField changes to eggCount
  useEffect(() => {
    if (state.activeField === 'eggCount' && eggCountFieldRef.current) {
      // Focus is already set by the context
    }
  }, [state.activeField]);

  // Calculate values
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
    // Mode 1: Input egg count, calculate total and change
    eggCount = parseInt(state.eggCount, 10) || 0;
    total = eggCount * eggPrice;
    amountPaid = parseFloat(state.amountPaid) || 0;
    change = amountPaid - total;
  } else {
    // Mode 2: Input amount, calculate egg count and remainder
    const amount = parseFloat(state.amountPaid) || 0;
    eggsReceived = Math.floor(amount / eggPrice);
    remainder = amount - (eggsReceived * eggPrice);
  }

  // Calculate cart totals
  const cartTotal = state.cart.reduce((sum, item) => sum + (item.quantity * (item.price / 30)), 0);
  const cartTotalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate change for cart view
  const cartAmountPaidNum = parseFloat(cartAmountPaid) || 0;
  const cartChange = cartAmountPaidNum - cartTotal;

  if (isLoading) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-foreground">جاري التحميل...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1 px-2" edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header - fixed height */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.push('/settings')}
            style={({ pressed }) => [styles.settingsBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
          <Text className="text-base font-bold text-foreground">آلة أسعار البيض</Text>
          <View style={styles.headerRight}>
            <Pressable
              onPress={toggleCalculationMode}
              style={({ pressed }) => [
                styles.modeToggleBtn,
                {
                  backgroundColor: state.calculationMode === 'byAmount' ? colors.primary : colors.surface,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={styles.modeToggleIcon}>
                {state.calculationMode === 'byCount' ? '💰' : '🥚'}
              </Text>
            </Pressable>
            {state.cart.length > 0 && (
              <Pressable
                onPress={() => setShowCart(!showCart)}
                style={({ pressed }) => [styles.cartBadge, { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={styles.cartBadgeText}>{state.cart.length}</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* CART VIEW - Full screen replacement */}
        {showCart && state.cart.length > 0 ? (
          <View style={styles.cartViewContainer}>
            {/* Cart Items List */}
            <View style={[styles.cartItemsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text className="text-foreground font-bold" style={styles.cartViewTitle}>قائمة المشتريات</Text>
              <ScrollView style={styles.cartItemsList}>
                {state.cart.map((item, index) => {
                  const eggLabel = EGG_TYPES.find(e => e.id === item.eggType)?.label || '';
                  const itemTotal = item.quantity * (item.price / 30);
                  return (
                    <View key={index} style={[styles.cartItemRow, { borderBottomColor: colors.border }]}>
                      <View style={styles.cartItemLeft}>
                        <Text className="text-foreground font-semibold" style={styles.cartItemLabel}>
                          {eggLabel}
                        </Text>
                      </View>
                      <View style={styles.cartItemMiddle}>
                        <Text className="text-foreground font-semibold" style={styles.cartItemQtyLabel}>
                          الكمية:
                        </Text>
                        <Text className="text-foreground font-bold" style={styles.cartItemQty}>
                          {item.quantity}
                        </Text>
                      </View>
                      <View style={styles.cartItemRight}>
                        <Text className="text-muted" style={styles.cartItemPriceLabel}>
                          السعر:
                        </Text>
                        <Text className="text-foreground font-semibold" style={styles.cartItemPrice}>
                          {itemTotal.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            {/* Cart Total */}
            <View style={[styles.totalBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.totalLabel}>الإجمالي</Text>
              <Text style={styles.totalValue} numberOfLines={1} adjustsFontSizeToFit>
                {cartTotal.toFixed(2)}
              </Text>
              <Text style={styles.totalCurrency}>{settings.currencyName}</Text>
            </View>

            {/* Amount Paid Input */}
            <View style={styles.cartInputWrapper}>
              <Text className="text-muted font-semibold" style={styles.cartInputLabel}>
                المبلغ المدفوع
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.cartInputField,
                  {
                    borderColor: colors.primary,
                    backgroundColor: colors.surface,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="font-bold text-foreground" style={styles.cartInputText}>
                  {cartAmountPaid || '0'}
                </Text>
              </Pressable>
            </View>

            {/* Change Display */}
            <View style={[styles.cartChangeBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text className="text-muted" style={styles.cartChangeLabel}>
                {cartChange < 0 ? 'المتبقي على العميل' : 'الباقي'}
              </Text>
              <Text
                style={[
                  styles.cartChangeValue,
                  { color: cartChange < 0 ? '#EF4444' : '#22C55E' },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {Math.abs(cartChange).toFixed(2)}
              </Text>
              <Text className="text-muted" style={styles.cartChangeCurrency}>{settings.currencyName}</Text>
            </View>

            {/* Keypad for cart amount input */}
            <View style={styles.keypad}>
              {/* Row 1: 7, 8, 9 */}
              <View style={styles.keypadRow}>
                {['7', '8', '9'].map((num) => (
                  <Pressable
                    key={num}
                    onPress={() => setCartAmountPaid(cartAmountPaid + num)}
                    style={({ pressed }) => [
                      styles.keypadBtn,
                      { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <Text className="font-bold text-foreground" style={styles.keypadText}>{num}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Row 2: 4, 5, 6 */}
              <View style={styles.keypadRow}>
                {['4', '5', '6'].map((num) => (
                  <Pressable
                    key={num}
                    onPress={() => setCartAmountPaid(cartAmountPaid + num)}
                    style={({ pressed }) => [
                      styles.keypadBtn,
                      { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <Text className="font-bold text-foreground" style={styles.keypadText}>{num}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Row 3: 1, 2, 3 */}
              <View style={styles.keypadRow}>
                {['1', '2', '3'].map((num) => (
                  <Pressable
                    key={num}
                    onPress={() => setCartAmountPaid(cartAmountPaid + num)}
                    style={({ pressed }) => [
                      styles.keypadBtn,
                      { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <Text className="font-bold text-foreground" style={styles.keypadText}>{num}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Row 4: 0, AC */}
              <View style={styles.keypadRow}>
                <Pressable
                  onPress={() => setCartAmountPaid(cartAmountPaid + '0')}
                  style={({ pressed }) => [
                    styles.keypadBtn,
                    { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text className="font-bold text-foreground" style={styles.keypadText}>0</Text>
                </Pressable>
                <Pressable
                  onPress={() => setCartAmountPaid('')}
                  style={({ pressed }) => [
                    styles.keypadBtn,
                    { backgroundColor: '#EF4444', opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text style={[styles.keypadText, { color: '#FFFFFF', fontWeight: 'bold' }]}>AC</Text>
                </Pressable>
              </View>
            </View>

            {/* Clear Cart Button */}
            <Pressable
              onPress={() => {
                clearCart();
                setShowCart(false);
                setCartAmountPaid('');
              }}
              style={({ pressed }) => [
                styles.clearCartBtnFull,
                { backgroundColor: '#EF4444', opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.clearCartBtnText}>تصفير الشاشة</Text>
            </Pressable>
          </View>
        ) : (
          /* MAIN VIEW - Normal entry mode */
          <>
            {/* Product Selection Cards */}
            <View style={styles.cardsRow}>
              {EGG_TYPES.map((egg) => (
                <Pressable
                  key={egg.id}
                  onPress={() => selectEgg(egg.id as 'red' | 'white' | 'local')}
                  style={({ pressed }) => [
                    styles.card,
                    {
                      borderWidth: state.selectedEgg === egg.id ? 2 : 1,
                      borderColor: state.selectedEgg === egg.id ? egg.color : colors.border,
                      backgroundColor: state.selectedEgg === egg.id ? colors.surface : colors.background,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Image
                      source={egg.image}
                      style={styles.eggImage}
                      contentFit="contain"
                    />
                    <Text
                      className="text-foreground text-center font-semibold"
                      style={styles.cardLabel}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {egg.label}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Input Fields */}
            <View style={styles.inputsRow}>
              {/* First Input Field */}
              <View style={styles.inputWrapper} ref={eggCountFieldRef}>
                <Text
                  className="text-muted font-semibold"
                  style={styles.inputLabel}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {state.calculationMode === 'byCount' ? 'عدد البيض' : 'المبلغ المطلوب'}
                </Text>
                <Pressable
                  onPress={() => setActiveField(state.calculationMode === 'byCount' ? 'eggCount' : 'amountPaid')}
                  style={({ pressed }) => [
                    styles.inputField,
                    {
                      borderColor: 
                        (state.calculationMode === 'byCount' && state.activeField === 'eggCount') ||
                        (state.calculationMode === 'byAmount' && state.activeField === 'amountPaid')
                          ? colors.primary 
                          : colors.border,
                      backgroundColor: colors.surface,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    className="font-bold text-foreground"
                    style={styles.inputText}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {state.calculationMode === 'byCount' ? (state.eggCount || '0') : (state.amountPaid || '0')}
                  </Text>
                </Pressable>
              </View>

              {/* Second Input Field */}
              {state.calculationMode === 'byCount' && (
                <View style={styles.inputWrapper}>
                  <Text
                    className="text-muted font-semibold"
                    style={styles.inputLabel}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    المبلغ المدفوع
                  </Text>
                  <Pressable
                    onPress={() => setActiveField('amountPaid')}
                    style={({ pressed }) => [
                      styles.inputField,
                      {
                        borderColor: state.activeField === 'amountPaid' ? colors.primary : colors.border,
                        backgroundColor: colors.surface,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text
                      className="font-bold text-foreground"
                      style={styles.inputText}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {state.amountPaid || '0'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Add Product Button */}
            {state.selectedEgg && (
              <Pressable
                onPress={addToCart}
                style={({ pressed }) => [
                  styles.addBtn,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={styles.addBtnText}>+ إضافة منتج</Text>
              </Pressable>
            )}

            {/* Price Info Row */}
            <View style={styles.priceInfoRow}>
              <View style={styles.priceItem}>
                <Text className="text-muted" style={styles.priceLabel} numberOfLines={1} adjustsFontSizeToFit>سعر الكرتونة</Text>
                <Text className="font-semibold text-foreground" style={styles.priceValue} numberOfLines={1} adjustsFontSizeToFit>
                  {cartonPrice} {settings.currencyName}
                </Text>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceItem}>
                <Text className="text-muted" style={styles.priceLabel} numberOfLines={1} adjustsFontSizeToFit>سعر البيضة</Text>
                <Text className="font-semibold text-foreground" style={styles.priceValue} numberOfLines={1} adjustsFontSizeToFit>
                  {eggPrice.toFixed(2)} {settings.currencyName}
                </Text>
              </View>
            </View>

            {/* Total - Prominent Display */}
            <View style={[styles.totalBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.totalLabel}>الإجمالي</Text>
              <Text style={styles.totalValue} numberOfLines={1} adjustsFontSizeToFit>
                {(cartTotal + total).toFixed(2)}
              </Text>
              <Text style={styles.totalCurrency}>{settings.currencyName}</Text>
            </View>

            {/* Keypad */}
            <View style={styles.keypad}>
              {/* Row 1: 7, 8, 9 */}
              <View style={styles.keypadRow}>
                {['7', '8', '9'].map((num) => (
                  <Pressable
                    key={num}
                    onPress={() => addDigit(num)}
                    style={({ pressed }) => [
                      styles.keypadBtn,
                      { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <Text className="font-bold text-foreground" style={styles.keypadText}>{num}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Row 2: 4, 5, 6 */}
              <View style={styles.keypadRow}>
                {['4', '5', '6'].map((num) => (
                  <Pressable
                    key={num}
                    onPress={() => addDigit(num)}
                    style={({ pressed }) => [
                      styles.keypadBtn,
                      { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <Text className="font-bold text-foreground" style={styles.keypadText}>{num}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Row 3: 1, 2, 3 */}
              <View style={styles.keypadRow}>
                {['1', '2', '3'].map((num) => (
                  <Pressable
                    key={num}
                    onPress={() => addDigit(num)}
                    style={({ pressed }) => [
                      styles.keypadBtn,
                      { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <Text className="font-bold text-foreground" style={styles.keypadText}>{num}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Row 4: 0, AC */}
              <View style={styles.keypadRow}>
                <Pressable
                  onPress={() => addDigit('0')}
                  style={({ pressed }) => [
                    styles.keypadBtn,
                    { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text className="font-bold text-foreground" style={styles.keypadText}>0</Text>
                </Pressable>
                <Pressable
                  onPress={clearField}
                  style={({ pressed }) => [
                    styles.keypadBtn,
                    { backgroundColor: '#EF4444', opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text style={[styles.keypadText, { color: '#FFFFFF', fontWeight: 'bold' }]}>AC</Text>
                </Pressable>
              </View>
            </View>

            {/* Change Display */}
            <View style={styles.bottomRow}>
              <View style={[styles.changeBox, { backgroundColor: colors.surface }]}>
                {state.calculationMode === 'byCount' ? (
                  <>
                    <Text className="text-muted" style={styles.changeLabel}>
                      {change < 0 ? 'المتبقي على العميل' : 'الباقي'}
                    </Text>
                    <Text
                      style={[
                        styles.changeValue,
                        { color: change < 0 ? '#EF4444' : '#22C55E' },
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {Math.abs(change).toFixed(2)}
                    </Text>
                    <Text className="text-muted" style={styles.changeCurrency}>{settings.currencyName}</Text>
                  </>
                ) : (
                  <>
                    <Text className="text-muted" style={styles.changeLabel}>
                      المتبقي للعميل
                    </Text>
                    <Text
                      style={[
                        styles.changeValue,
                        { color: '#22C55E' },
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {remainder.toFixed(2)}
                    </Text>
                    <Text className="text-muted" style={styles.changeCurrency}>{settings.currencyName}</Text>
                  </>
                )}
              </View>
            </View>
          </>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 3,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  settingsBtn: {
    padding: 4,
  },
  settingsIcon: {
    fontSize: 18,
  },
  modeToggleBtn: {
    padding: 6,
    borderRadius: 6,
  },
  modeToggleIcon: {
    fontSize: 16,
  },
  cartBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  // Product Cards
  cardsRow: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 6,
    padding: 4,
  },
  cardContent: {
    alignItems: 'center',
    gap: 2,
  },
  eggImage: {
    width: 28,
    height: 32,
  },
  cardLabel: {
    fontSize: 11,
  },
  // Input Fields
  inputsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    marginBottom: 2,
    textAlign: 'right',
  },
  inputField: {
    borderWidth: 2,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  inputText: {
    fontSize: 16,
    textAlign: 'right',
  },
  // Add Button
  addBtn: {
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Cart View
  cartViewContainer: {
    flex: 1,
    gap: 3,
  },
  cartItemsContainer: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 6,
    flex: 1,
    minHeight: 100,
  },
  cartViewTitle: {
    fontSize: 13,
    marginBottom: 4,
    textAlign: 'right',
  },
  cartItemsList: {
    flex: 1,
  },
  cartItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
  },
  cartItemLeft: {
    flex: 1,
  },
  cartItemLabel: {
    fontSize: 12,
  },
  cartItemMiddle: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cartItemQtyLabel: {
    fontSize: 9,
  },
  cartItemQty: {
    fontSize: 13,
  },
  cartItemRight: {
    alignItems: 'center',
  },
  cartItemPriceLabel: {
    fontSize: 9,
  },
  cartItemPrice: {
    fontSize: 12,
  },
  // Price Info
  priceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 2,
  },
  priceItem: {
    alignItems: 'center',
    flex: 1,
  },
  priceLabel: {
    fontSize: 10,
  },
  priceValue: {
    fontSize: 12,
  },
  priceDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#ccc',
  },
  // Total
  totalBox: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    marginBottom: 1,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  totalCurrency: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 1,
  },
  // Cart Input
  cartInputWrapper: {
    gap: 2,
  },
  cartInputLabel: {
    fontSize: 11,
    textAlign: 'right',
  },
  cartInputField: {
    borderWidth: 2,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  cartInputText: {
    fontSize: 16,
    textAlign: 'right',
  },
  // Cart Change
  cartChangeBox: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  cartChangeLabel: {
    fontSize: 11,
  },
  cartChangeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  cartChangeCurrency: {
    fontSize: 10,
  },
  // Keypad
  keypad: {
    flex: 1,
    gap: 3,
  },
  keypadRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 3,
  },
  keypadBtn: {
    flex: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadText: {
    fontSize: 18,
  },
  // Bottom Row
  bottomRow: {
    flexDirection: 'row',
    gap: 4,
  },
  changeBox: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    flex: 1,
  },
  changeLabel: {
    fontSize: 10,
  },
  changeValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  changeCurrency: {
    fontSize: 10,
  },
  clearCartBtnFull: {
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearCartBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
