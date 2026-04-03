import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, Text, View, Pressable, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useLanguage } from '@/lib/language-context';
import { getPricesByPeriod, calculateStats, PriceRecord, PriceStats } from '@/lib/price-history';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';
type EggType = 'red' | 'white' | 'local';

export default function AnalyticsPageScreen() {
  const router = useRouter();
  const colors = useColors();
  const { language, t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('monthly');
  const [selectedEggType, setSelectedEggType] = useState<EggType>('red');
  const [priceRecords, setPriceRecords] = useState<PriceRecord[]>([]);
  const [stats, setStats] = useState<PriceStats>({
    highest: 0,
    lowest: 0,
    average: 0,
    count: 0,
  });

  const EGG_TYPES = useMemo(() => [
    { id: 'red' as EggType, label: t('redEgg'), color: '#EF4444' },
    { id: 'white' as EggType, label: t('whiteEgg'), color: '#E5E7EB' },
    { id: 'local' as EggType, label: t('localEgg'), color: '#D4A574' },
  ], [t]);

  const PERIODS = useMemo(() => [
    { id: 'daily' as Period, label: t('daily') },
    { id: 'weekly' as Period, label: t('weekly') },
    { id: 'monthly' as Period, label: t('monthly') },
    { id: 'yearly' as Period, label: t('yearly') },
  ], [t]);

  const loadAnalytics = React.useCallback(async () => {
    const records = await getPricesByPeriod(selectedPeriod);
    const priceStats = await calculateStats(selectedEggType, selectedPeriod);
    setPriceRecords(records);
    setStats(priceStats);
  }, [selectedPeriod, selectedEggType]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  useFocusEffect(
    React.useCallback(() => {
      loadAnalytics();
    }, [loadAnalytics])
  );

  const maxPrice = useMemo(() => {
    if (priceRecords.length === 0) return 100;
    const prices = priceRecords.map(r => r.prices[selectedEggType]);
    const max = Math.max(...prices);
    return max === 0 ? 100 : max * 1.1;
  }, [priceRecords, selectedEggType]);

  const renderChart = () => {
    if (priceRecords.length === 0) {
      return (
        <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.noDataText, { color: colors.muted }]}>{t('noData')}</Text>
        </View>
      );
    }

    const chartHeight = 200;

    return (
      <View style={[styles.chartContainer, { backgroundColor: colors.surface }]}>
        <View style={styles.chartContent}>
          {priceRecords.map((record, index) => {
            const price = record.prices[selectedEggType];
            const height = (price / maxPrice) * chartHeight;
            const dateObj = new Date(record.date);
            const label = dateObj.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <View key={index} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(height, 4),
                      backgroundColor: EGG_TYPES.find(t => t.id === selectedEggType)?.color,
                    },
                  ]}
                />
                <Text style={[styles.barLabel, { color: colors.muted }]}>
                  {label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const flexDirection = language === 'ar' ? 'row-reverse' : 'row';
  const textAlign = language === 'ar' ? 'right' : 'left';

  return (
    <ScreenContainer className="flex-1 px-4 py-4" edges={['top', 'left', 'right']}>
      <View style={[styles.header, { flexDirection }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text className="text-2xl">{language === 'ar' ? '→' : '←'}</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-foreground">{t('priceAnalytics')}</Text>
        <View className="w-8" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign }]}>
            {t('selectPeriod')}
          </Text>
          <View style={[styles.buttonGroup, { flexDirection }]}>
            {PERIODS.map(period => (
              <Pressable
                key={period.id}
                onPress={() => setSelectedPeriod(period.id)}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor:
                      selectedPeriod === period.id ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    {
                      color:
                        selectedPeriod === period.id ? colors.background : colors.foreground,
                    },
                  ]}
                >
                  {period.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign }]}>
            {t('eggType')}
          </Text>
          <View style={[styles.eggTypeGroup, { flexDirection }]}>
            {EGG_TYPES.map(eggType => (
              <Pressable
                key={eggType.id}
                onPress={() => setSelectedEggType(eggType.id)}
                style={[
                  styles.eggTypeButton,
                  {
                    backgroundColor:
                      selectedEggType === eggType.id ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.eggTypeColor,
                    {
                      backgroundColor: eggType.color,
                      borderColor: colors.border,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.eggTypeButtonText,
                    {
                      color:
                        selectedEggType === eggType.id ? colors.background : colors.foreground,
                    },
                  ]}
                >
                  {eggType.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>{renderChart()}</View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign }]}>
            {t('statistics')}
          </Text>
          <View style={[styles.statsGrid, { flexDirection }]}>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                {t('highestPrice')}
              </Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {stats.highest.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                {t('lowestPrice')}
              </Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {stats.lowest.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                {t('averagePrice')}
              </Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {stats.average.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statLabel, { color: colors.muted }]}>
                {t('recordCount')}
              </Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>{stats.count}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonGroup: {
    gap: 8,
    flexWrap: 'wrap',
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  eggTypeGroup: {
    gap: 12,
  },
  eggTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  eggTypeColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  eggTypeButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    minHeight: 250,
    justifyContent: 'center',
  },
  chartContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 200,
    gap: 4,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 9,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  statsGrid: {
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
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
