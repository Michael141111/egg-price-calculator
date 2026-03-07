import { Text, View, Pressable, I18nManager } from 'react-native';
import { useEffect } from 'react';
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

  // Calculate values
  const selectedEggData = EGG_TYPES.find((egg) => egg.id === state.selectedEgg);
  const cartonPrice = selectedEggData
    ? settings.prices[state.selectedEgg as keyof typeof settings.prices]
    : 0;
  const eggPrice = cartonPrice > 0 ? cartonPrice / 30 : 0;

  // Mode 1: Input egg count, calculate total
  const eggCount = parseInt(state.eggCount, 10) || 0;
  const total = eggCount * eggPrice;
  const amountPaid = parseFloat(state.amountPaid) || 0;
  const change = amountPaid - total;

  // Mode 2: Input amount, calculate egg count
  const requestedAmount = parseFloat(state.amountPaid) || 0;
  const eggsFromAmount = eggPrice > 0 ? Math.floor(requestedAmount / eggPrice) : 0;
  const remainderFromAmount = eggPrice > 0 ? requestedAmount - (eggsFromAmount * eggPrice) : 0;

  if (isLoading) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-foreground">جاري التحميل...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1 px-3 py-2" edges={['top', 'left', 'right']}>
      <View className="flex-1 gap-2">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-1">
          <Pressable
            onPress={() => router.push('/settings')}
            className="p-2"
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Text className="text-2xl">⚙️</Text>
          </Pressable>
          <Text className="text-xl font-bold text-foreground">آلة أسعار البيض</Text>
          <Pressable
            onPress={toggleCalculationMode}
            className="p-2 rounded-lg"
            style={({ pressed }) => [
              {
                backgroundColor: state.calculationMode === 'byAmount' ? colors.primary : colors.surface,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: state.calculationMode === 'byAmount' ? '#FFFFFF' : colors.foreground }}
            >
              {state.calculationMode === 'byCount' ? '💰' : '🥚'}
            </Text>
          </Pressable>
        </View>

        {/* Product Selection Cards */}
        <View className="flex-row gap-2 justify-center mb-2">
          {EGG_TYPES.map((egg) => (
            <Pressable
              key={egg.id}
              onPress={() => selectEgg(egg.id as 'red' | 'white' | 'local')}
              style={({ pressed }) => [
                {
                  flex: 1,
                  borderRadius: 8,
                  borderWidth: state.selectedEgg === egg.id ? 3 : 1,
                  borderColor: state.selectedEgg === egg.id ? egg.color : colors.border,
                  backgroundColor: state.selectedEgg === egg.id ? colors.surface : colors.background,
                  padding: 8,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View className="items-center gap-1">
                <Image
                  source={egg.image}
                  style={{ width: 40, height: 50 }}
                  contentFit="contain"
                />
                <Text
                  className="text-xs font-semibold text-foreground text-center"
                  numberOfLines={2}
                >
                  {egg.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Input Fields */}
        <View className="gap-2 mb-2">
          {/* Egg Count Input - Mode 1 */}
          {state.calculationMode === 'byCount' && (
            <View>
              <Text className="text-xs font-semibold text-muted mb-1">عدد البيض</Text>
              <Pressable
                onPress={() => setActiveField('eggCount')}
                style={({ pressed }) => [
                  {
                    borderWidth: 2,
                    borderColor:
                      state.activeField === 'eggCount' ? colors.primary : colors.border,
                    borderRadius: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    backgroundColor: colors.surface,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-lg font-bold text-foreground text-right">
                  {state.eggCount || '0'}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Amount Paid Input */}
          <View>
            <Text className="text-xs font-semibold text-muted mb-1">
              {state.calculationMode === 'byCount' ? 'المبلغ المدفوع' : 'المبلغ المطلوب'}
            </Text>
            <Pressable
              onPress={() => setActiveField('amountPaid')}
              style={({ pressed }) => [
                {
                  borderWidth: 2,
                  borderColor:
                    state.activeField === 'amountPaid' ? colors.primary : colors.border,
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-lg font-bold text-foreground text-right">
                {state.amountPaid || '0'}
              </Text>
            </Pressable>
          </View>

          {/* Eggs from Amount Display - Mode 2 */}
          {state.calculationMode === 'byAmount' && (
            <View>
              <Text className="text-xs font-semibold text-muted mb-1">عدد البيضات المستلمة</Text>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: colors.border,
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: colors.surface,
                }}
              >
                <Text className="text-lg font-bold text-foreground text-right">
                  {eggsFromAmount}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Results Display */}
        <View className="gap-1 mb-2 bg-surface rounded-lg p-2">
          <View className="flex-row justify-between">
            <Text className="text-sm text-muted">سعر الكرتونة</Text>
            <Text className="text-sm font-semibold text-foreground">
              {cartonPrice} {settings.currencyName}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-muted">سعر البيضة</Text>
            <Text className="text-sm font-semibold text-foreground">
              {eggPrice.toFixed(2)} {settings.currencyName}
            </Text>
          </View>

          {/* Total - Prominent Display */}
          <View className="bg-primary rounded-lg p-3 mt-1">
            <Text className="text-xs text-white text-center mb-1">
              {state.calculationMode === 'byCount' ? 'الإجمالي' : 'السعر الكلي'}
            </Text>
            <Text className="text-4xl font-bold text-white text-center">
              {state.calculationMode === 'byCount' ? total.toFixed(2) : (eggsFromAmount * eggPrice).toFixed(2)}
            </Text>
            <Text className="text-sm text-white text-center mt-1">{settings.currencyName}</Text>
          </View>
        </View>

        {/* Keypad */}
        <View className="gap-1 mb-2">
          {/* Row 1: 7, 8, 9 */}
          <View className="flex-row gap-1">
            {['7', '8', '9'].map((num) => (
              <Pressable
                key={num}
                onPress={() => addDigit(num)}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    backgroundColor: colors.surface,
                    borderRadius: 6,
                    paddingVertical: 12,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-xl font-bold text-foreground text-center">{num}</Text>
              </Pressable>
            ))}
          </View>

          {/* Row 2: 4, 5, 6 */}
          <View className="flex-row gap-1">
            {['4', '5', '6'].map((num) => (
              <Pressable
                key={num}
                onPress={() => addDigit(num)}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    backgroundColor: colors.surface,
                    borderRadius: 6,
                    paddingVertical: 12,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-xl font-bold text-foreground text-center">{num}</Text>
              </Pressable>
            ))}
          </View>

          {/* Row 3: 1, 2, 3 */}
          <View className="flex-row gap-1">
            {['1', '2', '3'].map((num) => (
              <Pressable
                key={num}
                onPress={() => addDigit(num)}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    backgroundColor: colors.surface,
                    borderRadius: 6,
                    paddingVertical: 12,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text className="text-xl font-bold text-foreground text-center">{num}</Text>
              </Pressable>
            ))}
          </View>

          {/* Row 4: 0, AC */}
          <View className="flex-row gap-1">
            <Pressable
              onPress={() => addDigit('0')}
              style={({ pressed }) => [
                {
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 6,
                  paddingVertical: 12,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-xl font-bold text-foreground text-center">0</Text>
            </Pressable>
            <Pressable
              onPress={clearField}
              style={({ pressed }) => [
                {
                  flex: 1,
                  backgroundColor: '#EF4444',
                  borderRadius: 6,
                  paddingVertical: 12,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-xl font-bold text-white text-center">AC</Text>
            </Pressable>
          </View>
        </View>

        {/* Change Display */}
        <View className="bg-surface rounded-lg p-3">
          {state.calculationMode === 'byCount' ? (
            <>
              <Text className="text-xs text-muted text-center mb-1">
                {change < 0 ? 'المتبقي على العميل' : 'الباقي'}
              </Text>
              <Text
                className={cn(
                  'text-3xl font-bold text-center',
                  change < 0 ? 'text-error' : 'text-success'
                )}
              >
                {Math.abs(change).toFixed(2)}
              </Text>
            </>
          ) : (
            <>
              <Text className="text-xs text-muted text-center mb-1">الباقي</Text>
              <Text className="text-3xl font-bold text-center text-success">
                {remainderFromAmount.toFixed(2)}
              </Text>
            </>
          )}
          <Text className="text-sm text-muted text-center mt-1">{settings.currencyName}</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
