import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://seoxgqnatjmxcnxzzumc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlb3hncW5hdGpteGNueHp6dW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzY5MDAsImV4cCI6MjA4NTU1MjkwMH0.6aIcvU41x3TU4DmmODesD4K2RApQTOMpr5H3p5cPtf0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteMetCard() {
  const { data: card, error: findError } = await supabase
    .from('cards')
    .select('*')
    .eq('title', 'Mệt')
    .maybeSingle();

  if (findError) {
    console.error('Lỗi tìm thẻ:', findError);
    return;
  }

  if (!card) {
    console.log('Không tìm thấy thẻ "Mệt"');
    return;
  }

  console.log('Tìm thấy thẻ:', card);

  const { error: deleteError } = await supabase
    .from('cards')
    .delete()
    .eq('id', card.id);

  if (deleteError) {
    console.error('Lỗi xóa thẻ:', deleteError);
    return;
  }

  console.log('✅ Đã xóa thẻ "Mệt" thành công!');
}

deleteMetCard();
