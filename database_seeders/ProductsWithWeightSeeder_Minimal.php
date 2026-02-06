<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductsWithWeightSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First, let's check what columns exist in the products table
        $this->command->info('Checking products table structure...');

        // Get the first product to see the structure (if any exist)
        $sampleProduct = DB::table('products')->first();
        if ($sampleProduct) {
            $this->command->info('Sample product columns: ' . implode(', ', array_keys((array)$sampleProduct)));
        }

        // Get category and brand IDs (adjust based on your database)
        $dogCategoryId = DB::table('categories')->where('slug', 'dogs')->value('id') ?? 1;
        $catCategoryId = DB::table('categories')->where('slug', 'cats')->value('id') ?? 2;
        $birdCategoryId = DB::table('categories')->where('slug', 'birds')->value('id') ?? 3;

        // Get brand IDs (adjust based on your database)
        $brandIds = [
            'royal_canin' => DB::table('brands')->where('slug', 'royal-canin')->value('id') ?? 1,
            'kong' => DB::table('brands')->where('slug', 'kong')->value('id') ?? 2,
            'petsafe' => DB::table('brands')->where('slug', 'petsafe')->value('id') ?? 3,
            'wahl' => DB::table('brands')->where('slug', 'wahl')->value('id') ?? 4,
            'blue_buffalo' => DB::table('brands')->where('slug', 'blue-buffalo')->value('id') ?? 5,
            'flexi' => DB::table('brands')->where('slug', 'flexi')->value('id') ?? 6,
            'pedigree' => DB::table('brands')->where('slug', 'pedigree')->value('id') ?? 7,
        ];

        // Minimal products array with only essential fields
        $products = [
            // Dog Products
            [
                'name' => 'Premium Adult Dog Food - Chicken & Rice',
                'slug' => 'premium-adult-dog-food-chicken-rice',
                'sku' => 'DOG-FOOD-001',
                'description' => 'High-quality adult dog food with chicken and rice. Balanced nutrition for active dogs.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['royal_canin'],
                'price' => 2499.00,
                'weight' => 3.00, // kg
                'dimensions' => json_encode([
                    'length' => 35,
                    'width' => 25,
                    'height' => 10
                ]),
                'stock_quantity' => 45,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Interactive Puzzle Dog Toy',
                'slug' => 'interactive-puzzle-dog-toy',
                'sku' => 'DOG-TOY-001',
                'description' => 'Keep your dog mentally stimulated with this interactive puzzle toy.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['kong'],
                'price' => 899.00,
                'weight' => 0.35, // kg
                'dimensions' => json_encode([
                    'length' => 20,
                    'width' => 15,
                    'height' => 12
                ]),
                'stock_quantity' => 8,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Orthopedic Dog Bed - Large',
                'slug' => 'orthopedic-dog-bed-large',
                'sku' => 'DOG-BED-001',
                'description' => 'Premium orthopedic memory foam dog bed for large breeds.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['petsafe'],
                'price' => 3999.00,
                'weight' => 2.50, // kg
                'dimensions' => json_encode([
                    'length' => 90,
                    'width' => 70,
                    'height' => 15
                ]),
                'stock_quantity' => 25,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dog Shampoo - Sensitive Skin',
                'slug' => 'dog-shampoo-sensitive-skin',
                'sku' => 'DOG-GROOM-001',
                'description' => 'Gentle shampoo for dogs with sensitive skin.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['wahl'],
                'price' => 599.00,
                'weight' => 0.75, // kg
                'dimensions' => json_encode([
                    'length' => 22,
                    'width' => 8,
                    'height' => 8
                ]),
                'stock_quantity' => 50,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'LED Dog Collar - Rechargeable',
                'slug' => 'led-dog-collar-rechargeable',
                'sku' => 'DOG-ACC-001',
                'description' => 'Rechargeable LED collar for night walks.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['petsafe'],
                'price' => 1299.00,
                'weight' => 0.15, // kg
                'dimensions' => json_encode([
                    'length' => 50,
                    'width' => 2,
                    'height' => 2
                ]),
                'stock_quantity' => 0,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Grain-Free Puppy Food',
                'slug' => 'grain-free-puppy-food',
                'sku' => 'DOG-FOOD-002',
                'description' => 'Premium grain-free puppy food with real chicken.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['blue_buffalo'],
                'price' => 3299.00,
                'weight' => 5.00, // kg
                'dimensions' => json_encode([
                    'length' => 40,
                    'width' => 30,
                    'height' => 12
                ]),
                'stock_quantity' => 30,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Retractable Dog Leash - 5m',
                'slug' => 'retractable-dog-leash-5m',
                'sku' => 'DOG-ACC-002',
                'description' => 'Durable retractable leash with 5 meter range.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['flexi'],
                'price' => 1599.00,
                'weight' => 0.25, // kg
                'dimensions' => json_encode([
                    'length' => 15,
                    'width' => 12,
                    'height' => 5
                ]),
                'stock_quantity' => 40,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dog Dental Chews - Pack of 30',
                'slug' => 'dog-dental-chews-pack-30',
                'sku' => 'DOG-TREAT-001',
                'description' => 'Daily dental chews for dogs.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['pedigree'],
                'price' => 799.00,
                'weight' => 0.50, // kg
                'dimensions' => json_encode([
                    'length' => 25,
                    'width' => 18,
                    'height' => 8
                ]),
                'stock_quantity' => 100,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Premium Cat Food - Salmon & Tuna',
                'slug' => 'premium-cat-food-salmon-tuna',
                'sku' => 'CAT-FOOD-001',
                'description' => 'High-protein cat food with real salmon and tuna.',
                'category_id' => $catCategoryId,
                'brand_id' => $brandIds['royal_canin'],
                'price' => 1899.00,
                'weight' => 2.00, // kg
                'dimensions' => json_encode([
                    'length' => 30,
                    'width' => 20,
                    'height' => 8
                ]),
                'stock_quantity' => 60,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Self-Cleaning Cat Litter Box',
                'slug' => 'self-cleaning-cat-litter-box',
                'sku' => 'CAT-ACC-001',
                'description' => 'Automatic self-cleaning litter box.',
                'category_id' => $catCategoryId,
                'brand_id' => $brandIds['petsafe'],
                'price' => 8999.00,
                'weight' => 5.50, // kg
                'dimensions' => json_encode([
                    'length' => 60,
                    'width' => 50,
                    'height' => 40
                ]),
                'stock_quantity' => 12,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert products one by one with error handling
        $successCount = 0;
        $errorCount = 0;

        foreach ($products as $product) {
            try {
                DB::table('products')->insert($product);
                $successCount++;
                $this->command->info("✅ Added: {$product['name']}");
            } catch (\Exception $e) {
                $errorCount++;
                $this->command->error("❌ Failed to add {$product['name']}: {$e->getMessage()}");
            }
        }

        $this->command->info("\n📊 Summary:");
        $this->command->info("✅ Successfully seeded: {$successCount} products");
        if ($errorCount > 0) {
            $this->command->warn("❌ Failed: {$errorCount} products");
        }
    }
}
