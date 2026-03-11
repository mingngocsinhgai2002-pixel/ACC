/**
 * Test script for Supabase Edge Functions
 * Run with: npx ts-node test-functions.ts
 */

const PROJECT_ID = "seoxgqnatjmxcnxzzumc";
const BASE_URL = `https://${PROJECT_ID}.supabase.co/functions/v1`;

interface Card {
  id: string;
  title: string;
  category_id: string;
  image_url: string;
  order_index: number;
}

interface Category {
  id: string;
  name: string;
  order_index: number;
}

interface UsageLogResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    card_id: string;
    timestamp: string;
  };
}

interface StatsResponse {
  total_cards_used: number;
  unique_cards: number;
  total_sessions: number;
  top_cards: Array<{
    card_id: string;
    usage_count: number;
  }>;
}

async function testGetCards() {
  console.log("\n📋 Testing GET /cards");
  console.log("====================");

  try {
    const response = await fetch(`${BASE_URL}/cards`);
    const data: Card[] = await response.json();

    if (response.ok) {
      console.log(`✓ Success! Retrieved ${data.length} cards`);
      console.log("Sample cards:", data.slice(0, 2));
    } else {
      console.error("✗ Error:", data);
    }
  } catch (error) {
    console.error("✗ Request failed:", error);
  }
}

async function testGetCardsWithFilter(categoryId: string) {
  console.log(`\n🔍 Testing GET /cards?category_id=${categoryId}`);
  console.log("====================");

  try {
    const response = await fetch(
      `${BASE_URL}/cards?category_id=${categoryId}`
    );
    const data: Card[] = await response.json();

    if (response.ok) {
      console.log(`✓ Success! Retrieved ${data.length} cards in category`);
      console.log("Sample cards:", data.slice(0, 2));
    } else {
      console.error("✗ Error:", data);
    }
  } catch (error) {
    console.error("✗ Request failed:", error);
  }
}

async function testGetCategories() {
  console.log("\n📚 Testing GET /categories");
  console.log("====================");

  try {
    const response = await fetch(`${BASE_URL}/categories`);
    const data: Category[] = await response.json();

    if (response.ok) {
      console.log(`✓ Success! Retrieved ${data.length} categories`);
      console.log("Categories:", data);
    } else {
      console.error("✗ Error:", data);
    }
  } catch (error) {
    console.error("✗ Request failed:", error);
  }
}

async function testPostUsageLog(cardId: string) {
  console.log(`\n📝 Testing POST /usage-log`);
  console.log("====================");

  try {
    const response = await fetch(`${BASE_URL}/usage-log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ card_id: cardId }),
    });

    const data: UsageLogResponse = await response.json();

    if (response.ok) {
      console.log("✓ Success! Usage logged");
      console.log("Response:", data);
    } else {
      console.error("✗ Error:", data);
    }
  } catch (error) {
    console.error("✗ Request failed:", error);
  }
}

async function testGetStats() {
  console.log("\n📊 Testing GET /stats");
  console.log("====================");

  try {
    const response = await fetch(`${BASE_URL}/stats`);
    const data: StatsResponse = await response.json();

    if (response.ok) {
      console.log("✓ Success! Retrieved statistics");
      console.log("Total cards used:", data.total_cards_used);
      console.log("Unique cards:", data.unique_cards);
      console.log("Total sessions:", data.total_sessions);
      console.log("Top cards:", data.top_cards.slice(0, 5));
    } else {
      console.error("✗ Error:", data);
    }
  } catch (error) {
    console.error("✗ Request failed:", error);
  }
}

async function runAllTests() {
  console.log("🚀 Starting Edge Functions Tests");
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Base URL: ${BASE_URL}`);

  await testGetCategories();
  // Note: These require actual data in your database
  // Uncomment after ensuring you have data:
  // await testGetCards();
  // await testGetCardsWithFilter("your-category-id");
  // await testPostUsageLog("your-card-id");
  // await testGetStats();

  console.log("\n✅ Test run completed!");
}

// Run tests
runAllTests().catch(console.error);
