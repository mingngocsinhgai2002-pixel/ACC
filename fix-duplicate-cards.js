const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function fixDuplicateCards() {
  console.log('🔍 Tìm kiếm thẻ trùng lặp...\n');

  // Lấy tất cả thẻ
  const { data: cards, error } = await supabase
    .from('cards')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Lỗi:', error);
    return;
  }

  // Tìm thẻ trùng (cùng title và category)
  const seen = new Map();
  const duplicates = [];

  for (const card of cards) {
    const key = `${card.category_id}_${card.title}`;
    if (seen.has(key)) {
      duplicates.push({
        id: card.id,
        title: card.title,
        category: card.category_id,
        created_at: card.created_at
      });
    } else {
      seen.set(key, card);
    }
  }

  if (duplicates.length === 0) {
    console.log('✅ Không có thẻ trùng lặp!');
    return;
  }

  console.log(`📋 Tìm thấy ${duplicates.length} thẻ trùng lặp:\n`);

  // Lấy thông tin categories để hiển thị
  const { data: categories } = await supabase
    .from('categories')
    .select('*');

  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  for (const dup of duplicates) {
    console.log(`  - "${dup.title}" (${categoryMap.get(dup.category)})`);
  }

  // Xóa thẻ trùng
  console.log('\n🗑️ Đang xóa thẻ trùng lặp...');

  const { error: deleteError } = await supabase
    .from('cards')
    .delete()
    .in('id', duplicates.map(d => d.id));

  if (deleteError) {
    console.error('❌ Lỗi khi xóa:', deleteError);
    return;
  }

  console.log(`✅ Đã xóa ${duplicates.length} thẻ trùng lặp!`);

  // Kiểm tra lại tổng số
  const { count } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 Tổng số thẻ còn lại: ${count}`);
}

fixDuplicateCards();
