<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProductsWithWeightSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all columns that exist in the products table
        $existingColumns = Schema::getColumnListing('products');
        $this->command->info('📋 Products table columns: ' . implode(', ', $existingColumns));

        // Get category and brand IDs
        $dogCategoryId = DB::table('categories')->where('slug', 'dogs')->value('id') ?? 1;

        // Get brand ID
        $brandId = DB::table('brands')->first()->id ?? 1;

        // Define products with ALL possible fields
        $productsData = [
            [
                'name' => 'Premium Adult Dog Food - Chicken & Rice',
                'slug' => 'premium-adult-dog-food-chicken-rice',
                'sku' => 'DOG-FOOD-001',
                'description' => 'High-quality adult dog food with chicken and rice.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandId,
                'price' => 2499.00,
                'weight' => 3.00,
                'dimensions' => json_encode(['length' => 35, 'width' => 25, 'height' => 10]),
                'stock_quantity' => 45,
                'is_active' => true,
            ],
            [
                'name' => 'Interactive Puzzle Dog Toy',
                'slug' => 'interactive-puzzle-dog-toy',
                'sku' => 'DOG-TOY-001',
                'description' => 'Interactive puzzle toy for dogs.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandId,
                'price' => 899.00,
                'weight' => 0.35,
                'dimensions' => json_encode(['length' => 20, 'width' => 15, 'height' => 12]),
                'stock_quantity' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'Orthopedic Dog Bed - Large',
                'slug' => 'orthopedic-dog-bed-large',
                'sku' => 'DOG-BED-001',
                'description' => 'Premium orthopedic dog bed.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandId,
                'price' => 3999.00,
                'weight' => 2.50,
                'dimensions' => json_encode(['length' => 90, 'width' => 70, 'height' => 15]),
                'stock_quantity' => 25,
                'is_active' => true,
            ],
            [
                'name' => 'Dog Shampoo - Sensitive Skin',
                'slug' => 'dog-shampoo-sensitive-skin',
                'sku' => 'DOG-GROOM-001',
                'description' => 'Gentle dog shampoo.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandId,
                'price' => 599.00,
                'weight' => 0.75,
                'dimensions' => json_encode(['length' => 22, 'width' => 8, 'height' => 8]),
                'stock_quantity' => 50,
                'is_active' => true,
            ],
            [
                'name' => 'Grain-Free Puppy Food',
                'slug' => 'grain-free-puppy-food',
                'sku' => 'DOG-FOOD-002',
                'description' => 'Premium grain-free puppy food.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandId,
                'price' => 3299.00,
                'weight' => 5.00,
                'dimensions' => json_encode(['length' => 40, 'width' => 30, 'height' => 12]),
                'stock_quantity' => 30,
                'is_active' => true,
            ],
            [
                'name' => 'Retractable Dog Leash - 5m',
                'slug' => 'retractable-dog-leash-5m',
                'sku' => 'DOG-ACC-002',
                'description' => 'Durable retractable leash.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandId,
                'price' => 1599.00,
                'weight' => 0.25,
                'dimensions' => json_encode(['length' => 15, 'width' => 12, 'height' => 5]),
                'stock_quantity' => 40,
                'is_active' => true,
            ],
            [
                'name' => 'Dog Dental Chews - Pack of 30',
                'slug' => 'dog-dental-chews-pack-30',
                'sku' => 'DOG-TREAT-001',
                'description' => 'Daily dental chews for dogs.',
                'category_id' => $dogCategoryId,
                'brand_id' => $brandId,
                'price' => 799.00,
                'weight' => 0.50,
                'dimensions' => json_encode(['length' => 25, 'width' => 18, 'height' => 8]),
                'stock_quantity' => 100,
                'is_active' => true,
            ],
        ];

        // Insert products
        $successCount = 0;
        $errorCount = 0;

        foreach ($productsData as $productData) {
            try {
                // Add timestamps if columns exist
                if (in_array('created_at', $existingColumns)) {
                    $productData['created_at'] = now();
                }
                if (in_array('updated_at', $existingColumns)) {
                    $productData['updated_at'] = now();
                }

                // Filter to only include columns that exist in the table
                $filteredData = [];
                foreach ($productData as $key => $value) {
                    if (in_array($key, $existingColumns)) {
                        $filteredData[$key] = $value;
                    } else {
                        $this->command->warn("⚠️  Skipping column '{$key}' (doesn't exist in table)");
                    }
                }

                // Insert the product
                DB::table('products')->insert($filteredData);
                $successCount++;
                $this->command->info("✅ Added: {$productData['name']} (Weight: {$productData['weight']} kg)");

            } catch (\Exception $e) {
                $errorCount++;
                $this->command->error("❌ Failed to add {$productData['name']}: {$e->getMessage()}");
            }
        }

        $this->command->newLine();
        $this->command->info("📊 Summary:");
        $this->command->info("✅ Successfully seeded: {$successCount} products with weight & dimensions");
        if ($errorCount > 0) {
            $this->command->error("❌ Failed: {$errorCount} products");
        }
    }
}
