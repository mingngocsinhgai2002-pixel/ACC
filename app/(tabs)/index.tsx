import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { supabase } from '@/lib/supabase';
import { Category, Card } from '@/types/database';
import { X, Volume2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 3;

export default function CommunicationScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sentenceStrip, setSentenceStrip] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCards(selectedCategory);
    }
  }, [selectedCategory]);

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

  function getImageSource(imageUrl: string) {
    const imageMap: Record<string, any> = {
      'an.jpg': require('@/images/an.jpg'),
      'anh.jpg': require('@/images/anh.jpg'),
      'ao.jpg': require('@/images/ao.jpg'),
      'ba.jpg': require('@/images/ba.jpg'),
      'bac.jpg': require('@/images/bac.jpg'),
      'bac_si.jpg': require('@/images/bac_si.jpg'),
      'ban.jpg': require('@/images/ban.jpg'),
      'ban_chai.jpg': require('@/images/ban_chai.jpg'),
      'benh_vien.jpg': require('@/images/benh_vien.jpg'),
      'bep.jpg': require('@/images/bep.jpg'),
      'bien.jpg': require('@/images/bien.jpg'),
      'binh_thuong.jpg': require('@/images/binh_thuong.jpg'),
      'bo.jpg': require('@/images/bo.jpg'),
      'boi.jpg': require('@/images/boi.jpg'),
      'bong.jpg': require('@/images/bong.jpg'),
      'buc_minh.jpg': require('@/images/buc_minh.jpg'),
      'buon.jpg': require('@/images/buon.jpg'),
      'but.jpg': require('@/images/but.jpg'),
      'cap.jpg': require('@/images/cap.jpg'),
      'cau.jpg': require('@/images/cau.jpg'),
      'chai_toc.jpg': require('@/images/chai_toc.jpg'),
      'chan.jpg': require('@/images/chan.jpg'),
      'chay.jpg': require('@/images/chay.jpg'),
      'chi.jpg': require('@/images/chi.jpg'),
      'choi.jpg': require('@/images/choi.jpg'),
      'chu.jpg': require('@/images/chu.jpg'),
      'chup_anh.jpg': require('@/images/chup_anh.jpg'),
      'co.jpg': require('@/images/co.jpg'),
      'co_giao.jpg': require('@/images/co_giao.jpg'),
      'coc.jpg': require('@/images/coc.jpg'),
      'con.jpg': require('@/images/con.jpg'),
      'cong_vien.jpg': require('@/images/cong_vien.jpg'),
      'da_bong.jpg': require('@/images/da_bong.jpg'),
      'danh_rang.jpg': require('@/images/danh_rang.jpg'),
      'dau.jpg': require('@/images/dau.jpg'),
      'di.jpg': require('@/images/di.jpg'),
      'di_dao.jpg': require('@/images/di_dao.jpg'),
      'di_xe_dap.jpg': require('@/images/di_xe_dap.jpg'),
      'dien_thoai.jpg': require('@/images/dien_thoai.jpg'),
      'do_choi.jpg': require('@/images/do_choi.jpg'),
      'doc_sach.jpg': require('@/images/doc_sach.jpg'),
      'doi.jpg': require('@/images/doi.jpg'),
      'don_dep.jpg': require('@/images/don_dep.jpg'),
      'em.jpg': require('@/images/em.jpg'),
      'ghet.jpg': require('@/images/ghet.jpg'),
      'gian.jpg': require('@/images/gian.jpg'),
      'giay.jpg': require('@/images/giay.jpg'),
      'giup_do.jpg': require('@/images/giup_do.jpg'),
      'goi.jpg': require('@/images/goi.jpg'),
      'hanh_phuc.jpg': require('@/images/hanh_phuc.jpg'),
      'hat.jpg': require('@/images/hat.jpg'),
      'hoc.jpg': require('@/images/hoc.jpg'),
      'kem_danh_rang.jpg': require('@/images/kem_danh_rang.jpg'),
      'khan.jpg': require('@/images/khan.jpg'),
      'khat.jpg': require('@/images/khat.jpg'),
      'lam_vuon.jpg': require('@/images/lam_vuon.jpg'),
      'lanh.jpg': require('@/images/lanh.jpg'),
      'lo_lang.jpg': require('@/images/lo_lang.jpg'),
      'mac_quan_ao.jpg': require('@/images/mac_quan_ao.jpg'),
      'may_tinh.jpg': require('@/images/may_tinh.jpg'),
      'me.jpg': require('@/images/me.jpg'),
      'met.jpg': require('@/images/met.jpg'),
      'nau_an.jpg': require('@/images/nau_an.jpg'),
      'nghe_nhac.jpg': require('@/images/nghe_nhac.jpg'),
      'nghi_ngoi.jpg': require('@/images/nghi_ngoi.jpg'),
      'ngu.jpg': require('@/images/ngu.jpg'),
      'nha.jpg': require('@/images/nha.jpg'),
      'nha_ban.jpg': require('@/images/nha_ban.jpg'),
      'nha_hang.jpg': require('@/images/nha_hang.jpg'),
      'nha_tam.jpg': require('@/images/nha_tam.jpg'),
      'nhay.jpg': require('@/images/nhay.jpg'),
      'nhay_day.jpg': require('@/images/nhay_day.jpg'),
      'nho.jpg': require('@/images/nho.jpg'),
      'noi_chuyen.jpg': require('@/images/noi_chuyen.jpg'),
      'non.jpg': require('@/images/non.jpg'),
      'nong.jpg': require('@/images/nong.jpg'),
      'nui.jpg': require('@/images/nui.jpg'),
      'ong.jpg': require('@/images/ong.jpg'),
      'phong_ngu.jpg': require('@/images/phong_ngu.jpg'),
      'quan.jpg': require('@/images/quan.jpg'),
      'rap_phim.jpg': require('@/images/rap_phim.jpg'),
      'rua_tay.jpg': require('@/images/rua_tay.jpg'),
      'sach.jpg': require('@/images/sach.jpg'),
      'san_choi.jpg': require('@/images/san_choi.jpg'),
      'sieu_thi.jpg': require('@/images/sieu_thi.jpg'),
      'so.jpg': require('@/images/so.jpg'),
      'tam.jpg': require('@/images/tam.jpg'),
      'thay_giao.jpg': require('@/images/thay_giao.jpg'),
      'thich.jpg': require('@/images/thich.jpg'),
      'thu_vien.jpg': require('@/images/thu_vien.jpg'),
      'truong.jpg': require('@/images/truong.jpg'),
      'tv.jpg': require('@/images/tv.jpg'),
      'uong_nuoc.jpg': require('@/images/uong_nuoc.jpg'),
      've.jpg': require('@/images/ve.jpg'),
      've_sinh.jpg': require('@/images/ve_sinh.jpg'),
      'vo.jpg': require('@/images/vo.jpg'),
      'vui.jpg': require('@/images/vui.jpg'),
      'xe_dap.jpg': require('@/images/xe_dap.jpg'),
      'xem_tv.jpg': require('@/images/xem_tv.jpg'),
      'yeu.jpg': require('@/images/yeu.jpg'),
    };

    if (imageMap[imageUrl]) {
      return imageMap[imageUrl];
    }

    return null;
  }

  async function handleCardPress(card: Card) {
    setSentenceStrip([...sentenceStrip, card]);
    await Speech.speak(card.title, { language: 'vi-VN' });
    await logUsage(card.id);
  }

  async function logUsage(cardId: string) {
    try {
      await supabase.from('usage_logs').insert({
        card_id: cardId,
        session_id: null,
      });
    } catch (error) {
      console.error('Error logging usage:', error);
    }
  }

  function removeFromStrip(index: number) {
    setSentenceStrip(sentenceStrip.filter((_, i) => i !== index));
  }

  async function speakSentence() {
    if (sentenceStrip.length === 0) return;
    const sentence = sentenceStrip.map((card) => card.title).join(' ');
    await Speech.speak(sentence, { language: 'vi-VN' });
  }

  function clearSentence() {
    setSentenceStrip([]);
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
        <Text style={styles.title}>Giao tiếp</Text>
      </View>

      {sentenceStrip.length > 0 && (
        <View style={styles.sentenceStripContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sentenceStrip}>
            {sentenceStrip.map((card, index) => (
              <View key={`${card.id}-${index}`} style={styles.stripCard}>
                {getImageSource(card.image_url) ? (
                  <Image
                    source={getImageSource(card.image_url)}
                    style={styles.stripCardImage}
                  />
                ) : (
                  <View style={[styles.stripCardImage, styles.placeholderImage]}>
                    <Text style={styles.placeholderTextSmall}>?</Text>
                  </View>
                )}
                <Text style={styles.stripCardText} numberOfLines={1}>
                  {card.title}
                </Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromStrip(index)}>
                  <X size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <View style={styles.sentenceActions}>
            <TouchableOpacity
              style={styles.speakButton}
              onPress={speakSentence}>
              <Volume2 size={24} color="#fff" />
              <Text style={styles.speakButtonText}>Nói</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={clearSentence}>
              <Text style={styles.clearButtonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
        <View style={styles.cardsGrid}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.card}
              onPress={() => handleCardPress(card)}>
              {getImageSource(card.image_url) ? (
                <Image
                  source={getImageSource(card.image_url)}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.cardImage, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>?</Text>
                </View>
              )}
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {card.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
  sentenceStripContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sentenceStrip: {
    paddingRight: 15,
  },
  stripCard: {
    width: 80,
    marginRight: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 5,
    position: 'relative',
  },
  stripCardImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
  },
  stripCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 5,
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sentenceActions: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  speakButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  speakButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  clearButton: {
    backgroundColor: '#6B7280',
    borderRadius: 12,
    padding: 15,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    backgroundColor: '#F5F7FA',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 15,
  },
  card: {
    width: CARD_SIZE,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: CARD_SIZE - 50,
    backgroundColor: '#F3F4F6',
  },
  cardTitleContainer: {
    padding: 10,
    minHeight: 50,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  placeholderImage: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  placeholderTextSmall: {
    fontSize: 32,
    color: '#9CA3AF',
    fontWeight: '300',
  },
});
