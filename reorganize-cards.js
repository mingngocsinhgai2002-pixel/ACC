const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function reorganizeCards() {
  console.log('🔍 Lấy danh sách categories...');

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*');

  if (catError) {
    console.error('❌ Lỗi:', catError);
    return;
  }

  const categoryMap = new Map(categories.map(c => [c.name, c.id]));

  console.log('✓ Tìm thấy categories:', categories.map(c => c.name).join(', '));

  // Xóa tất cả thẻ hiện tại
  console.log('\n🗑️ Xóa các thẻ cũ...');
  await supabase.from('cards').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Danh sách thẻ sắp xếp lại theo chủ đề
  const organizedCards = [
    // NHU CẦU CƠ BẢN (16 thẻ)
    { category: 'Nhu cầu cơ bản', title: 'Ăn', image_url: 'an.jpg', order_index: 1 },
    { category: 'Nhu cầu cơ bản', title: 'Uống nước', image_url: 'uong_nuoc.jpg', order_index: 2 },
    { category: 'Nhu cầu cơ bản', title: 'Ngủ', image_url: 'ngu.jpg', order_index: 3 },
    { category: 'Nhu cầu cơ bản', title: 'Đi vệ sinh', image_url: 've_sinh.jpg', order_index: 4 },
    { category: 'Nhu cầu cơ bản', title: 'Tắm', image_url: 'tam.jpg', order_index: 5 },
    { category: 'Nhu cầu cơ bản', title: 'Rửa tay', image_url: 'rua_tay.jpg', order_index: 6 },
    { category: 'Nhu cầu cơ bản', title: 'Đánh răng', image_url: 'danh_rang.jpg', order_index: 7 },
    { category: 'Nhu cầu cơ bản', title: 'Chải tóc', image_url: 'chai_toc.jpg', order_index: 8 },
    { category: 'Nhu cầu cơ bản', title: 'Mặc quần áo', image_url: 'mac_quan_ao.jpg', order_index: 9 },
    { category: 'Nhu cầu cơ bản', title: 'Đói', image_url: 'doi.jpg', order_index: 10 },
    { category: 'Nhu cầu cơ bản', title: 'Khát', image_url: 'khat.jpg', order_index: 11 },
    { category: 'Nhu cầu cơ bản', title: 'Mệt', image_url: 'met.jpg', order_index: 12 },
    { category: 'Nhu cầu cơ bản', title: 'Đau', image_url: 'dau.jpg', order_index: 13 },
    { category: 'Nhu cầu cơ bản', title: 'Nóng', image_url: 'nong.jpg', order_index: 14 },
    { category: 'Nhu cầu cơ bản', title: 'Lạnh', image_url: 'lanh.jpg', order_index: 15 },
    { category: 'Nhu cầu cơ bản', title: 'Giúp đỡ', image_url: 'giup_do.jpg', order_index: 16 },

    // CẢM XÚC (12 thẻ)
    { category: 'Cảm xúc', title: 'Vui', image_url: 'vui.jpg', order_index: 1 },
    { category: 'Cảm xúc', title: 'Buồn', image_url: 'buon.jpg', order_index: 2 },
    { category: 'Cảm xúc', title: 'Giận', image_url: 'gian.jpg', order_index: 3 },
    { category: 'Cảm xúc', title: 'Sợ', image_url: 'so.jpg', order_index: 4 },
    { category: 'Cảm xúc', title: 'Yêu', image_url: 'yeu.jpg', order_index: 5 },
    { category: 'Cảm xúc', title: 'Thích', image_url: 'thich.jpg', order_index: 6 },
    { category: 'Cảm xúc', title: 'Ghét', image_url: 'ghet.jpg', order_index: 7 },
    { category: 'Cảm xúc', title: 'Bực mình', image_url: 'buc_minh.jpg', order_index: 8 },
    { category: 'Cảm xúc', title: 'Lo lắng', image_url: 'lo_lang.jpg', order_index: 9 },
    { category: 'Cảm xúc', title: 'Bình thường', image_url: 'binh_thuong.jpg', order_index: 10 },
    { category: 'Cảm xúc', title: 'Hạnh phúc', image_url: 'hanh_phuc.jpg', order_index: 11 },
    { category: 'Cảm xúc', title: 'Nhớ', image_url: 'nho.jpg', order_index: 12 },

    // HOẠT ĐỘNG (20 thẻ)
    { category: 'Hoạt động', title: 'Chơi', image_url: 'choi.jpg', order_index: 1 },
    { category: 'Hoạt động', title: 'Học', image_url: 'hoc.jpg', order_index: 2 },
    { category: 'Hoạt động', title: 'Đọc sách', image_url: 'doc_sach.jpg', order_index: 3 },
    { category: 'Hoạt động', title: 'Vẽ', image_url: 've.jpg', order_index: 4 },
    { category: 'Hoạt động', title: 'Hát', image_url: 'hat.jpg', order_index: 5 },
    { category: 'Hoạt động', title: 'Nhảy', image_url: 'nhay.jpg', order_index: 6 },
    { category: 'Hoạt động', title: 'Chạy', image_url: 'chay.jpg', order_index: 7 },
    { category: 'Hoạt động', title: 'Nhảy dây', image_url: 'nhay_day.jpg', order_index: 8 },
    { category: 'Hoạt động', title: 'Xem TV', image_url: 'xem_tv.jpg', order_index: 9 },
    { category: 'Hoạt động', title: 'Nghe nhạc', image_url: 'nghe_nhac.jpg', order_index: 10 },
    { category: 'Hoạt động', title: 'Nấu ăn', image_url: 'nau_an.jpg', order_index: 11 },
    { category: 'Hoạt động', title: 'Dọn dẹp', image_url: 'don_dep.jpg', order_index: 12 },
    { category: 'Hoạt động', title: 'Làm vườn', image_url: 'lam_vuon.jpg', order_index: 13 },
    { category: 'Hoạt động', title: 'Đi dạo', image_url: 'di_dao.jpg', order_index: 14 },
    { category: 'Hoạt động', title: 'Đi xe đạp', image_url: 'di_xe_dap.jpg', order_index: 15 },
    { category: 'Hoạt động', title: 'Bơi', image_url: 'boi.jpg', order_index: 16 },
    { category: 'Hoạt động', title: 'Đá bóng', image_url: 'da_bong.jpg', order_index: 17 },
    { category: 'Hoạt động', title: 'Chụp ảnh', image_url: 'chup_anh.jpg', order_index: 18 },
    { category: 'Hoạt động', title: 'Nói chuyện', image_url: 'noi_chuyen.jpg', order_index: 19 },
    { category: 'Hoạt động', title: 'Nghỉ ngơi', image_url: 'nghi_ngoi.jpg', order_index: 20 },

    // NGƯỜI THÂN (17 thẻ)
    { category: 'Người thân', title: 'Mẹ', image_url: 'me.jpg', order_index: 1 },
    { category: 'Người thân', title: 'Bố', image_url: 'bo.jpg', order_index: 2 },
    { category: 'Người thân', title: 'Anh', image_url: 'anh.jpg', order_index: 3 },
    { category: 'Người thân', title: 'Chị', image_url: 'chi.jpg', order_index: 4 },
    { category: 'Người thân', title: 'Em', image_url: 'em.jpg', order_index: 5 },
    { category: 'Người thân', title: 'Ông', image_url: 'ong.jpg', order_index: 6 },
    { category: 'Người thân', title: 'Bà', image_url: 'ba.jpg', order_index: 7 },
    { category: 'Người thân', title: 'Bác', image_url: 'bac.jpg', order_index: 8 },
    { category: 'Người thân', title: 'Cô', image_url: 'co.jpg', order_index: 9 },
    { category: 'Người thân', title: 'Chú', image_url: 'chu.jpg', order_index: 10 },
    { category: 'Người thân', title: 'Cậu', image_url: 'cau.jpg', order_index: 11 },
    { category: 'Người thân', title: 'Dì', image_url: 'di.jpg', order_index: 12 },
    { category: 'Người thân', title: 'Bạn', image_url: 'ban.jpg', order_index: 13 },
    { category: 'Người thân', title: 'Thầy giáo', image_url: 'thay_giao.jpg', order_index: 14 },
    { category: 'Người thân', title: 'Cô giáo', image_url: 'co_giao.jpg', order_index: 15 },
    { category: 'Người thân', title: 'Bác sĩ', image_url: 'bac_si.jpg', order_index: 16 },
    { category: 'Người thân', title: 'Con', image_url: 'con.jpg', order_index: 17 },

    // ĐỊA ĐIỂM (15 thẻ)
    { category: 'Địa điểm', title: 'Nhà', image_url: 'nha.jpg', order_index: 1 },
    { category: 'Địa điểm', title: 'Phòng ngủ', image_url: 'phong_ngu.jpg', order_index: 2 },
    { category: 'Địa điểm', title: 'Nhà tắm', image_url: 'nha_tam.jpg', order_index: 3 },
    { category: 'Địa điểm', title: 'Bếp', image_url: 'bep.jpg', order_index: 4 },
    { category: 'Địa điểm', title: 'Trường', image_url: 'truong.jpg', order_index: 5 },
    { category: 'Địa điểm', title: 'Công viên', image_url: 'cong_vien.jpg', order_index: 6 },
    { category: 'Địa điểm', title: 'Bệnh viện', image_url: 'benh_vien.jpg', order_index: 7 },
    { category: 'Địa điểm', title: 'Siêu thị', image_url: 'sieu_thi.jpg', order_index: 8 },
    { category: 'Địa điểm', title: 'Nhà hàng', image_url: 'nha_hang.jpg', order_index: 9 },
    { category: 'Địa điểm', title: 'Sân chơi', image_url: 'san_choi.jpg', order_index: 10 },
    { category: 'Địa điểm', title: 'Thư viện', image_url: 'thu_vien.jpg', order_index: 11 },
    { category: 'Địa điểm', title: 'Biển', image_url: 'bien.jpg', order_index: 12 },
    { category: 'Địa điểm', title: 'Núi', image_url: 'nui.jpg', order_index: 13 },
    { category: 'Địa điểm', title: 'Rạp phim', image_url: 'rap_phim.jpg', order_index: 14 },
    { category: 'Địa điểm', title: 'Nhà bạn', image_url: 'nha_ban.jpg', order_index: 15 },

    // ĐỒ VẬT (20 thẻ)
    { category: 'Đồ vật', title: 'Bóng', image_url: 'bong.jpg', order_index: 1 },
    { category: 'Đồ vật', title: 'Sách', image_url: 'sach.jpg', order_index: 2 },
    { category: 'Đồ vật', title: 'Điện thoại', image_url: 'dien_thoai.jpg', order_index: 3 },
    { category: 'Đồ vật', title: 'Đồ chơi', image_url: 'do_choi.jpg', order_index: 4 },
    { category: 'Đồ vật', title: 'Bút', image_url: 'but.jpg', order_index: 5 },
    { category: 'Đồ vật', title: 'Vở', image_url: 'vo.jpg', order_index: 6 },
    { category: 'Đồ vật', title: 'Cặp', image_url: 'cap.jpg', order_index: 7 },
    { category: 'Đồ vật', title: 'Quần', image_url: 'quan.jpg', order_index: 8 },
    { category: 'Đồ vật', title: 'Áo', image_url: 'ao.jpg', order_index: 9 },
    { category: 'Đồ vật', title: 'Giày', image_url: 'giay.jpg', order_index: 10 },
    { category: 'Đồ vật', title: 'Cốc', image_url: 'coc.jpg', order_index: 11 },
    { category: 'Đồ vật', title: 'Bàn chải', image_url: 'ban_chai.jpg', order_index: 12 },
    { category: 'Đồ vật', title: 'Kem đánh răng', image_url: 'kem_danh_rang.jpg', order_index: 13 },
    { category: 'Đồ vật', title: 'Khăn', image_url: 'khan.jpg', order_index: 14 },
    { category: 'Đồ vật', title: 'Gối', image_url: 'goi.jpg', order_index: 15 },
    { category: 'Đồ vật', title: 'Chăn', image_url: 'chan.jpg', order_index: 16 },
    { category: 'Đồ vật', title: 'TV', image_url: 'tv.jpg', order_index: 17 },
    { category: 'Đồ vật', title: 'Xe đạp', image_url: 'xe_dap.jpg', order_index: 18 },
    { category: 'Đồ vật', title: 'Máy tính', image_url: 'may_tinh.jpg', order_index: 19 },
    { category: 'Đồ vật', title: 'Nón', image_url: 'non.jpg', order_index: 20 },
  ];

  console.log(`\n📝 Đang thêm ${organizedCards.length} thẻ đã sắp xếp...\n`);

  let successCount = 0;
  let currentCategory = '';

  for (const card of organizedCards) {
    const categoryId = categoryMap.get(card.category);

    if (card.category !== currentCategory) {
      currentCategory = card.category;
      console.log(`\n📂 ${card.category.toUpperCase()}:`);
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
      console.log(`  ❌ "${card.title}": ${error.message}`);
    } else {
      successCount++;
      console.log(`  ✓ ${card.order_index}. ${card.title}`);
    }
  }

  console.log(`\n✅ Đã thêm thành công ${successCount}/${organizedCards.length} thẻ!`);

  // Tổng kết
  console.log('\n📊 TỔNG KẾT:');
  for (const cat of categories) {
    const { count } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', cat.id);
    console.log(`  ${cat.name}: ${count} thẻ`);
  }

  const { count: total } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true });
  console.log(`\n  TỔNG CỘNG: ${total} thẻ`);
}

reorganizeCards();
