require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function addCards() {
  console.log('🔍 Lấy danh sách categories...');

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name');

  if (catError) {
    console.error('Lỗi:', catError);
    return;
  }

  console.log(`✓ Tìm thấy ${categories.length} categories`);
  categories.forEach(cat => console.log(`  - ${cat.name} (${cat.id})`));

  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.name] = cat.id;
  });

  const newCards = [
    // Nhu cầu cơ bản (thêm vào)
    { category: 'Nhu cầu cơ bản', title: 'Tắm', image_url: 'tam.jpg', order_index: 10 },
    { category: 'Nhu cầu cơ bản', title: 'Chơi', image_url: 'choi.jpg', order_index: 11 },
    { category: 'Nhu cầu cơ bản', title: 'Đọc sách', image_url: 'doc_sach.jpg', order_index: 12 },

    // Cảm xúc (thêm vào)
    { category: 'Cảm xúc', title: 'Yêu', image_url: 'yeu.jpg', order_index: 10 },

    // Hoạt động (nhiều hơn)
    { category: 'Hoạt động', title: 'Chơi', image_url: 'choi.jpg', order_index: 0 },
    { category: 'Hoạt động', title: 'Đọc sách', image_url: 'doc_sach.jpg', order_index: 1 },
    { category: 'Hoạt động', title: 'Tắm', image_url: 'tam.jpg', order_index: 2 },
    { category: 'Hoạt động', title: 'Ngủ', image_url: 'ngu.jpg', order_index: 3 },
    { category: 'Hoạt động', title: 'Ăn', image_url: 'an.jpg', order_index: 4 },
    { category: 'Hoạt động', title: 'Uống nước', image_url: 'uong_nuoc.jpg', order_index: 5 },
    { category: 'Hoạt động', title: 'Chơi với bạn', image_url: 'ban.jpg', order_index: 6 },

    // Người thân (đầy đủ)
    { category: 'Người thân', title: 'Mẹ', image_url: 'me.jpg', order_index: 0 },
    { category: 'Người thân', title: 'Ba', image_url: 'ba.jpg', order_index: 1 },
    { category: 'Người thân', title: 'Anh', image_url: 'anh.jpg', order_index: 2 },
    { category: 'Người thân', title: 'Chị', image_url: 'chi.jpg', order_index: 3 },
    { category: 'Người thân', title: 'Em', image_url: 'em.jpg', order_index: 4 },
    { category: 'Người thân', title: 'Ông', image_url: 'ong.jpg', order_index: 5 },
    { category: 'Người thân', title: 'Bà', image_url: 'ba.jpg', order_index: 6 },
    { category: 'Người thân', title: 'Bạn', image_url: 'ban.jpg', order_index: 7 },

    // Địa điểm
    { category: 'Địa điểm', title: 'Nhà', image_url: 'nha.jpg', order_index: 0 },
    { category: 'Địa điểm', title: 'Trường', image_url: 'truong.jpg', order_index: 1 },
    { category: 'Địa điểm', title: 'Công viên', image_url: 'cong_vien.jpg', order_index: 2 },
    { category: 'Địa điểm', title: 'Bệnh viện', image_url: 'benh_vien.jpg', order_index: 3 },

    // Đồ vật
    { category: 'Đồ vật', title: 'Bóng', image_url: 'bo.jpg', order_index: 0 },
    { category: 'Đồ vật', title: 'Sách', image_url: 'sach.jpg', order_index: 1 },
    { category: 'Đồ vật', title: 'Bút', image_url: 'but.jpg', order_index: 2 },
    { category: 'Đồ vật', title: 'Điện thoại', image_url: 'dien_thoai.jpg', order_index: 3 },
  ];

  const cardsToInsert = newCards.map(card => ({
    category_id: categoryMap[card.category],
    title: card.title,
    image_url: card.image_url,
    audio_url: null,
    is_custom: false,
    order_index: card.order_index
  })).filter(card => card.category_id);

  console.log(`\n📝 Đang thêm ${cardsToInsert.length} thẻ mới...`);

  const { data, error } = await supabase
    .from('cards')
    .insert(cardsToInsert)
    .select();

  if (error) {
    console.error('Lỗi:', error);
  } else {
    console.log(`✅ Đã thêm thành công ${data.length} thẻ!`);
  }

  const { count } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 Tổng số thẻ trong database: ${count}`);

  console.log('\n🗂️ Phân bố theo category:');
  for (const cat of categories) {
    const { count: catCount } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', cat.id);
    console.log(`  - ${cat.name}: ${catCount} thẻ`);
  }
}

addCards();
