const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function addUniqueCards() {
  console.log('🔍 Lấy danh sách categories...');

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*');

  if (catError) {
    console.error('❌ Lỗi:', catError);
    return;
  }

  console.log(`✓ Tìm thấy ${categories.length} categories`);
  categories.forEach(cat => console.log(`  - ${cat.name} (${cat.id})`));

  const categoryMap = new Map(categories.map(c => [c.name, c.id]));

  const newCards = [
    // Nhu cầu cơ bản (thêm mới)
    { category: 'Nhu cầu cơ bản', title: 'Đi vệ sinh', image_url: 've_sinh.jpg', order_index: 20 },
    { category: 'Nhu cầu cơ bản', title: 'Lạnh', image_url: 'lanh.jpg', order_index: 21 },
    { category: 'Nhu cầu cơ bản', title: 'Nóng', image_url: 'nong.jpg', order_index: 22 },

    // Cảm xúc (thêm mới)
    { category: 'Cảm xúc', title: 'Bực mình', image_url: 'buc_minh.jpg', order_index: 20 },
    { category: 'Cảm xúc', title: 'Lo lắng', image_url: 'lo_lang.jpg', order_index: 21 },
    { category: 'Cảm xúc', title: 'Bình thường', image_url: 'binh_thuong.jpg', order_index: 22 },

    // Hoạt động (thêm mới)
    { category: 'Hoạt động', title: 'Đánh răng', image_url: 'danh_rang.jpg', order_index: 20 },
    { category: 'Hoạt động', title: 'Chải tóc', image_url: 'chai_toc.jpg', order_index: 21 },
    { category: 'Hoạt động', title: 'Mặc quần áo', image_url: 'mac_quan_ao.jpg', order_index: 22 },
    { category: 'Hoạt động', title: 'Nấu ăn', image_url: 'nau_an.jpg', order_index: 23 },
    { category: 'Hoạt động', title: 'Dọn dẹp', image_url: 'don_dep.jpg', order_index: 24 },
    { category: 'Hoạt động', title: 'Rửa tay', image_url: 'rua_tay.jpg', order_index: 25 },

    // Người thân (thêm mới)
    { category: 'Người thân', title: 'Bác', image_url: 'bac.jpg', order_index: 20 },
    { category: 'Người thân', title: 'Cậu', image_url: 'cau.jpg', order_index: 21 },
    { category: 'Người thân', title: 'Dì', image_url: 'di.jpg', order_index: 22 },

    // Địa điểm (thêm mới)
    { category: 'Địa điểm', title: 'Nhà tắm', image_url: 'nha_tam.jpg', order_index: 20 },
    { category: 'Địa điểm', title: 'Phòng ngủ', image_url: 'phong_ngu.jpg', order_index: 21 },
    { category: 'Địa điểm', title: 'Bếp', image_url: 'bep.jpg', order_index: 22 },

    // Đồ vật (thêm mới)
    { category: 'Đồ vật', title: 'Đồ chơi', image_url: 'do_choi.jpg', order_index: 20 },
    { category: 'Đồ vật', title: 'Quần', image_url: 'quan.jpg', order_index: 21 },
    { category: 'Đồ vật', title: 'Giày', image_url: 'giay.jpg', order_index: 22 },
    { category: 'Đồ vật', title: 'Cốc', image_url: 'coc.jpg', order_index: 23 },
    { category: 'Đồ vật', title: 'Bàn chải', image_url: 'ban_chai.jpg', order_index: 24 },
  ];

  console.log(`\n📝 Đang thêm ${newCards.length} thẻ mới...\n`);

  let successCount = 0;
  for (const card of newCards) {
    const categoryId = categoryMap.get(card.category);
    if (!categoryId) {
      console.log(`⚠️  Bỏ qua "${card.title}" - không tìm thấy category "${card.category}"`);
      continue;
    }

    const { error } = await supabase
      .from('cards')
      .insert({
        category_id: categoryId,
        title: card.title,
        image_url: card.image_url,
        order_index: card.order_index
      });

    if (error) {
      console.log(`❌ Lỗi khi thêm "${card.title}":`, error.message);
    } else {
      successCount++;
      console.log(`✓ Đã thêm "${card.title}"`);
    }
  }

  console.log(`\n✅ Đã thêm thành công ${successCount} thẻ!`);

  // Kiểm tra tổng số thẻ
  const { count } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 Tổng số thẻ trong database: ${count}`);

  // Phân bố theo category
  console.log('\n🗂️ Phân bố theo category:');
  for (const cat of categories) {
    const { count: catCount } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', cat.id);
    console.log(`  - ${cat.name}: ${catCount} thẻ`);
  }
}

addUniqueCards();
