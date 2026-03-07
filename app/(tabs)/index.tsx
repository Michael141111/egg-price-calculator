import { Text, View, Pressable, StyleSheet, I18nManager } from 'react-native';
import { useEffect, useRef } from 'react';
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
  const {
    state,
    settings,
    selectEgg,
    addDigit,
    clearField,
    clearAll,
    setActiveField,
    toggleCalculationMode,
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
        </View>

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

        {/* Input Fields - two fields side by side */}
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

        {/* Total - Prominent Display (Mode 1 only) */}
        {state.calculationMode === 'byCount' && (
          <View style={[styles.totalBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.totalLabel}>الإجمالي</Text>
            <Text style={styles.totalValue} numberOfLines={1} adjustsFontSizeToFit>
              {total.toFixed(2)}
            </Text>
            <Text style={styles.totalCurrency}>{settings.currencyName}</Text>
          </View>
        )}

        {/* Eggs Received Display (Mode 2 only) */}
        {state.calculationMode === 'byAmount' && (
          <View style={[styles.totalBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.totalLabel}>عدد البيضات</Text>
            <Text style={styles.totalValue} numberOfLines={1} adjustsFontSizeToFit>
              {eggsReceived}
            </Text>
            <Text style={styles.totalCurrency}>بيضة</Text>
          </View>
        )}

        {/* Keypad - takes remaining space */}
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

        {/* Change Display (Mode 1) or Remainder Display (Mode 2) */}
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
  // Change Display
  changeBox: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  changeLabel: {
    fontSize: 10,
  },
  changeValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  changeCurrency: {
    fontSize: 10,
  },
});
