import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { supabase } from '@/lib/supabase';
import { Category, Card } from '@/types/database';
import { Plus, Camera, Mic, Trash2, Pause, Play } from 'lucide-react-native';

export default function ManageScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardImage, setNewCardImage] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    requestPermissions();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCards(selectedCategory);
    }
  }, [selectedCategory]);

  async function requestPermissions() {
    await ImagePicker.requestCameraPermissionsAsync();
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    await Audio.requestPermissionsAsync();
  }

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index');

      if (error) throw error;
      if (data) {
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCards(categoryId: string) {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('category_id', categoryId)
        .order('order_index');

      if (error) throw error;
      if (data) setCards(data);
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setNewCardImage(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setNewCardImage(result.assets[0].uri);
    }
  }

  async function startRecording() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Lỗi', 'Không thể ghi âm');
    }
  }

  async function stopRecording() {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
  }

  async function saveCard() {
    if (!selectedCategory || !newCardTitle.trim() || !newCardImage) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin và chọn hình ảnh');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cards')
        .insert({
          category_id: selectedCategory,
          title: newCardTitle.trim(),
          image_url: newCardImage,
          is_custom: true,
          order_index: cards.length,
        })
        .select()
        .single();

      if (error) throw error;

      Alert.alert('Thành công', 'Đã thêm thẻ mới');
      setShowAddModal(false);
      setNewCardTitle('');
      setNewCardImage(null);
      loadCards(selectedCategory);
    } catch (error) {
      console.error('Error saving card:', error);
      Alert.alert('Lỗi', 'Không thể lưu thẻ');
    }
  }

  async function deleteCard(cardId: string) {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa thẻ này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('cards')
              .delete()
              .eq('id', cardId);

            if (error) throw error;
            if (selectedCategory) {
              loadCards(selectedCategory);
            }
          } catch (error) {
            console.error('Error deleting card:', error);
            Alert.alert('Lỗi', 'Không thể xóa thẻ');
          }
        },
      },
    ]);
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
        <Text style={styles.title}>Quản lý thẻ</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
              { borderColor: category.color },
            ]}
            onPress={() => setSelectedCategory(category.id)}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryName,
                selectedCategory === category.id && styles.categoryNameActive,
              ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.cardsContainer}>
        {cards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Chưa có thẻ nào trong danh mục này
            </Text>
            <Text style={styles.emptySubtext}>
              Nhấn nút + để thêm thẻ mới
            </Text>
          </View>
        ) : (
          <View style={styles.cardsList}>
            {cards.map((card) => (
              <View key={card.id} style={styles.cardItem}>
                <Image
                  source={{ uri: card.image_url }}
                  style={styles.cardItemImage}
                />
                <View style={styles.cardItemInfo}>
                  <Text style={styles.cardItemTitle}>{card.title}</Text>
                  {card.is_custom && (
                    <Text style={styles.customBadge}>Tùy chỉnh</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteCard(card.id)}>
                  <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Thêm thẻ mới</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Tên thẻ</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Bình nước của bé"
              value={newCardTitle}
              onChangeText={setNewCardTitle}
            />

            <Text style={styles.label}>Hình ảnh</Text>
            <View style={styles.imagePickerContainer}>
              {newCardImage ? (
                <Image
                  source={{ uri: newCardImage }}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Camera size={48} color="#9CA3AF" />
                  <Text style={styles.placeholderText}>Chưa có hình ảnh</Text>
                </View>
              )}
            </View>

            <View style={styles.imageButtons}>
              <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                <Camera size={24} color="#fff" />
                <Text style={styles.imageButtonText}>Chụp ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Text style={styles.imageButtonText}>Chọn từ thư viện</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Ghi âm giọng nói (Tùy chọn)</Text>
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
              ]}
              onPress={isRecording ? stopRecording : startRecording}>
              {isRecording ? (
                <>
                  <Pause size={24} color="#fff" />
                  <Text style={styles.recordButtonText}>Dừng ghi âm</Text>
                </>
              ) : (
                <>
                  <Mic size={24} color="#fff" />
                  <Text style={styles.recordButtonText}>Bắt đầu ghi âm</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={saveCard}>
              <Text style={styles.saveButtonText}>Lưu thẻ</Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: '#4A90E2',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    maxHeight: 80,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#EFF6FF',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryNameActive: {
    color: '#4A90E2',
  },
  cardsContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  cardsList: {
    padding: 15,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  cardItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  customBadge: {
    fontSize: 12,
    color: '#4A90E2',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  cancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#1F2937',
  },
  imagePickerContainer: {
    marginBottom: 15,
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 14,
    color: '#9CA3AF',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recordButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  recordButtonActive: {
    backgroundColor: '#EF4444',
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 18,
    marginTop: 30,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
