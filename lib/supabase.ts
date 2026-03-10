import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://seoxgqnatjmxcnxzzumc.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlb3hncW5hdGpteGNueHp6dW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzY5MDAsImV4cCI6MjA4NTU1MjkwMH0.6aIcvU41x3TU4DmmODesD4K2RApQTOMpr5H3p5cPtf0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
