import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
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
  X,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'communication' | 'manage' | 'stats'>('communication');

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

  function showGuide() {
    setShowGuideModal(true);
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

          <TouchableOpacity style={styles.settingItem} onPress={showGuide}>
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

      <Modal
        visible={showGuideModal}
        animationType="slide"
        onRequestClose={() => setShowGuideModal(false)}>
        <SafeAreaView style={styles.guideContainer}>
          <View style={styles.guideHeader}>
            <Text style={styles.guideTitle}>Hướng dẫn sử dụng</Text>
            <TouchableOpacity onPress={() => setShowGuideModal(false)}>
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <View style={styles.guideTabs}>
            <TouchableOpacity
              style={[styles.guideTab, activeTab === 'communication' && styles.guideTabActive]}
              onPress={() => setActiveTab('communication')}>
              <Text style={[styles.guideTabText, activeTab === 'communication' && styles.guideTabTextActive]}>
                Giao tiếp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.guideTab, activeTab === 'manage' && styles.guideTabActive]}
              onPress={() => setActiveTab('manage')}>
              <Text style={[styles.guideTabText, activeTab === 'manage' && styles.guideTabTextActive]}>
                Quản lý
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.guideTab, activeTab === 'stats' && styles.guideTabActive]}
              onPress={() => setActiveTab('stats')}>
              <Text style={[styles.guideTabText, activeTab === 'stats' && styles.guideTabTextActive]}>
                Thống kê
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.guideContent}>
            {activeTab === 'communication' && (
              <View>
                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Chọn danh mục</Text>
                    <Text style={styles.stepText}>
                      Chạm vào các nút danh mục ở phía trên để lựa chọn nhóm từ mà bé muốn sử dụng (Nhu cầu cơ bản, Cảm xúc, v.v.)
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Chạm vào thẻ</Text>
                    <Text style={styles.stepText}>
                      Chạm vào thẻ hình ảnh để thêm nó vào thanh câu. Ứng dụng sẽ tự động phát âm thanh cho bé nghe cách nói.
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Xây dựng câu</Text>
                    <Text style={styles.stepText}>
                      Tiếp tục chạm vào các thẻ để tạo thành câu hoàn chỉnh. Ví dụ: "Mẹ" + "ăn" + "cơm"
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Phát âm thanh</Text>
                    <Text style={styles.stepText}>
                      Nhấn nút "Nói" để phát toàn bộ câu. Nhấn dấu X để xóa bất kỳ thẻ nào không đúng. Nhấn "Xóa" để bắt đầu lại.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'manage' && (
              <View>
                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Tạo danh mục mới</Text>
                    <Text style={styles.stepText}>
                      Vào tab "Quản lý thẻ", nhấn nút xanh (FolderPlus) để tạo danh mục mới. Chọn tên, biểu tượng và màu sắc.
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Thêm thẻ</Text>
                    <Text style={styles.stepText}>
                      Nhấn nút xanh dương (Plus) để thêm thẻ. Nhập tên thẻ, chụp ảnh hoặc chọn từ thư viện.
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Ghi âm tùy chỉnh (Tùy chọn)</Text>
                    <Text style={styles.stepText}>
                      Bạn có thể ghi âm giọng của riêng mình cho mỗi thẻ. Chỉ cần nhấn nút microphone và ghi lại.
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Xóa danh mục/thẻ</Text>
                    <Text style={styles.stepText}>
                      Nhấn lâu trên danh mục để xóa. Nhấn vào nút Trash để xóa thẻ riêng lẻ.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'stats' && (
              <View>
                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Xem thống kê</Text>
                    <Text style={styles.stepText}>
                      Vào tab "Thống kê" để xem những thẻ nào được sử dụng nhiều nhất. Điều này giúp bạn hiểu nhu cầu của bé tốt hơn.
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Theo dõi tiến trình</Text>
                    <Text style={styles.stepText}>
                      Dữ liệu thống kê tích lũy giúp bạn theo dõi sự phát triển giao tiếp của bé theo thời gian.
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Xóa dữ liệu</Text>
                    <Text style={styles.stepText}>
                      Bạn có thể xóa toàn bộ dữ liệu thống kê trong phần Cài đặt → Dữ liệu → Xóa dữ liệu thống kê.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.guideTips}>
              <Text style={styles.guideTipsTitle}>Mẹo hữu ích</Text>
              <Text style={styles.guideTipsText}>
                ✓ Sử dụng ứng dụng trong môi trường yên tĩnh{'\n\n'}
                ✓ Khuyến khích bé tự chọn thẻ, không ép buộc{'\n\n'}
                ✓ Khen ngợi mỗi khi bé sử dụng đúng thẻ{'\n\n'}
                ✓ Bắt đầu với các thẻ quen thuộc, sau đó mở rộng dần{'\n\n'}
                ✓ Kiên nhẫn và duy trì tập luyện hàng ngày
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  guideContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  guideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  guideTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  guideTab: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  guideTabActive: {
    borderBottomColor: '#4A90E2',
  },
  guideTabText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  guideTabTextActive: {
    color: '#4A90E2',
  },
  guideContent: {
    flex: 1,
    padding: 20,
  },
  guideStep: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  guideTips: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  guideTipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D97706',
    marginBottom: 12,
  },
  guideTipsText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 24,
  },
});
