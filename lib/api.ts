import { Card, Category } from '@/types/database';
import { supabase } from './supabase';

const API_BASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL
  ? `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1`
  : '';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        error: error || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export const api = {
  async getCards(categoryId?: string): Promise<Card[]> {
    const params = categoryId ? `?category_id=${categoryId}` : '';
    const response = await fetchAPI<Card[]>(`/cards${params}`);
    return response.data || [];
  },

  async getCategories(): Promise<Category[]> {
    const response = await fetchAPI<Category[]>('/categories');
    return response.data || [];
  },

  async logUsage(cardId: string): Promise<boolean> {
    const response = await fetchAPI('/usage-log', {
      method: 'POST',
      body: JSON.stringify({ card_id: cardId }),
    });
    return response.success;
  },

  async getStats() {
    const response = await fetchAPI('/stats');
    return response.data || {
      total_cards_used: 0,
      unique_cards: 0,
      total_sessions: 0,
      top_cards: [],
    };
  },

  async createCard(
    title: string,
    imageUrl: string,
    categoryId: string,
    audioUrl?: string
  ): Promise<Card | null> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('cards')
        .insert({
          title,
          image_url: imageUrl,
          category_id: categoryId,
          audio_url: audioUrl || null,
          user_id: authData.user.id,
          is_custom: true,
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create card error:', error);
      return null;
    }
  },

  async deleteCard(cardId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete card error:', error);
      return false;
    }
  },

  async updateCard(
    cardId: string,
    title: string,
    imageUrl: string,
    audioUrl?: string
  ): Promise<Card | null> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .update({
          title,
          image_url: imageUrl,
          audio_url: audioUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', cardId)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update card error:', error);
      return null;
    }
  },
};
