import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

interface SeedData {
  categories: Array<{
    name: string;
    icon: string;
    color: string;
    cards: Array<{
      title: string;
      image_url: string;
    }>;
  }>;
}

const seedData: SeedData = {
  categories: [
    {
      name: 'Nhu cầu cơ bản',
      icon: '🍽️',
      color: '#FF6B6B',
      cards: [
        { title: 'Ăn', image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Uống', image_url: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Uống nước', image_url: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Uống sữa', image_url: 'https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Ngủ', image_url: 'https://images.pexels.com/photos/271897/pexels-photo-271897.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Đi vệ sinh', image_url: 'https://images.pexels.com/photos/7534555/pexels-photo-7534555.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Tắm', image_url: 'https://images.pexels.com/photos/7129713/pexels-photo-7129713.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Giúp đỡ', image_url: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400' },
      ],
    },
    {
      name: 'Cảm xúc',
      icon: '😊',
      color: '#4ECDC4',
      cards: [
        { title: 'Vui', image_url: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Buồn', image_url: 'https://images.pexels.com/photos/3807738/pexels-photo-3807738.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Giận', image_url: 'https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Sợ', image_url: 'https://images.pexels.com/photos/3601097/pexels-photo-3601097.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Yêu', image_url: 'https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Mệt', image_url: 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Đau', image_url: 'https://images.pexels.com/photos/3807733/pexels-photo-3807733.jpeg?auto=compress&cs=tinysrgb&w=400' },
      ],
    },
    {
      name: 'Hoạt động',
      icon: '⚽',
      color: '#95E1D3',
      cards: [
        { title: 'Chơi', image_url: 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Đọc sách', image_url: 'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Xem TV', image_url: 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Vẽ', image_url: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Nhảy múa', image_url: 'https://images.pexels.com/photos/4473622/pexels-photo-4473622.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Hát', image_url: 'https://images.pexels.com/photos/7520391/pexels-photo-7520391.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Chạy', image_url: 'https://images.pexels.com/photos/1648023/pexels-photo-1648023.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Đi dạo', image_url: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400' },
      ],
    },
    {
      name: 'Người thân',
      icon: '👨‍👩‍👧',
      color: '#F38181',
      cards: [
        { title: 'Mẹ', image_url: 'https://images.pexels.com/photos/3997370/pexels-photo-3997370.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Bố', image_url: 'https://images.pexels.com/photos/1363876/pexels-photo-1363876.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Bà', image_url: 'https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Ông', image_url: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Anh', image_url: 'https://images.pexels.com/photos/1212805/pexels-photo-1212805.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Chị', image_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Em', image_url: 'https://images.pexels.com/photos/1257110/pexels-photo-1257110.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Bạn', image_url: 'https://images.pexels.com/photos/3661263/pexels-photo-3661263.jpeg?auto=compress&cs=tinysrgb&w=400' },
      ],
    },
    {
      name: 'Địa điểm',
      icon: '🏠',
      color: '#AA96DA',
      cards: [
        { title: 'Nhà', image_url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Trường', image_url: 'https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Công viên', image_url: 'https://images.pexels.com/photos/164193/pexels-photo-164193.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Bệnh viện', image_url: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Siêu thị', image_url: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Phòng ngủ', image_url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Phòng tắm', image_url: 'https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Bếp', image_url: 'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=400' },
      ],
    },
    {
      name: 'Đồ vật',
      icon: '🧸',
      color: '#FCBAD3',
      cards: [
        { title: 'Đồ chơi', image_url: 'https://images.pexels.com/photos/163444/toy-car-bus-truck-163444.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Gấu bông', image_url: 'https://images.pexels.com/photos/265979/pexels-photo-265979.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Bóng', image_url: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Bút màu', image_url: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Sách', image_url: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Điện thoại', image_url: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Bình nước', image_url: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { title: 'Cặp sách', image_url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400' },
      ],
    },
  ],
};

async function seedDatabase() {
  console.log('Đang thêm dữ liệu vào database...');

  const results = {
    categoriesCreated: 0,
    cardsCreated: 0,
    errors: [] as string[],
  };

  for (let i = 0; i < seedData.categories.length; i++) {
    const categoryData = seedData.categories[i];

    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryData.name)
      .maybeSingle();

    let categoryId: string;

    if (existingCategory) {
      categoryId = existingCategory.id;
      console.log(`✓ Danh mục "${categoryData.name}" đã tồn tại`);
    } else {
      const { data: newCategory, error: categoryError } = await supabase
        .from('categories')
        .insert({
          name: categoryData.name,
          icon: categoryData.icon,
          color: categoryData.color,
          order_index: i,
        })
        .select('id')
        .single();

      if (categoryError) {
        results.errors.push(`Category ${categoryData.name}: ${categoryError.message}`);
        console.error(`✗ Lỗi tạo danh mục "${categoryData.name}":`, categoryError.message);
        continue;
      }

      categoryId = newCategory.id;
      results.categoriesCreated++;
      console.log(`✓ Đã tạo danh mục "${categoryData.name}"`);
    }

    for (let j = 0; j < categoryData.cards.length; j++) {
      const cardData = categoryData.cards[j];

      const { data: existingCard } = await supabase
        .from('cards')
        .select('id')
        .eq('category_id', categoryId)
        .eq('title', cardData.title)
        .maybeSingle();

      if (!existingCard) {
        const { error: cardError } = await supabase
          .from('cards')
          .insert({
            category_id: categoryId,
            title: cardData.title,
            image_url: cardData.image_url,
            is_custom: false,
            order_index: j,
          });

        if (cardError) {
          results.errors.push(`Card ${cardData.title}: ${cardError.message}`);
          console.error(`  ✗ Lỗi tạo thẻ "${cardData.title}":`, cardError.message);
        } else {
          results.cardsCreated++;
          console.log(`  ✓ Đã tạo thẻ "${cardData.title}"`);
        }
      } else {
        console.log(`  ✓ Thẻ "${cardData.title}" đã tồn tại`);
      }
    }
  }

  console.log('\n=== KẾT QUẢ ===');
  console.log(`Danh mục mới: ${results.categoriesCreated}`);
  console.log(`Thẻ mới: ${results.cardsCreated}`);
  if (results.errors.length > 0) {
    console.log(`Lỗi: ${results.errors.length}`);
    results.errors.forEach((err) => console.error(`  - ${err}`));
  }
  console.log('\nHoàn tất!');
}

seedDatabase().catch(console.error);
