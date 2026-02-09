import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import {
  Info,
  Trash2,
  HelpCircle,
  ChevronRight,
} from 'lucide-react-native';

export default function SettingsScreen() {
  async function clearStatistics() {
    Alert.alert('Xác nhận', 'Xóa tất cả dữ liệu thống kê?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('usage_logs')
              .delete()
              .neq('id', '00000000-0000-0000-0000-000000000000');

            if (error) throw error;
            Alert.alert('Thành công', 'Đã xóa dữ liệu');
          } catch (error) {
            console.error('Error clearing statistics:', error);
            Alert.alert('Lỗi', 'Không thể xóa dữ liệu');
          }
        },
      },
    ]);
  }

  function showAbout() {
    Alert.alert(
      'Về ứng dụng AAC',
      'Ứng dụng giao tiếp cho trẻ tự kỷ/chậm nói\n\nPhiên bản 1.0.0\n\nSử dụng hình ảnh + âm thanh giúp trẻ giao tiếp dễ dàng hơn'
    );
  }

  function showHelp() {
    Alert.alert(
      'Cách sử dụng',
      'Giao tiếp:\n- Chạm vào thẻ\n- Chọn nhiều thẻ tạo câu\n- Nhấn nút xanh để phát\n\nQuản lý:\n- Nhấn + để thêm thẻ\n- Chụp ảnh hoặc chọn thư viện\n\nThống kê:\n- Xem thẻ được dùng nhiều\n- Theo dõi tiến trình'
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cài đặt</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingItem} onPress={showHelp}>
            <View style={styles.settingInfo}>
              <HelpCircle size={32} color="#0EA5E9" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Hướng dẫn</Text>
                <Text style={styles.settingDescription}>
                  Cách sử dụng ứng dụng
                </Text>
              </View>
            </View>
            <ChevronRight size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={showAbout}>
            <View style={styles.settingInfo}>
              <Info size={32} color="#0EA5E9" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Về ứng dụng</Text>
                <Text style={styles.settingDescription}>
                  Thông tin phiên bản
                </Text>
              </View>
            </View>
            <ChevronRight size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={clearStatistics}>
            <View style={styles.settingInfo}>
              <Trash2 size={32} color="#FF6B6B" />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: '#FF6B6B' }]}>
                  Xóa dữ liệu
                </Text>
                <Text style={styles.settingDescription}>
                  Xóa tất cả lịch sử
                </Text>
              </View>
            </View>
            <ChevronRight size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Mẹo dành cho phụ huynh</Text>
          <Text style={styles.tipsText}>
            • Sử dụng ở nơi yên tĩnh{'\n'}
            • Để bé tự chọn thẻ{'\n'}
            • Khen ngợi thường xuyên{'\n'}
            • Bắt đầu từ các thẻ quen thuộc{'\n'}
            • Tập luyện hàng ngày
          </Text>
        </View>

        <Text style={styles.footer}>Phiên bản 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F5',
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
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 18,
    flex: 1,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  tipsCard: {
    backgroundColor: '#EEF5FF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#0EA5E9',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 26,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    paddingVertical: 30,
  },
});
