const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function checkNguoiThan() {
  console.log('🔍 Kiểm tra chủ đề Người thân...\n');

  // Lấy category Người thân
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('name', 'Người thân');

  if (!categories || categories.length === 0) {
    console.log('❌ Không tìm thấy category Người thân');
    return;
  }

  const nguoiThanCat = categories[0];
  console.log(`✓ Category: ${nguoiThanCat.name} (${nguoiThanCat.id})\n`);

  // Lấy tất cả thẻ trong chủ đề Người thân
  const { data: cards, error } = await supabase
    .from('cards')
    .select('*')
    .eq('category_id', nguoiThanCat.id)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('❌ Lỗi:', error);
    return;
  }

  console.log(`📋 Có ${cards.length} thẻ trong chủ đề Người thân:\n`);

  cards.forEach((card, index) => {
    console.log(`${index + 1}. "${card.title}" - order_index: ${card.order_index} - image: ${card.image_url}`);
  });

  // Danh sách thẻ đúng cho Người thân
  const correctCards = [
    'Mẹ', 'Bố', 'Anh', 'Chị', 'Em',
    'Ông', 'Bà', 'Bác', 'Cô', 'Chú',
    'Cậu', 'Dì', 'Bạn', 'Thầy giáo',
    'Cô giáo', 'Bác sĩ', 'Con'
  ];

  console.log('\n✅ Danh sách thẻ ĐÚNG cho Người thân:');
  correctCards.forEach((title, index) => {
    console.log(`${index + 1}. ${title}`);
  });

  // Tìm thẻ sai
  console.log('\n🔍 Phân tích:');
  const currentTitles = cards.map(c => c.title);
  const wrongCards = currentTitles.filter(t => !correctCards.includes(t));
  const missingCards = correctCards.filter(t => !currentTitles.includes(t));

  if (wrongCards.length > 0) {
    console.log(`\n❌ Thẻ SAI (không phải người thân):`);
    wrongCards.forEach(title => console.log(`  - ${title}`));
  }

  if (missingCards.length > 0) {
    console.log(`\n⚠️  Thẻ THIẾU:`);
    missingCards.forEach(title => console.log(`  - ${title}`));
  }

  if (wrongCards.length === 0 && missingCards.length === 0) {
    console.log('✅ Tất cả các thẻ đều ĐÚNG!');
  }
}

checkNguoiThan();
