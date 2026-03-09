import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://seoxgqnatjmxcnxzzumc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlb3hncW5hdGpteGNueHp6dW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzY5MDAsImV4cCI6MjA4NTU1MjkwMH0.6aIcvU41x3TU4DmmODesD4K2RApQTOMpr5H3p5cPtf0';

const supabase = createClient(supabaseUrl, supabaseKey);

const existingImages = [
  'anh.jpg', 'ba.jpg', 'ban.jpg', 'bo.jpg', 'buon.jpg', 'chi.jpg',
  'choi.jpg', 'doc_sach.jpg', 'em.jpg', 'gian.jpg', 'me.jpg', 'ngu.jpg',
  'ong.jpg', 'so.jpg', 'tam.jpg', 'uong_nuoc.jpg', 'vui.jpg', 'yeu.jpg'
];

async function getMissingImages() {
  const { data: cards } = await supabase
    .from('cards')
    .select('title, image_url')
    .order('title');

  const missingCards = cards.filter(card => !existingImages.includes(card.image_url));

  console.log(`\n📋 CẦN TẢI ${missingCards.length} ẢNH:\n`);

  const grouped = {};
  for (const card of missingCards) {
    const filename = card.image_url;
    if (!grouped[filename]) {
      grouped[filename] = [];
    }
    grouped[filename].push(card.title);
  }

  const imageList = [];
  for (const [filename, titles] of Object.entries(grouped)) {
    console.log(`${filename.padEnd(25)} → ${titles.join(', ')}`);
    imageList.push({
      filename,
      title: titles[0],
      searchQuery: titles[0]
    });
  }

  fs.writeFileSync('missing-images.json', JSON.stringify(imageList, null, 2));
  console.log(`\n✅ Đã lưu danh sách vào missing-images.json`);
}

getMissingImages();
