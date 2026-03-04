-- ============================================================================
-- SQL COMMANDS ĐỂ CẬP NHẬT CÁC THẺ CẦN SỬA
-- ============================================================================
-- Hướng dẫn: Tìm hình ảnh phù hợp từ Pexels rồi thay [URL_MỚI] bằng URL thực
-- ============================================================================

-- ----------------------------------------------------------------------------
-- MỨC ĐỘ ƯU TIÊN CAO - SỬA NGAY
-- ----------------------------------------------------------------------------

-- 1. ÔNG (SAI HOÀN TOÀN - HÌNH LÀ PHỤ NỮ!)
-- Cần: Hình đàn ông cao tuổi (ông nội/ông ngoại)
-- Từ khóa tìm trên Pexels: "elderly man", "grandfather", "old man smiling"
UPDATE cards
SET image_url = '[URL_HÌNH_ÔNG_CAO_TUỔI]'
WHERE id = '2cdceb1a-a6d5-4ca0-a969-964849239dab';

-- 2. MẸ (THIẾU YẾU TỐ QUAN TRỌNG - KHÔNG CÓ CON)
-- Cần: Hình mẹ với con (ôm, chăm sóc, tương tác)
-- Từ khóa tìm trên Pexels: "mother child", "mom baby", "mother hugging child"
UPDATE cards
SET image_url = '[URL_HÌNH_MẸ_VÀ_CON]'
WHERE id = '1f6d12ee-df7e-4349-94e4-8b5fb444fb83';

-- 3. BỐ (THIẾU YẾU TỐ QUAN TRỌNG - KHÔNG CÓ CON)
-- Cần: Hình bố với con (chơi, bồng bế, chăm sóc)
-- Từ khóa tìm trên Pexels: "father child", "dad baby", "father playing child"
UPDATE cards
SET image_url = '[URL_HÌNH_BỐ_VÀ_CON]'
WHERE id = '9dcb42f3-5643-4a16-907e-ba5eb33feeda';

-- 4. SỢ (SAI HOÀN TOÀN - HÌNH CỬA TRANG TRÍ)
-- Cần: Hình thể hiện cảm xúc sợ hãi
-- Từ khóa tìm trên Pexels: "scared child", "afraid face", "frightened kid"
UPDATE cards
SET image_url = '[URL_HÌNH_CẢM_XÚC_SỢ_HÃI]'
WHERE id = '8ae6cc64-7aeb-4dc5-8ec0-311fa2bd4d1a';

-- ----------------------------------------------------------------------------
-- MỨC ĐỘ ƯU TIÊN TRUNG BÌNH - SỬA TRONG TUẦN
-- ----------------------------------------------------------------------------

-- 5. ANH (SAI ĐỐI TƯỢNG - HÌNH TRẺ EM THAY VÌ THANH NIÊN)
-- Cần: Hình nam thanh niên/anh trai
-- Từ khóa tìm trên Pexels: "young man", "teenage boy", "older brother"
UPDATE cards
SET image_url = '[URL_HÌNH_ANH_TRAI_THANH_NIÊN]'
WHERE id = 'b292cce4-2b69-4a84-8f5e-c4f030b1aef2';

-- 6. TẮM (SAI HOẠT ĐỘNG - HÌNH NGƯỜI LÀM VIỆC)
-- Cần: Hình hoạt động tắm (trẻ em tắm hoặc đồ dùng tắm)
-- Từ khóa tìm trên Pexels: "child bathing", "kid shower", "bath time", "bathtub"
UPDATE cards
SET image_url = '[URL_HÌNH_TẮM]'
WHERE id = '3f989659-1a11-4feb-b419-16c3aac10258';

-- 7. GIẬN (SAI CẢM XÚC - HÌNH NGƯỜI NGỦ)
-- Cần: Hình thể hiện cảm xúc giận dữ
-- Từ khóa tìm trên Pexels: "angry child", "mad face", "upset kid", "angry expression"
UPDATE cards
SET image_url = '[URL_HÌNH_CẢM_XÚC_GIẬN]'
WHERE id = 'b8bd710e-5547-4500-8bb4-4d3319be3a5c';

-- 8. BẠN (KHÔNG RÕ KHÁI NIỆM - CHỈ MỘT TRẺ)
-- Cần: Hình nhiều trẻ em chơi cùng nhau
-- Từ khóa tìm trên Pexels: "children playing together", "kids friends", "children group"
UPDATE cards
SET image_url = '[URL_HÌNH_BẠN_BÈ]'
WHERE id = 'd332d496-a389-4852-b659-b1bbd2cf6b84';

-- ----------------------------------------------------------------------------
-- THẺ CÓ URL LOCAL - CẦN ĐỔI SANG URL CÔNG KHAI
-- ----------------------------------------------------------------------------

-- 9. CHAI NƯỚC
-- Từ khóa tìm trên Pexels: "water bottle"
UPDATE cards
SET image_url = '[URL_HÌNH_CHAI_NƯỚC]'
WHERE id = 'b3e279b7-e163-49b7-939b-75dac793eb83';

-- 10. MÀN HÌNH
-- Từ khóa tìm trên Pexels: "computer screen", "monitor", "display screen"
UPDATE cards
SET image_url = '[URL_HÌNH_MÀN_HÌNH]'
WHERE id = 'b25ad45a-8e7e-47d5-8e64-29e83f6bd0d3';

-- ============================================================================
-- GỢI Ý HÌNH ẢNH CỤ THỂ TỪ PEXELS (Đã kiểm tra sẵn)
-- ============================================================================

-- MẸ - Gợi ý tốt:
-- https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg (mẹ ôm con)
-- https://images.pexels.com/photos/5637736/pexels-photo-5637736.jpeg (mẹ với bé)

-- BỐ - Gợi ý tốt:
-- https://images.pexels.com/photos/1497394/pexels-photo-1497394.jpeg (bố với con)
-- https://images.pexels.com/photos/5571824/pexels-photo-5571824.jpeg (bố bồng con)

-- ÔNG - Gợi ý tốt:
-- https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg (ông già)
-- https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg (ông cười)

-- SỢ - Gợi ý tốt:
-- https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg (trẻ em sợ)
-- https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg (biểu cảm sợ)

-- GIẬN - Gợi ý tốt:
-- https://images.pexels.com/photos/4473622/pexels-photo-4473622.jpeg (trẻ em cau có)

-- BẠN - Gợi ý tốt:
-- https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg (trẻ em chơi cùng)
-- https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg (2 trẻ đi dạo)

-- ============================================================================
-- CÁCH SỬ DỤNG VỚI SUPABASE
-- ============================================================================

/*
Cách 1: Dùng Supabase Dashboard
1. Vào https://seoxgqnatjmxcnxzzumc.supabase.co
2. Vào Table Editor > cards
3. Tìm thẻ theo ID hoặc title
4. Edit và paste URL mới vào cột image_url

Cách 2: Dùng SQL Editor trên Supabase
1. Vào SQL Editor
2. Copy-paste các lệnh UPDATE ở trên (đã thay URL)
3. Run query

Cách 3: Dùng cURL từ terminal
curl -X PATCH "https://seoxgqnatjmxcnxzzumc.supabase.co/rest/v1/cards?id=eq.ID_CỦA_THẺ" \
  -H "apikey: YOUR_API_KEY" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"image_url": "URL_MỚI"}'
*/

-- ============================================================================
-- LƯU Ý QUAN TRỌNG
-- ============================================================================

/*
1. Trước khi cập nhật, hãy mở URL hình ảnh mới để XEM TRƯỚC
2. Đảm bảo URL có định dạng: https://images.pexels.com/photos/...
3. Nên thêm ?auto=compress&cs=tinysrgb&w=400 vào cuối URL để tối ưu tốc độ
4. Test trên 1-2 thẻ trước khi cập nhật hàng loạt
5. Lưu backup dữ liệu cũ trước khi cập nhật

QUAN TRỌNG NHẤT:
- Các thẻ GIA ĐÌNH (Mẹ, Bố, Ông, Bà) là ƯU TIÊN HÀNG ĐẦU
- Trẻ em dùng các thẻ này hàng ngày để giao tiếp với người thân
- Hình ảnh phải CHÍNH XÁC và DỄ HIỂU
*/
