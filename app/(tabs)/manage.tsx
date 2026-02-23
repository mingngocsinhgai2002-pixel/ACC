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
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { supabase } from '@/lib/supabase';
import { Category, Card } from '@/types/database';
import { Plus, Camera, Mic, Trash2, Pause, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 50) / 2;

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
      if (data && data.length > 0) {
        setCategories(data);
        setSelectedCategory(data[0].id);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
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
      Alert.alert('Lỗi', 'Vui lòng nhập tên thẻ và chọn hình ảnh');
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
    Alert.alert('Xác nhận', 'Xóa thẻ này?', [
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
          <Plus size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.cardsContainer} showsVerticalScrollIndicator={false}>
        {cards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Chưa có thẻ</Text>
          </View>
        ) : (
          <View style={styles.cardsGrid}>
            {cards.map((card) => (
              <View key={card.id} style={styles.cardItem}>
                <Image
                  source={{ uri: card.image_url }}
                  style={styles.cardImage}
                />
                <Text style={styles.cardName} numberOfLines={2}>
                  {card.title}
                </Text>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteCard(card.id)}>
                  <Trash2 size={20} color="#FF6B6B" />
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
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={28} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Thêm thẻ mới</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Tên thẻ</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Bình nước của bé"
              placeholderTextColor="#9CA3AF"
              value={newCardTitle}
              onChangeText={setNewCardTitle}
            />

            <Text style={styles.label}>Hình ảnh</Text>
            <View style={styles.imageContainer}>
              {newCardImage ? (
                <Image
                  source={{ uri: newCardImage }}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Camera size={56} color="#9CA3AF" />
                </View>
              )}
            </View>

            <View style={styles.imageButtons}>
              <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                <Camera size={28} color="#fff" />
                <Text style={styles.imageButtonText}>Chụp ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Text style={styles.imageButtonText}>Thư viện</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
              ]}
              onPress={isRecording ? stopRecording : startRecording}>
              {isRecording ? (
                <>
                  <Pause size={28} color="#fff" />
                  <Text style={styles.recordButtonText}>Dừng ghi</Text>
                </>
              ) : (
                <>
                  <Mic size={28} color="#fff" />
                  <Text style={styles.recordButtonText}>Ghi âm</Text>
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
    backgroundColor: '#FF8C42',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  categoryContent: {
    paddingHorizontal: 10,
    gap: 10,
  },
  categoryChip: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    borderWidth: 3,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#FFF0E6',
    borderColor: '#FF8C42',
  },
  categoryIcon: {
    fontSize: 40,
  },
  cardsContainer: {
    flex: 1,
    backgroundColor: '#FFF9F5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 20,
    justifyContent: 'space-between',
  },
  cardItem: {
    width: CARD_SIZE,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: CARD_SIZE - 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF9F5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  imageContainer: {
    marginBottom: 20,
    borderRadius: 14,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 15,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  recordButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    borderRadius: 14,
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  recordButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});
