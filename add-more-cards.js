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
    // Nhu cầu cơ bản (thêm)
    { category: 'Nhu cầu cơ bản', title: 'Đói', image_url: 'doi.jpg', order_index: 13 },
    { category: 'Nhu cầu cơ bản', title: 'Khát', image_url: 'khat.jpg', order_index: 14 },
    { category: 'Nhu cầu cơ bản', title: 'Mệt', image_url: 'met.jpg', order_index: 15 },
    { category: 'Nhu cầu cơ bản', title: 'Đau', image_url: 'dau.jpg', order_index: 16 },

    // Cảm xúc (thêm)
    { category: 'Cảm xúc', title: 'Ngạc nhiên', image_url: 'ngac_nhien.jpg', order_index: 11 },
    { category: 'Cảm xúc', title: 'Hạnh phúc', image_url: 'hanh_phuc.jpg', order_index: 12 },
    { category: 'Cảm xúc', title: 'Thích', image_url: 'thich.jpg', order_index: 13 },
    { category: 'Cảm xúc', title: 'Không thích', image_url: 'khong_thich.jpg', order_index: 14 },

    // Hoạt động (thêm)
    { category: 'Hoạt động', title: 'Viết', image_url: 'viet.jpg', order_index: 7 },
    { category: 'Hoạt động', title: 'Vẽ', image_url: 've.jpg', order_index: 8 },
    { category: 'Hoạt động', title: 'Hát', image_url: 'hat.jpg', order_index: 9 },
    { category: 'Hoạt động', title: 'Nhảy', image_url: 'nhay.jpg', order_index: 10 },
    { category: 'Hoạt động', title: 'Xem tivi', image_url: 'xem_tivi.jpg', order_index: 11 },
    { category: 'Hoạt động', title: 'Nghe nhạc', image_url: 'nghe_nhac.jpg', order_index: 12 },

    // Người thân (thêm)
    { category: 'Người thân', title: 'Cô giáo', image_url: 'co_giao.jpg', order_index: 8 },
    { category: 'Người thân', title: 'Bác sĩ', image_url: 'bac_si.jpg', order_index: 9 },

    // Địa điểm (thêm)
    { category: 'Địa điểm', title: 'Siêu thị', image_url: 'sieu_thi.jpg', order_index: 4 },
    { category: 'Địa điểm', title: 'Nhà hàng', image_url: 'nha_hang.jpg', order_index: 5 },
    { category: 'Địa điểm', title: 'Nhà bà ngoại', image_url: 'nha_ba_ngoai.jpg', order_index: 6 },

    // Đồ vật (thêm)
    { category: 'Đồ vật', title: 'Xe đạp', image_url: 'xe_dap.jpg', order_index: 4 },
    { category: 'Đồ vật', title: 'Ô tô', image_url: 'o_to.jpg', order_index: 5 },
    { category: 'Đồ vật', title: 'Máy tính', image_url: 'may_tinh.jpg', order_index: 6 },
    { category: 'Đồ vật', title: 'Tivi', image_url: 'tivi.jpg', order_index: 7 },
    { category: 'Đồ vật', title: 'Túi', image_url: 'tui.jpg', order_index: 8 },
    { category: 'Đồ vật', title: 'Áo', image_url: 'ao.jpg', order_index: 9 },
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
