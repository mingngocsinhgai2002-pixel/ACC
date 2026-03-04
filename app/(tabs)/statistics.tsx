import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Card } from '@/types/database';
import { TrendingUp, Calendar, Award, X, ChevronLeft, ChevronRight } from 'lucide-react-native';

interface CardUsageStats {
  card: Card;
  count: number;
}

interface DailyStats {
  date: string;
  count: number;
}

interface DayDetail {
  date: string;
  cards: CardUsageStats[];
  totalCount: number;
}

export default function StatisticsScreen() {
  const [topCards, setTopCards] = useState<CardUsageStats[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [totalUsage, setTotalUsage] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>(
    'week'
  );
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayDetails, setDayDetails] = useState<DayDetail | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);

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

  async function loadDayDetails(dateString: string) {
    try {
      const startDate = new Date(dateString);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(dateString);
      endDate.setHours(23, 59, 59, 999);

      const { data: logs, error } = await supabase
        .from('usage_logs')
        .select('card_id')
        .gte('used_at', startDate.toISOString())
        .lte('used_at', endDate.toISOString());

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
        setDayDetails({
          date: dateString,
          cards: [],
          totalCount: 0,
        });
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
        .sort((a, b) => b.count - a.count);

      setDayDetails({
        date: dateString,
        cards: stats,
        totalCount: logs.length,
      });
    } catch (error) {
      console.error('Error loading day details:', error);
    }
  }

  function getCalendarDays() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }

  function getUsageCountForDate(date: Date): number {
    const dateString = date.toISOString().split('T')[0];
    const stat = dailyStats.find(s => s.date === dateString);
    return stat ? stat.count : 0;
  }

  function handleDayPress(date: Date) {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    loadDayDetails(dateString);
    setShowDayModal(true);
  }

  function goToPreviousMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  }

  function goToNextMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  }

  function formatMonthYear(date: Date) {
    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
      'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
      'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function formatDayDetail(dateString: string) {
    const date = new Date(dateString);
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#4A90E2" />
            <Text style={styles.sectionTitle}>Lịch sử sử dụng</Text>
          </View>

          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthButton}>
              <ChevronLeft size={24} color="#4A90E2" />
            </TouchableOpacity>
            <Text style={styles.monthYearText}>{formatMonthYear(currentMonth)}</Text>
            <TouchableOpacity onPress={goToNextMonth} style={styles.monthButton}>
              <ChevronRight size={24} color="#4A90E2" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDaysHeader}>
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
              <View key={day} style={styles.weekDayCell}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {getCalendarDays().map((date, index) => {
              if (!date) {
                return <View key={`empty-${index}`} style={styles.calendarDay} />;
              }

              const usageCount = getUsageCountForDate(date);
              const hasUsage = usageCount > 0;
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    hasUsage && styles.calendarDayWithUsage,
                    isToday && styles.calendarDayToday,
                  ]}
                  onPress={() => handleDayPress(date)}
                  disabled={!hasUsage}>
                  <Text
                    style={[
                      styles.calendarDayText,
                      hasUsage && styles.calendarDayTextWithUsage,
                      isToday && styles.calendarDayTextToday,
                    ]}>
                    {date.getDate()}
                  </Text>
                  {hasUsage && (
                    <View style={styles.usageBadge}>
                      <Text style={styles.usageBadgeText}>{usageCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

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

      <Modal
        visible={showDayModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDayModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Calendar size={24} color="#4A90E2" />
                <Text style={styles.modalTitle}>
                  {dayDetails && formatDayDetail(dayDetails.date)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowDayModal(false)}
                style={styles.closeButton}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {dayDetails && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalSummary}>
                  <Text style={styles.modalSummaryText}>
                    Tổng số lần sử dụng: <Text style={styles.modalSummaryNumber}>{dayDetails.totalCount}</Text>
                  </Text>
                  <Text style={styles.modalSummaryText}>
                    Số thẻ khác nhau: <Text style={styles.modalSummaryNumber}>{dayDetails.cards.length}</Text>
                  </Text>
                </View>

                {dayDetails.cards.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Không có dữ liệu</Text>
                  </View>
                ) : (
                  <View style={styles.dayCardsList}>
                    {dayDetails.cards.map((stat, index) => (
                      <View key={stat.card.id} style={styles.dayCardItem}>
                        <View style={styles.dayCardRank}>
                          <Text style={styles.dayCardRankText}>{index + 1}</Text>
                        </View>
                        <Image
                          source={{ uri: stat.card.image_url }}
                          style={styles.dayCardImage}
                        />
                        <View style={styles.dayCardInfo}>
                          <Text style={styles.dayCardTitle}>{stat.card.title}</Text>
                          <Text style={styles.dayCardCount}>
                            {stat.count} lần
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  monthButton: {
    padding: 8,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    position: 'relative',
  },
  calendarDayWithUsage: {
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
  },
  calendarDayToday: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 8,
  },
  calendarDayText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  calendarDayTextWithUsage: {
    color: '#1F2937',
    fontWeight: '600',
  },
  calendarDayTextToday: {
    color: '#4A90E2',
    fontWeight: '700',
  },
  usageBadge: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  usageBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
  },
  modalSummary: {
    backgroundColor: '#F0F9FF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  modalSummaryText: {
    fontSize: 15,
    color: '#374151',
  },
  modalSummaryNumber: {
    fontWeight: '700',
    color: '#4A90E2',
    fontSize: 16,
  },
  dayCardsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dayCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  dayCardRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dayCardRankText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  dayCardImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  dayCardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dayCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  dayCardCount: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});
