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
import { X, Volume2, RotateCcw } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 40) / 2;

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
      {sentenceStrip.length > 0 && (
        <View style={styles.sentenceStripContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sentenceStrip}>
            {sentenceStrip.map((card, index) => (
              <View key={`${card.id}-${index}`} style={styles.stripCard}>
                <Image
                  source={{ uri: card.image_url }}
                  style={styles.stripCardImage}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromStrip(index)}>
                  <X size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <View style={styles.sentenceActions}>
            <TouchableOpacity
              style={styles.speakButton}
              onPress={speakSentence}>
              <Volume2 size={32} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={clearSentence}>
              <RotateCcw size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {categories.length > 0 && (
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
      )}

      <ScrollView style={styles.cardsContainer} showsVerticalScrollIndicator={false}>
        {cards.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyEmoji}>📱</Text>
            <Text style={styles.emptyTitle}>Chưa có thẻ</Text>
            <Text style={styles.emptySubtext}>
              Vào "Quản lý thẻ" để thêm thẻ giao tiếp
            </Text>
          </View>
        ) : (
          <View style={styles.cardsGrid}>
            {cards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => handleCardPress(card)}>
                <Image
                  source={{ uri: card.image_url }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {card.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  sentenceStripContainer: {
    backgroundColor: '#FFF5EE',
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#FF8C42',
  },
  sentenceStrip: {
    paddingHorizontal: 5,
  },
  stripCard: {
    width: 100,
    height: 100,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 5,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  stripCardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sentenceActions: {
    flexDirection: 'row',
    marginTop: 15,
    paddingHorizontal: 10,
    gap: 15,
  },
  speakButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF8C42',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    maxHeight: 90,
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
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 20,
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE + 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: CARD_SIZE - 20,
    backgroundColor: '#F3F4F6',
  },
  cardTitleContainer: {
    padding: 12,
    height: 60,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
