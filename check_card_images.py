#!/usr/bin/env python3
"""
Script to verify AAC card images match their titles
"""
import requests
import json
import base64
from anthropic import Anthropic
import os
import time

# Initialize Anthropic client
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# Database connection info
SUPABASE_URL = "https://seoxgqnatjmxcnxzzumc.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlb3hncW5hdGpteGNueHp6dW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzY5MDAsImV4cCI6MjA4NTU1MjkwMH0.6aIcvU41x3TU4DmmODesD4K2RApQTOMpr5H3p5cPtf0"

# Cards data from query
cards_data = [
    {"id":"b3e279b7-e163-49b7-939b-75dac793eb83","title":"Chai nước","image_url":"file:///data/user/0/host.exp.exponent/cache/ImagePicker/5131d566-db93-45b2-ba9b-9baae05fee82.jpeg"},
    {"id":"b25ad45a-8e7e-47d5-8e64-29e83f6bd0d3","title":"Màn Hình","image_url":"file:///data/user/0/host.exp.exponent/cache/ImagePicker/d258e256-8dcf-4b5e-966a-af35185653e8.jpeg"},
    {"id":"d74febd6-b689-47ff-88b8-fd5a87928c07","title":"Uống nước","image_url":"https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"b2b690a7-07f1-4c33-a8df-1be81cdc931f","title":"Uống sữa","image_url":"https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"3f989659-1a11-4feb-b419-16c3aac10258","title":"Tắm","image_url":"https://images.pexels.com/photos/7129713/pexels-photo-7129713.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"63450f43-8746-45ab-aeb7-28dede22ef82","title":"Giúp đỡ","image_url":"https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"ebe39251-46e5-4b4c-8538-360f234558f4","title":"Yêu","image_url":"https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"727a0274-c5ef-4e8b-aee9-6d1bb13d1014","title":"Mệt","image_url":"https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"ba5043dc-9bd8-4880-a9dd-864a79b76904","title":"Đau","image_url":"https://images.pexels.com/photos/3807733/pexels-photo-3807733.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"25632e11-c7dd-43ae-aede-131217780baf","title":"Chơi","image_url":"https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"400ed032-f911-43de-a5cc-ab2a7f4c0389","title":"Đọc sách","image_url":"https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"3ba0f85b-8f46-4bed-9bef-8b3a40be99dd","title":"Xem TV","image_url":"https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"7a37ee4c-d1bd-4129-8810-ad95131fc19a","title":"Vẽ","image_url":"https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"e8772913-c5e6-4604-9339-cc3aac417f85","title":"Nhảy múa","image_url":"https://images.pexels.com/photos/4473622/pexels-photo-4473622.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"8971f048-cf40-4a9f-95b1-d68e8e57d7af","title":"Hát","image_url":"https://images.pexels.com/photos/7520391/pexels-photo-7520391.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"66abe5a4-3606-4a90-834a-6389d4209226","title":"Chạy","image_url":"https://images.pexels.com/photos/1648023/pexels-photo-1648023.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"9394771e-db6c-4338-9ebf-fa8c83ffd9ba","title":"Đi dạo","image_url":"https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"9535017f-98f8-42ea-a7d4-2738670efba7","title":"Bà","image_url":"https://images.pexels.com/photos/3768114/pexels-photo-3768114.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"2cdceb1a-a6d5-4ca0-a969-964849239dab","title":"Ông","image_url":"https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"b292cce4-2b69-4a84-8f5e-c4f030b1aef2","title":"Anh","image_url":"https://images.pexels.com/photos/1212805/pexels-photo-1212805.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"5198e9f7-5a3c-4387-99fa-0465bd12854c","title":"Chị","image_url":"https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"b377b1ca-18d4-444b-8aa9-964446c73992","title":"Em","image_url":"https://images.pexels.com/photos/1257110/pexels-photo-1257110.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"d332d496-a389-4852-b659-b1bbd2cf6b84","title":"Bạn","image_url":"https://images.pexels.com/photos/3661263/pexels-photo-3661263.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"77a53dc3-8729-47f0-9825-9cc5e4e87987","title":"Nhà","image_url":"https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"28709727-0bbd-48f2-8c58-319c23741aa3","title":"Trường","image_url":"https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"1d6c3e42-8de5-4998-a3f2-c5d5262db5b4","title":"Công viên","image_url":"https://images.pexels.com/photos/164193/pexels-photo-164193.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"81c37484-dc48-4892-83ec-2b9944d8ee5c","title":"Bệnh viện","image_url":"https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"4f2be605-2972-441d-a79f-591ee6f5bd83","title":"Siêu thị","image_url":"https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"564574ac-fdd3-4dac-92a1-d68d851284b4","title":"Phòng ngủ","image_url":"https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"ff0b7635-963f-40f4-8adf-57f81baad879","title":"Phòng tắm","image_url":"https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"cb881ba0-f933-4d5c-a679-59f394a8af3c","title":"Bếp","image_url":"https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"6039a94c-f675-420a-b328-28bf60304da8","title":"Ngủ","image_url":"https://images.pexels.com/photos/1912868/pexels-photo-1912868.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"72bc43da-0f14-4947-b607-f752707ccb8f","title":"Đi vệ sinh","image_url":"https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"4fddc5bf-2965-4508-a8db-c3182291d6eb","title":"Vui","image_url":"https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"e9780974-89fe-4410-8fcd-cb1ac84af82a","title":"Buồn","image_url":"https://images.pexels.com/photos/1346155/pexels-photo-1346155.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"b8bd710e-5547-4500-8bb4-4d3319be3a5c","title":"Giận","image_url":"https://images.pexels.com/photos/4473864/pexels-photo-4473864.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"8ae6cc64-7aeb-4dc5-8ec0-311fa2bd4d1a","title":"Sợ","image_url":"https://images.pexels.com/photos/4596090/pexels-photo-4596090.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"1f6d12ee-df7e-4349-94e4-8b5fb444fb83","title":"Mẹ","image_url":"https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"9dcb42f3-5643-4a16-907e-ba5eb33feeda","title":"Bố","image_url":"https://images.pexels.com/photos/3850213/pexels-photo-3850213.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"4187d9cf-5b12-4313-a33f-7c5da3cde28e","title":"Đồ chơi","image_url":"https://images.pexels.com/photos/163444/toy-car-bus-truck-163444.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"3c6e50bc-01f1-4d63-85d4-581f20c5ed5d","title":"Gấu bông","image_url":"https://images.pexels.com/photos/265979/pexels-photo-265979.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"249f9928-72b3-4b6d-83c8-fb1638dc4ec4","title":"Bóng","image_url":"https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"bb759abf-0355-4059-b439-5e6c0d13a812","title":"Bút màu","image_url":"https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"7e6eec27-ee95-40eb-b9f7-72f677c26834","title":"Sách","image_url":"https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"eef73304-c4db-4017-9b65-870b5661265d","title":"Điện thoại","image_url":"https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"a5eaf74e-a4d7-48a9-ab64-7ad5d329e12c","title":"Bình nước","image_url":"https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"6a519d5e-fe7d-4315-a365-f1f3506a109a","title":"Cặp sách","image_url":"https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"5ea37611-a01c-4bcc-8b18-208da9bac688","title":"Ăn","image_url":"https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400"},
    {"id":"719ada75-5bd7-41e5-bc3d-770327df1db7","title":"Uống","image_url":"https://images.pexels.com/photos/296308/pexels-photo-296308.jpeg?auto=compress&cs=tinysrgb&w=400"}
]

def check_image(card):
    """Check if image matches the card title"""
    title = card['title']
    image_url = card['image_url']

    # Skip local file URLs (file://)
    if image_url.startswith('file://'):
        return {
            'status': 'broken',
            'reason': 'URL là file local, không thể truy cập từ internet'
        }

    try:
        # Download image
        response = requests.get(image_url, timeout=10)
        if response.status_code != 200:
            return {
                'status': 'broken',
                'reason': f'HTTP error {response.status_code}'
            }

        # Convert to base64
        image_data = base64.standard_b64encode(response.content).decode('utf-8')

        # Use Claude to analyze the image
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": image_data,
                            },
                        },
                        {
                            "type": "text",
                            "text": f"""Đây là thẻ AAC (Augmentative and Alternative Communication) tiếng Việt với tiêu đề "{title}".

Hãy phân tích xem hình ảnh này có phù hợp với tiêu đề không. Trả lời theo format JSON:
{{
  "matches": true/false,
  "description": "mô tả ngắn về nội dung hình ảnh",
  "reasoning": "lý do tại sao phù hợp hoặc không phù hợp"
}}

Lưu ý đặc biệt cho các thẻ gia đình:
- "Mẹ" nên là hình phụ nữ với con (có thể đang ôm, chăm sóc, hoặc tương tác với trẻ)
- "Bố" nên là hình đàn ông với con
- "Bà" nên là hình phụ nữ lớn tuổi
- "Ông" nên là hình đàn ông lớn tuổi
- "Anh" nên là hình nam thanh niên/nam giới trẻ
- "Chị" nên là hình nữ thanh niên/nữ giới trẻ
- "Em" nên là hình trẻ em
"""
                        }
                    ],
                }
            ],
        )

        # Parse response
        response_text = message.content[0].text
        # Try to extract JSON from response
        if '{' in response_text and '}' in response_text:
            json_start = response_text.index('{')
            json_end = response_text.rindex('}') + 1
            result = json.loads(response_text[json_start:json_end])

            if result.get('matches'):
                return {
                    'status': 'match',
                    'description': result.get('description', ''),
                    'reasoning': result.get('reasoning', '')
                }
            else:
                return {
                    'status': 'mismatch',
                    'description': result.get('description', ''),
                    'reasoning': result.get('reasoning', '')
                }
        else:
            return {
                'status': 'error',
                'reason': 'Không thể parse response từ AI'
            }

    except requests.exceptions.RequestException as e:
        return {
            'status': 'broken',
            'reason': f'Lỗi tải hình: {str(e)}'
        }
    except Exception as e:
        return {
            'status': 'error',
            'reason': f'Lỗi: {str(e)}'
        }

def main():
    print("Đang kiểm tra hình ảnh cho tất cả các thẻ...\n")

    results = {
        'match': [],
        'mismatch': [],
        'broken': [],
        'error': []
    }

    # Prioritize family cards
    family_cards = ['Mẹ', 'Bố', 'Bà', 'Ông', 'Anh', 'Chị', 'Em']

    # Process family cards first
    for card in cards_data:
        if card['title'] in family_cards:
            print(f"Đang kiểm tra: {card['title']}...")
            result = check_image(card)
            result['card'] = card
            results[result['status']].append(result)
            time.sleep(1)  # Rate limiting

    # Process remaining cards
    for card in cards_data:
        if card['title'] not in family_cards:
            print(f"Đang kiểm tra: {card['title']}...")
            result = check_image(card)
            result['card'] = card
            results[result['status']].append(result)
            time.sleep(1)  # Rate limiting

    # Generate report
    print("\n" + "="*80)
    print("BÁO CÁO KIỂM TRA HÌNH ẢNH THẺ AAC")
    print("="*80 + "\n")

    print(f"✅ HÌNH ẢNH PHÙ HỢP ({len(results['match'])} thẻ)")
    print("-" * 80)
    for item in results['match']:
        card = item['card']
        print(f"• {card['title']}")
        print(f"  Mô tả: {item.get('description', 'N/A')}")
        print(f"  Lý do: {item.get('reasoning', 'N/A')}")
        print()

    print(f"\n❌ HÌNH ẢNH KHÔNG PHÙ HỢP ({len(results['mismatch'])} thẻ)")
    print("-" * 80)
    for item in results['mismatch']:
        card = item['card']
        print(f"• {card['title']}")
        print(f"  URL: {card['image_url']}")
        print(f"  Mô tả: {item.get('description', 'N/A')}")
        print(f"  Lý do: {item.get('reasoning', 'N/A')}")
        print()

    print(f"\n⚠️  HÌNH ẢNH LỖI/KHÔNG TẢI ĐƯỢC ({len(results['broken'])} thẻ)")
    print("-" * 80)
    for item in results['broken']:
        card = item['card']
        print(f"• {card['title']}")
        print(f"  URL: {card['image_url']}")
        print(f"  Lý do: {item.get('reason', 'N/A')}")
        print()

    if results['error']:
        print(f"\n⚠️  LỖI KHI KIỂM TRA ({len(results['error'])} thẻ)")
        print("-" * 80)
        for item in results['error']:
            card = item['card']
            print(f"• {card['title']}")
            print(f"  Lý do: {item.get('reason', 'N/A')}")
            print()

    # Summary
    print("\n" + "="*80)
    print("TỔNG KẾT")
    print("="*80)
    print(f"Tổng số thẻ: {len(cards_data)}")
    print(f"✅ Phù hợp: {len(results['match'])}")
    print(f"❌ Không phù hợp: {len(results['mismatch'])}")
    print(f"⚠️  Lỗi/Không tải được: {len(results['broken']) + len(results['error'])}")

    # Special focus on family cards
    print("\n" + "="*80)
    print("CHÚ Ý ĐẶC BIỆT: CÁC THẺ GIA ĐÌNH")
    print("="*80)
    family_issues = []
    for card in cards_data:
        if card['title'] in family_cards:
            for item in results['mismatch']:
                if item['card']['id'] == card['id']:
                    family_issues.append((card['title'], item))
            for item in results['broken']:
                if item['card']['id'] == card['id']:
                    family_issues.append((card['title'], item))

    if family_issues:
        print("CÁC THẺ GIA ĐÌNH CẦN SỬA:")
        for title, item in family_issues:
            print(f"❌ {title}: {item.get('reasoning', item.get('reason', 'N/A'))}")
    else:
        print("✅ Tất cả các thẻ gia đình đều phù hợp!")

    # Save results to JSON
    with open('/tmp/cc-agent/63251158/project/card_check_results.json', 'w', encoding='utf-8') as f:
        json.dump({
            'match': results['match'],
            'mismatch': results['mismatch'],
            'broken': results['broken'],
            'error': results['error']
        }, f, ensure_ascii=False, indent=2)

    print(f"\nKết quả chi tiết đã được lưu vào: /tmp/cc-agent/63251158/project/card_check_results.json")

if __name__ == '__main__':
    main()
