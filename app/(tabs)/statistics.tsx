import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Card } from '@/types/database';
import { TrendingUp, Award } from 'lucide-react-native';

interface CardUsageStats {
  card: Card;
  count: number;
}

interface DailyStats {
  date: string;
  count: number;
}

export default function StatisticsScreen() {
  const [topCards, setTopCards] = useState<CardUsageStats[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [totalUsage, setTotalUsage] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>(
    'week'
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, [selectedPeriod]);

  async function loadStatistics() {
    try {
      await Promise.all([loadTopCards(), loadDailyStats(), loadTotalUsage()]);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadTopCards() {
    try {
      const daysAgo = selectedPeriod === 'week' ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data: logs, error } = await supabase
        .from('usage_logs')
        .select('card_id')
        .gte('used_at', startDate.toISOString());

      if (error) throw error;

      const cardCounts = logs.reduce(
        (acc, log) => {
          acc[log.card_id] = (acc[log.card_id] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const cardIds = Object.keys(cardCounts);
      if (cardIds.length === 0) {
        setTopCards([]);
        return;
      }

      const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .in('id', cardIds);

      if (cardsError) throw cardsError;

      const stats: CardUsageStats[] = cards
        .map((card) => ({
          card,
          count: cardCounts[card.id] || 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setTopCards(stats);
    } catch (error) {
      console.error('Error loading top cards:', error);
    }
  }

  async function loadDailyStats() {
    try {
      const daysAgo = selectedPeriod === 'week' ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data: logs, error } = await supabase
        .from('usage_logs')
        .select('used_at')
        .gte('used_at', startDate.toISOString());

      if (error) throw error;

      const dailyCounts: Record<string, number> = {};
      logs.forEach((log) => {
        const date = new Date(log.used_at).toISOString().split('T')[0];
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      });

      const stats: DailyStats[] = Object.entries(dailyCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setDailyStats(stats);
    } catch (error) {
      console.error('Error loading daily stats:', error);
    }
  }

  async function loadTotalUsage() {
    try {
      const { count, error } = await supabase
        .from('usage_logs')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setTotalUsage(count || 0);
    } catch (error) {
      console.error('Error loading total usage:', error);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thống kê</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <TrendingUp size={40} color="#FF8C42" />
            <Text style={styles.summaryNumber}>{totalUsage}</Text>
            <Text style={styles.summaryLabel}>Lần dùng</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Award size={40} color="#10B981" />
            <Text style={styles.summaryNumber}>{topCards.length}</Text>
            <Text style={styles.summaryLabel}>Thẻ được dùng</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.periodButtons}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'week' && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod('week')}>
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'week' && styles.periodButtonTextActive,
                ]}>
                7 ngày
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'month' && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod('month')}>
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'month' && styles.periodButtonTextActive,
                ]}>
                30 ngày
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {dailyStats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hoạt động</Text>
            <View style={styles.chartContainer}>
              {dailyStats.map((stat) => {
                const maxCount = Math.max(...dailyStats.map((s) => s.count));
                const height = (stat.count / maxCount) * 100;
                return (
                  <View key={stat.date} style={styles.chartBar}>
                    <View style={styles.barContainer}>
                      <View
                        style={[styles.bar, { height: Math.max(height, 15) }]}
                      />
                    </View>
                    <Text style={styles.barDate}>{formatDate(stat.date)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thẻ yêu thích nhất</Text>
          {topCards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>😴</Text>
              <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
            </View>
          ) : (
            <View style={styles.topCardsList}>
              {topCards.map((stat, index) => (
                <View key={stat.card.id} style={styles.topCardItem}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  <Image
                    source={{ uri: stat.card.image_url }}
                    style={styles.topCardImage}
                  />
                  <View style={styles.topCardInfo}>
                    <Text style={styles.topCardTitle}>{stat.card.title}</Text>
                    <Text style={styles.topCardCount}>{stat.count} lần</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E5E7EB',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryNumber: {
    fontSize: 40,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 15,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#FF8C42',
  },
  periodButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    marginTop: 15,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 3,
  },
  bar: {
    backgroundColor: '#0EA5E9',
    borderRadius: 8,
    width: '100%',
  },
  barDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  topCardsList: {
    gap: 14,
  },
  topCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF8C42',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rankText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  topCardImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  topCardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  topCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  topCardCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8C42',
    marginTop: 4,
  },
});
