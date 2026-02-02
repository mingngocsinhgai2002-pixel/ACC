export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          color: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon?: string;
          color?: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          color?: string;
          order_index?: number;
          created_at?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          category_id: string;
          title: string;
          image_url: string;
          audio_url: string | null;
          is_custom: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          title: string;
          image_url: string;
          audio_url?: string | null;
          is_custom?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          title?: string;
          image_url?: string;
          audio_url?: string | null;
          is_custom?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          card_id: string;
          used_at: string;
          session_id: string | null;
        };
        Insert: {
          id?: string;
          card_id: string;
          used_at?: string;
          session_id?: string | null;
        };
        Update: {
          id?: string;
          card_id?: string;
          used_at?: string;
          session_id?: string | null;
        };
      };
    };
  };
}

export type Category = Database['public']['Tables']['categories']['Row'];
export type Card = Database['public']['Tables']['cards']['Row'];
export type UsageLog = Database['public']['Tables']['usage_logs']['Row'];
