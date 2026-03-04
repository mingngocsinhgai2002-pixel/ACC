import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://seoxgqnatjmxcnxzzumc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlb3hncW5hdGpteGNueHp6dW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzY5MDAsImV4cCI6MjA4NTU1MjkwMH0.6aIcvU41x3TU4DmmODesD4K2RApQTOMpr5H3p5cPtf0';

const supabase = createClient(supabaseUrl, supabaseKey);

const correctImages = {
  'Tắm': 'https://images.pexels.com/photos/3737581/pexels-photo-3737581.jpeg?auto=compress&cs=tinysrgb&w=400', // child bathing
  'Uống': 'https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg?auto=compress&cs=tinysrgb&w=400', // child drinking
  'Bình nước': 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=400', // water bottle
  'Gấu bông': 'https://images.pexels.com/photos/265979/pexels-photo-265979.jpeg?auto=compress&cs=tinysrgb&w=400', // teddy bear
  'Đồ chơi': 'https://images.pexels.com/photos/163444/toy-car-bus-truck-163444.jpeg?auto=compress&cs=tinysrgb&w=400', // toy cars
};

async function fixActivityCards() {
  console.log('🔧 Đang sửa các thẻ hoạt động sai...\n');

  for (const [title, newUrl] of Object.entries(correctImages)) {
    const { data, error } = await supabase
      .from('cards')
      .update({ image_url: newUrl })
      .eq('title', title)
      .select();

    if (error) {
      console.log(`❌ ${title}: Lỗi - ${error.message}`);
    } else {
      console.log(`✅ ${title}: Đã cập nhật`);
    }
  }

  console.log('\n✅ Hoàn thành sửa các thẻ hoạt động!');
}

fixActivityCards();
