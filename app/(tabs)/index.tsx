import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
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
                <Image
                  source={{ uri: card.image_url }}
                  style={styles.stripCardImage}
                />
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
});
