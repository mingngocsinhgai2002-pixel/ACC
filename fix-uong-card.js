import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://seoxgqnatjmxcnxzzumc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlb3hncW5hdGpteGNueHp6dW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzY5MDAsImV4cCI6MjA4NTU1MjkwMH0.6aIcvU41x3TU4DmmODesD4K2RApQTOMpr5H3p5cPtf0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUongCard() {
  console.log('🔧 Đang sửa thẻ "Uống"...\n');

  // Use local image from images folder
  const newUrl = 'uong_nuoc.jpg';

  const { data, error } = await supabase
    .from('cards')
    .update({ image_url: newUrl })
    .eq('title', 'Uống')
    .select();

  if (error) {
    console.log(`❌ Lỗi: ${error.message}`);
  } else {
    console.log(`✅ Đã sửa thẻ "Uống" sang sử dụng hình local: ${newUrl}`);
  }
}

fixUongCard();
