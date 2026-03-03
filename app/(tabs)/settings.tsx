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
import { Info, Trash2, Circle as HelpCircle, Volume2, Palette, ChevronRight, X } from 'lucide-react-native';

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
                      Chạm vào các nút danh mục ở phía trên để lựa chọn nhóm từ mà bé muốn sử dụng. Các danh mục thường bao gồm:{'\n'}
                      • Nhu cầu cơ bản (ăn, uống, ngủ, v.v.){'\n'}
                      • Cảm xúc (vui, buồn, sợ, v.v.){'\n'}
                      • Hoạt động (chơi, học, tập thể dục, v.v.){'\n'}
                      • Người (mẹ, bố, em, v.v.){'\n'}
                      Chỉ cần chạm vào tên danh mục để xem các thẻ trong đó.
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
                      Chạm vào thẻ hình ảnh mà bé muốn nói. Khi chạm vào:{'\n'}
                      • Ứng dụng sẽ tự động thêm thẻ vào thanh câu ở phía dưới{'\n'}
                      • Phát âm thanh để bé nghe cách nói từ đó{'\n'}
                      • Ứng dụng sẽ ghi nhận lịch sử sử dụng{'\n'}
                      Bé có thể chạm vào nhiều thẻ liên tiếp để xây dựng câu dài hơn.
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
                      Tiếp tục chạm vào các thẻ để tạo thành câu hoàn chỉnh. Ví dụ:{'\n'}
                      • "Mẹ" + "ăn" + "cơm"{'\n'}
                      • "Em" + "chơi" + "bóng"{'\n'}
                      • "Tôi" + "muốn" + "uống" + "nước"{'\n'}
                      Mỗi thẻ bạn chạm sẽ được hiển thị trong thanh câu phía dưới.
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
                      Khi hoàn thành câu:{'\n'}
                      • Nhấn nút "Nói" (hình loa) để phát toàn bộ câu một lần{'\n'}
                      • Nhấn dấu X trên từng thẻ để xóa thẻ không đúng{'\n'}
                      • Nhấn nút "Xóa" để bắt đầu câu mới{'\n'}
                      Ứng dụng sẽ phát từng từ theo thứ tự bé chọn.
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>5</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Mẹo sử dụng hiệu quả</Text>
                    <Text style={styles.stepText}>
                      • Bắt đầu với các danh mục có thẻ quen thuộc nhất{'\n'}
                      • Lặp lại thường xuyên để bé nhớ các thẻ{'\n'}
                      • Phát âm chậm và rõ ràng{'\n'}
                      • Khen ngợi bé khi sử dụng đúng thẻ{'\n'}
                      • Sử dụng trong môi trường yên tĩnh để bé tập trung tốt hơn
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
                      Vào tab "Quản lý thẻ", nhấn nút xanh lá (FolderPlus) để tạo danh mục mới:{'\n'}
                      • Nhập tên danh mục (ví dụ: "Nhu cầu cơ bản"){'\n'}
                      • Chọn biểu tượng đại diện cho danh mục{'\n'}
                      • Chọn màu sắc để dễ nhận dạng{'\n'}
                      • Nhấn "Tạo" để lưu danh mục mới{'\n'}
                      Danh mục sẽ xuất hiện trong giao diện chính.
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Thêm thẻ vào danh mục</Text>
                    <Text style={styles.stepText}>
                      Chọn danh mục rồi nhấn nút xanh dương (Plus) để thêm thẻ mới:{'\n'}
                      • Nhập tên thẻ (ví dụ: "Ăn cơm", "Uống nước"){'\n'}
                      • Chọn hình ảnh - chạm camera để chụp ảnh hoặc chọn từ thư viện{'\n'}
                      • Chọn một hình ảnh rõ ràng, dễ nhận dạng{'\n'}
                      • Nhấn "Lưu" để hoàn thành{'\n'}
                      Thẻ sẽ được thêm vào danh mục ngay lập tức.
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
                      Để ghi âm giọng của mình cho mỗi thẻ:{'\n'}
                      • Vào chi tiết thẻ{'\n'}
                      • Nhấn nút microphone để bắt đầu ghi{'\n'}
                      • Nói rõ từ hoặc câu muốn ghi{'\n'}
                      • Nhấn "Dừng" khi hoàn thành{'\n'}
                      • Ứng dụng sẽ lưu âm thanh và phát khi bé chạm thẻ
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Chỉnh sửa thẻ</Text>
                    <Text style={styles.stepText}>
                      Để chỉnh sửa thẻ đã tạo:{'\n'}
                      • Chạm vào thẻ và giữ một lúc để mở menu{'\n'}
                      • Chọn "Chỉnh sửa" để thay đổi tên hoặc hình ảnh{'\n'}
                      • Thay thế hình ảnh bằng ảnh mới nếu cần{'\n'}
                      • Cập nhật âm thanh ghi âm nếu muốn{'\n'}
                      • Nhấn "Lưu" để áp dụng thay đổi
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>5</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Xóa danh mục/thẻ</Text>
                    <Text style={styles.stepText}>
                      Để xóa danh mục hoặc thẻ:{'\n'}
                      • Danh mục: Chạm và giữ trên danh mục, chọn "Xóa" (cảnh báo: sẽ xóa tất cả thẻ trong danh mục){'\n'}
                      • Thẻ: Nhấn vào icon trash/thùng rác trên thẻ{'\n'}
                      • Xác nhận lần nữa khi được hỏi{'\n'}
                      Lưu ý: Hành động xóa không thể hoàn tác, hãy chắc chắn trước khi xóa
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>6</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Mẹo quản lý thẻ hiệu quả</Text>
                    <Text style={styles.stepText}>
                      • Tổ chức thẻ theo danh mục logic để dễ tìm{'\n'}
                      • Sử dụng hình ảnh rõ ràng, có độ tương phản cao{'\n'}
                      • Ghi âm giọng mẹ/bố để bé quen thuộc{'\n'}
                      • Bắt đầu với số lượng thẻ ít, dần thêm theo tiến độ{'\n'}
                      • Kiểm tra danh sách thường xuyên để cập nhật và bổ sung thẻ thiếu
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
                    <Text style={styles.stepTitle}>Xem thống kê sử dụng</Text>
                    <Text style={styles.stepText}>
                      Vào tab "Thống kê" để xem những thẻ nào được bé sử dụng nhiều nhất:{'\n'}
                      • Danh sách các thẻ được xếp hạng theo số lần sử dụng{'\n'}
                      • Thẻ được dùng nhiều nhất sẽ nằm ở đầu danh sách{'\n'}
                      • Xem số lần sử dụng của từng thẻ{'\n'}
                      • Lịch sử này giúp bạn hiểu nhu cầu và sở thích của bé
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Phân tích dữ liệu</Text>
                    <Text style={styles.stepText}>
                      Sử dụng dữ liệu thống kê để:{'\n'}
                      • Xác định những từ/thẻ bé sử dụng thường xuyên nhất{'\n'}
                      • Nhận ra những danh mục mà bé cần thêm thẻ{'\n'}
                      • Tìm kiếm những thẻ ít được dùng và cải thiện chúng{'\n'}
                      • Hiểu rõ mức độ giao tiếp và sở thích của bé
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Theo dõi tiến trình phát triển</Text>
                    <Text style={styles.stepText}>
                      Dữ liệu thống kê tích lũy giúp bạn:{'\n'}
                      • Theo dõi sự phát triển giao tiếp của bé theo thời gian{'\n'}
                      • So sánh số lần sử dụng từ tuần này sang tuần khác{'\n'}
                      • Nhận ra những tiến bộ trong khả năng giao tiếp{'\n'}
                      • Đưa ra quyết định tốt hơn về lộ trình học tập{'\n'}
                      • Chia sẻ tiến bộ với các chuyên gia/giáo viên
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Cải thiện danh mục dựa trên dữ liệu</Text>
                    <Text style={styles.stepText}>
                      Dựa vào thống kê, bạn có thể:{'\n'}
                      • Thêm thẻ mới cho những nhu cầu bé hay biểu đạt{'\n'}
                      • Xóa bỏ những thẻ hiếm khi được dùng{'\n'}
                      • Sắp xếp lại danh mục theo tần suất sử dụng{'\n'}
                      • Tập trung vào những lĩnh vực bé yếu nhất{'\n'}
                      • Phát triển bộ từ vựng của bé một cách hợp lý
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>5</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Xóa dữ liệu thống kê</Text>
                    <Text style={styles.stepText}>
                      Để xóa toàn bộ lịch sử sử dụng:{'\n'}
                      • Vào "Cài đặt" (tab cuối cùng){'\n'}
                      • Chọn mục "Dữ liệu"{'\n'}
                      • Nhấn "Xóa dữ liệu thống kê"{'\n'}
                      • Xác nhận khi được hỏi{'\n'}
                      Lưu ý: Dữ liệu sẽ không thể khôi phục sau khi xóa
                    </Text>
                  </View>
                </View>

                <View style={styles.guideStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>6</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Mẹo sử dụng thống kê hiệu quả</Text>
                    <Text style={styles.stepText}>
                      • Kiểm tra thống kê hàng tuần để theo dõi tiến trình{'\n'}
                      • Ghi chú những quan sát riêng của bạn bên ngoài ứng dụng{'\n'}
                      • So sánh với các lần kiểm tra trước đó{'\n'}
                      • Chia sẻ kết quả với gia đình và nhà chuyên gia{'\n'}
                      • Sử dụng dữ liệu để điều chỉnh phương pháp dạy của bạn{'\n'}
                      • Không xóa dữ liệu thường xuyên nếu muốn theo dõi tiến trình dài hạn
                    </Text>
                  </View>
                </View>
              </View>
            )}

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
