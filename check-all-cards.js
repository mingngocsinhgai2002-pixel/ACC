import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://seoxgqnatjmxcnxzzumc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlb3hncW5hdGpteGNueHp6dW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzY5MDAsImV4cCI6MjA4NTU1MjkwMH0.6aIcvU41x3TU4DmmODesD4K2RApQTOMpr5H3p5cPtf0';

const supabase = createClient(supabaseUrl, supabaseKey);

// Mô tả chính xác cho mỗi thẻ
const correctDescriptions = {
  'Ông': 'elderly Asian man (ông - grandfather)',
  'Bà': 'elderly Asian woman (bà - grandmother)',
  'Mẹ': 'Asian mother with child',
  'Bố': 'Asian father with child',
  'Anh': 'young Asian man / older brother',
  'Chị': 'young Asian woman / older sister',
  'Em': 'young child / younger sibling',
  'Buồn': 'sad face / crying child',
  'Vui': 'happy smiling child',
  'Sợ': 'scared / frightened child face',
  'Giận': 'angry child face',
  'Yêu': 'love / hugging / affection',
  'Ăn': 'eating / child eating food',
  'Uống nước': 'drinking water',
  'Ngủ': 'sleeping child',
  'Tắm': 'bathing / shower / washing',
  'Chơi': 'playing / children playing',
  'Đọc sách': 'reading book',
  'Bạn': 'friends playing together',
  'Nhà': 'house / home',
  'Trường': 'school building',
  'Công viên': 'park / playground',
  'Bệnh viện': 'hospital building',
  'Siêu thị': 'supermarket / grocery store',
  'Nhà hàng': 'restaurant',
  'Sân bay': 'airport',
  'Bãi biển': 'beach / ocean',
  'Núi': 'mountain',
  'Sông': 'river',
  'Chai nước': 'water bottle',
  'Màn Hình': 'screen / computer monitor / display',
};

async function checkAllCards() {
  const { data: cards, error } = await supabase
    .from('cards')
    .select('id, title, image_url, category_id')
    .order('title', { ascending: true });

  if (error) {
    console.error('Lỗi:', error);
    return;
  }

  console.log('\n📋 TẤT CẢ CÁC THẺ TRONG DATABASE:\n');
  console.log('═'.repeat(100));

  let issues = [];

  for (const card of cards) {
    const description = correctDescriptions[card.title] || 'KHÔNG CÓ MÔ TẢ';
    console.log(`\n${card.title}`);
    console.log(`  ✓ Cần: ${description}`);
    console.log(`  📷 URL: ${card.image_url}`);

    // Check for potential issues
    if (card.image_url.includes('file://') || card.image_url.includes('localhost')) {
      issues.push({ title: card.title, issue: 'URL local không hợp lệ', url: card.image_url });
    } else if (card.image_url.includes('/images/')) {
      issues.push({ title: card.title, issue: 'Đang dùng ảnh local trong project', url: card.image_url });
    }
  }

  console.log('\n' + '═'.repeat(100));
  console.log(`\n📊 TỔNG SỐ: ${cards.length} thẻ\n`);

  if (issues.length > 0) {
    console.log('⚠️  CÁC THẺ CÓ VẤN ĐỀ:\n');
    issues.forEach(item => {
      console.log(`❌ ${item.title}`);
      console.log(`   Vấn đề: ${item.issue}`);
      console.log(`   URL: ${item.url}\n`);
    });
  } else {
    console.log('✅ Tất cả thẻ đều dùng URL hợp lệ');
  }

  console.log('═'.repeat(100));
  console.log('\n💬 Hãy cho tôi biết thẻ nào HÌNH ẢNH KHÔNG ĐÚNG với tên thẻ!');
  console.log('   Ví dụ: "Thẻ Ông đang là hình gì? Không phải ông"');
  console.log('   Hoặc: "Thẻ Bạn sai rồi, đang là hình X chứ không phải bạn bè"\n');
}

checkAllCards();
