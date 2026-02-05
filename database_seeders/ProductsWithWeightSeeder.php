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
                'compare_price' => 2999.00,
                'cost_price' => 1800.00,
                'weight' => 3.00, // kg
                'dimensions' => json_encode([
                    'length' => 35,
                    'width' => 25,
                    'height' => 10
                ]),
                'stock_quantity' => 45,
                'low_stock_threshold' => 10,
                'is_active' => true,
                'is_featured' => true,
                'meta_title' => 'Premium Adult Dog Food - Chicken & Rice',
                'meta_description' => 'High-quality adult dog food with chicken and rice',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Interactive Puzzle Dog Toy',
                'slug' => 'interactive-puzzle-dog-toy',
                'sku' => 'DOG-TOY-001',
                'description' => 'Keep your dog mentally stimulated with this interactive puzzle toy. Great for treat dispensing.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['kong'],
                'price' => 899.00,
                'cost_price' => 600.00,
                'weight' => 0.35, // kg
                'dimensions' => json_encode([
                    'length' => 20,
                    'width' => 15,
                    'height' => 12
                ]),
                'stock_quantity' => 8,
                'low_stock_threshold' => 5,
                'is_active' => true,
                'is_featured' => false,
                'meta_title' => 'Interactive Puzzle Dog Toy',
                'meta_description' => 'Interactive puzzle toy for dogs',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Orthopedic Dog Bed - Large',
                'slug' => 'orthopedic-dog-bed-large',
                'sku' => 'DOG-BED-001',
                'description' => 'Premium orthopedic memory foam dog bed. Perfect for senior dogs and large breeds.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['petsafe'],
                'price' => 3999.00,
                'compare_price' => 4999.00,
                'cost_price' => 2500.00,
                'weight' => 2.50, // kg
                'dimensions' => json_encode([
                    'length' => 90,
                    'width' => 70,
                    'height' => 15
                ]),
                'stock_quantity' => 25,
                'low_stock_threshold' => 5,
                'is_active' => true,
                'is_featured' => true,
                'meta_title' => 'Orthopedic Dog Bed - Large',
                'meta_description' => 'Premium orthopedic memory foam dog bed for large breeds',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dog Shampoo - Sensitive Skin',
                'slug' => 'dog-shampoo-sensitive-skin',
                'sku' => 'DOG-GROOM-001',
                'description' => 'Gentle shampoo formulated for dogs with sensitive skin. pH balanced and hypoallergenic.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['wahl'],
                'price' => 599.00,
                'cost_price' => 350.00,
                'weight' => 0.75, // kg
                'dimensions' => json_encode([
                    'length' => 22,
                    'width' => 8,
                    'height' => 8
                ]),
                'stock_quantity' => 50,
                'low_stock_threshold' => 10,
                'is_active' => true,
                'is_featured' => false,
                'meta_title' => 'Dog Shampoo - Sensitive Skin',
                'meta_description' => 'Gentle shampoo for dogs with sensitive skin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'LED Dog Collar - Rechargeable',
                'slug' => 'led-dog-collar-rechargeable',
                'sku' => 'DOG-ACC-001',
                'description' => 'Rechargeable LED collar for night walks. USB charging with 3 light modes.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['petsafe'],
                'price' => 1299.00,
                'cost_price' => 800.00,
                'weight' => 0.15, // kg
                'dimensions' => json_encode([
                    'length' => 50,
                    'width' => 2,
                    'height' => 2
                ]),
                'stock_quantity' => 0,
                'low_stock_threshold' => 5,
                'is_active' => true,
                'is_featured' => false,
                'meta_title' => 'LED Dog Collar - Rechargeable',
                'meta_description' => 'Rechargeable LED collar for night walks',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Grain-Free Puppy Food',
                'slug' => 'grain-free-puppy-food',
                'sku' => 'DOG-FOOD-002',
                'description' => 'Premium grain-free puppy food with real chicken. Complete nutrition for growing puppies.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['blue_buffalo'],
                'price' => 3299.00,
                'compare_price' => 3799.00,
                'cost_price' => 2200.00,
                'weight' => 5.00, // kg
                'dimensions' => json_encode([
                    'length' => 40,
                    'width' => 30,
                    'height' => 12
                ]),
                'stock_quantity' => 30,
                'low_stock_threshold' => 10,
                'is_active' => true,
                'is_featured' => true,
                'meta_title' => 'Grain-Free Puppy Food',
                'meta_description' => 'Premium grain-free puppy food with real chicken',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Retractable Dog Leash - 5m',
                'slug' => 'retractable-dog-leash-5m',
                'sku' => 'DOG-ACC-002',
                'description' => 'Durable retractable leash with 5 meter range. One-button brake and lock system.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['flexi'],
                'price' => 1599.00,
                'cost_price' => 1000.00,
                'weight' => 0.25, // kg
                'dimensions' => json_encode([
                    'length' => 15,
                    'width' => 12,
                    'height' => 5
                ]),
                'stock_quantity' => 40,
                'low_stock_threshold' => 10,
                'is_active' => true,
                'is_featured' => false,
                'meta_title' => 'Retractable Dog Leash - 5m',
                'meta_description' => 'Durable retractable leash with 5 meter range',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dog Dental Chews - Pack of 30',
                'slug' => 'dog-dental-chews-pack-30',
                'sku' => 'DOG-TREAT-001',
                'description' => 'Daily dental chews for dogs. Helps reduce plaque and tartar buildup.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandIds['pedigree'],
                'price' => 799.00,
                'compare_price' => 999.00,
                'cost_price' => 500.00,
                'weight' => 0.50, // kg
                'dimensions' => json_encode([
                    'length' => 25,
                    'width' => 18,
                    'height' => 8
                ]),
                'stock_quantity' => 100,
                'low_stock_threshold' => 20,
                'is_active' => true,
                'is_featured' => false,
                'meta_title' => 'Dog Dental Chews - Pack of 30',
                'meta_description' => 'Daily dental chews for dogs to reduce plaque',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Cat Products
            [
                'name' => 'Premium Cat Food - Salmon & Tuna',
                'slug' => 'premium-cat-food-salmon-tuna',
                'sku' => 'CAT-FOOD-001',
                'description' => 'High-protein cat food with real salmon and tuna. Complete nutrition for adult cats.',
                'category_id' => $catCategoryId,
                'brand_id' => $brandIds['royal_canin'],
                'price' => 1899.00,
                'compare_price' => 2299.00,
                'cost_price' => 1200.00,
                'weight' => 2.00, // kg
                'dimensions' => json_encode([
                    'length' => 30,
                    'width' => 20,
                    'height' => 8
                ]),
                'stock_quantity' => 60,
                'low_stock_threshold' => 15,
                'is_active' => true,
                'is_featured' => true,
                'meta_title' => 'Premium Cat Food - Salmon & Tuna',
                'meta_description' => 'High-protein cat food with real salmon and tuna',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Interactive Cat Feather Toy',
                'slug' => 'interactive-cat-feather-toy',
                'sku' => 'CAT-TOY-001',
                'description' => 'Interactive feather wand toy to keep your cat active and entertained.',
                'category_id' => $catCategoryId,
                'brand_id' => $brandIds['kong'],
                'price' => 499.00,
                'cost_price' => 250.00,
                'weight' => 0.08, // kg
                'dimensions' => json_encode([
                    'length' => 45,
                    'width' => 3,
                    'height' => 3
                ]),
                'stock_quantity' => 75,
                'low_stock_threshold' => 15,
                'is_active' => true,
                'is_featured' => false,
                'meta_title' => 'Interactive Cat Feather Toy',
                'meta_description' => 'Interactive feather wand toy for cats',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Self-Cleaning Cat Litter Box',
                'slug' => 'self-cleaning-cat-litter-box',
                'sku' => 'CAT-ACC-001',
                'description' => 'Automatic self-cleaning litter box. Reduces odor and makes cleanup easy.',
                'category_id' => $catCategoryId,
                'brand_id' => $brandIds['petsafe'],
                'price' => 8999.00,
                'compare_price' => 10999.00,
                'cost_price' => 6000.00,
                'weight' => 5.50, // kg
                'dimensions' => json_encode([
                    'length' => 60,
                    'width' => 50,
                    'height' => 40
                ]),
                'stock_quantity' => 12,
                'low_stock_threshold' => 3,
                'is_active' => true,
                'is_featured' => true,
                'meta_title' => 'Self-Cleaning Cat Litter Box',
                'meta_description' => 'Automatic self-cleaning litter box for cats',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Bird Products
            [
                'name' => 'Premium Bird Seed Mix - 2kg',
                'slug' => 'premium-bird-seed-mix-2kg',
                'sku' => 'BIRD-FOOD-001',
                'description' => 'Nutritious seed mix for parrots and other pet birds. Contains vitamins and minerals.',
                'category_id' => $birdCategoryId,
                'brand_id' => $brandIds['pedigree'],
                'price' => 899.00,
                'cost_price' => 500.00,
                'weight' => 2.00, // kg
                'dimensions' => json_encode([
                    'length' => 25,
                    'width' => 15,
                    'height' => 10
                ]),
                'stock_quantity' => 40,
                'low_stock_threshold' => 10,
                'is_active' => true,
                'is_featured' => false,
                'meta_title' => 'Premium Bird Seed Mix - 2kg',
                'meta_description' => 'Nutritious seed mix for parrots and pet birds',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Large Bird Cage with Stand',
                'slug' => 'large-bird-cage-with-stand',
                'sku' => 'BIRD-CAGE-001',
                'description' => 'Spacious bird cage with rolling stand. Perfect for parrots and medium-sized birds.',
                'category_id' => $birdCategoryId,
                'brand_id' => $brandIds['petsafe'],
                'price' => 12999.00,
                'compare_price' => 15999.00,
                'cost_price' => 9000.00,
                'weight' => 15.00, // kg
                'dimensions' => json_encode([
                    'length' => 80,
                    'width' => 60,
                    'height' => 150
                ]),
                'stock_quantity' => 8,
                'low_stock_threshold' => 2,
                'is_active' => true,
                'is_featured' => true,
                'meta_title' => 'Large Bird Cage with Stand',
                'meta_description' => 'Spacious bird cage with rolling stand',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert products
        foreach ($products as $product) {
            DB::table('products')->insert($product);
        }

        $this->command->info('✅ Successfully seeded ' . count($products) . ' products with weight and dimensions!');
    }
}
