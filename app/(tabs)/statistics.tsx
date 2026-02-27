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
import { TrendingUp, Calendar, Award } from 'lucide-react-native';

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
          <Text style={styles.loadingText}>Đang tải thống kê...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thống kê</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <TrendingUp size={32} color="#4A90E2" />
            <Text style={styles.summaryNumber}>{totalUsage}</Text>
            <Text style={styles.summaryLabel}>Lượt sử dụng</Text>
          </View>
          <View style={styles.summaryItem}>
            <Award size={32} color="#10B981" />
            <Text style={styles.summaryNumber}>{topCards.length}</Text>
            <Text style={styles.summaryLabel}>Thẻ được dùng</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khoảng thời gian</Text>
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
            <View style={styles.sectionHeader}>
              <Calendar size={20} color="#4A90E2" />
              <Text style={styles.sectionTitle}>Sử dụng theo ngày</Text>
            </View>
            <View style={styles.chartContainer}>
              {dailyStats.map((stat, index) => {
                const maxCount = Math.max(...dailyStats.map((s) => s.count));
                const height = (stat.count / maxCount) * 120;
                return (
                  <View key={stat.date} style={styles.chartBar}>
                    <View style={styles.barContainer}>
                      <View
                        style={[styles.bar, { height: Math.max(height, 20) }]}>
                        <Text style={styles.barLabel}>{stat.count}</Text>
                      </View>
                    </View>
                    <Text style={styles.barDate}>{formatDate(stat.date)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color="#4A90E2" />
            <Text style={styles.sectionTitle}>Thẻ được dùng nhiều nhất</Text>
          </View>
          {topCards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Chưa có dữ liệu sử dụng</Text>
              <Text style={styles.emptySubtext}>
                Bắt đầu sử dụng các thẻ để xem thống kê
              </Text>
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
                    <Text style={styles.topCardCount}>
                      {stat.count} lần sử dụng
                    </Text>
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
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
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
    margin: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#4A90E2',
  },
  periodButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    marginTop: 10,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 2,
  },
  bar: {
    backgroundColor: '#4A90E2',
    borderRadius: 6,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 5,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  barDate: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 5,
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 5,
  },
  topCardsList: {
    gap: 12,
  },
  topCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  topCardImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  topCardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  topCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  topCardCount: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});
