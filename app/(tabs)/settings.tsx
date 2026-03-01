import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import {
  Info,
  Trash2,
  HelpCircle,
  Volume2,
  Palette,
  ChevronRight,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  async function clearStatistics() {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa toàn bộ dữ liệu thống kê? Hành động này không thể hoàn tác.',
      [
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
              Alert.alert('Thành công', 'Đã xóa dữ liệu thống kê');
            } catch (error) {
              console.error('Error clearing statistics:', error);
              Alert.alert('Lỗi', 'Không thể xóa dữ liệu thống kê');
            }
          },
        },
      ]
    );
  }

  function showAbout() {
    Alert.alert(
      'Về ứng dụng AAC',
      'Ứng dụng hỗ trợ trẻ tự kỷ/chậm nói giao tiếp qua hình ảnh\n\nPhiên bản: 1.0.0\n\nỨng dụng sử dụng phương pháp PECS (Picture Exchange Communication System) để giúp trẻ biểu đạt nhu cầu và cảm xúc thông qua hình ảnh.'
    );
  }

  function showHelp() {
    Alert.alert(
      'Hướng dẫn sử dụng',
      '📱 Giao tiếp:\n- Chạm vào thẻ để phát âm thanh\n- Kéo thẻ vào thanh câu để tạo câu hoàn chỉnh\n- Nhấn nút "Nói" để phát toàn bộ câu\n\n📝 Quản lý thẻ:\n- Nhấn nút + để thêm thẻ mới\n- Chụp ảnh hoặc chọn từ thư viện\n- Ghi âm giọng nói tùy chỉnh (tùy chọn)\n\n📊 Thống kê:\n- Xem thẻ nào được sử dụng nhiều nhất\n- Theo dõi tiến trình học của bé\n\n⚙️ Cài đặt:\n- Tùy chỉnh âm thanh và giao diện\n- Quản lý dữ liệu'
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cài đặt</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tùy chọn giao diện</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Volume2 size={24} color="#4A90E2" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Âm thanh</Text>
                <Text style={styles.settingDescription}>
                  Phát âm thanh khi chạm vào thẻ
                </Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={soundEnabled ? '#4A90E2' : '#F3F4F6'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Palette size={24} color="#4A90E2" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Rung phản hồi</Text>
                <Text style={styles.settingDescription}>
                  Rung nhẹ khi tương tác với thẻ
                </Text>
              </View>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={vibrationEnabled ? '#4A90E2' : '#F3F4F6'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dữ liệu</Text>

          <TouchableOpacity style={styles.settingItem} onPress={clearStatistics}>
            <View style={styles.settingInfo}>
              <Trash2 size={24} color="#EF4444" />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: '#EF4444' }]}>
                  Xóa dữ liệu thống kê
                </Text>
                <Text style={styles.settingDescription}>
                  Xóa toàn bộ lịch sử sử dụng
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hỗ trợ</Text>

          <TouchableOpacity style={styles.settingItem} onPress={showHelp}>
            <View style={styles.settingInfo}>
              <HelpCircle size={24} color="#4A90E2" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Hướng dẫn sử dụng</Text>
                <Text style={styles.settingDescription}>
                  Cách sử dụng ứng dụng
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={showAbout}>
            <View style={styles.settingInfo}>
              <Info size={24} color="#4A90E2" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Về ứng dụng</Text>
                <Text style={styles.settingDescription}>
                  Thông tin phiên bản và giới thiệu
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Lưu ý dành cho phụ huynh</Text>
          <Text style={styles.infoText}>
            ✓ Sử dụng ứng dụng trong môi trường yên tĩnh{'\n'}
            ✓ Khuyến khích bé tự chọn thẻ, không ép buộc{'\n'}
            ✓ Khen ngợi mỗi khi bé sử dụng đúng thẻ{'\n'}
            ✓ Bắt đầu với các thẻ quen thuộc, sau đó mở rộng dần{'\n'}
            ✓ Kiên nhẫn và duy trì tập luyện hàng ngày
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
    backgroundColor: '#F5F7FA',
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
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
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
    marginLeft: 15,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 22,
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    color: '#9CA3AF',
    paddingVertical: 30,
  },
});
