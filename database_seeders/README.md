# Database Seeders for Pawsome Backend

This directory contains Laravel database migration and seeder files to add products with weight and dimensions to your backend.

## 📁 Files Included

1. **2026_02_04_add_weight_dimensions_to_products.php** - Migration file
2. **ProductsWithWeightSeeder.php** - Seeder file
3. **README.md** - This file

## 🚀 Installation Steps

### Step 1: Copy Migration File

Copy the migration file to your Laravel backend:

```bash
# From your Laravel project root
cp /path/to/2026_02_04_add_weight_dimensions_to_products.php database/migrations/
```

Or manually:
- Copy `2026_02_04_add_weight_dimensions_to_products.php`
- Paste to `your-laravel-project/database/migrations/`

### Step 2: Copy Seeder File

Copy the seeder file to your Laravel backend:

```bash
# From your Laravel project root
cp /path/to/ProductsWithWeightSeeder.php database/seeders/
```

Or manually:
- Copy `ProductsWithWeightSeeder.php`
- Paste to `your-laravel-project/database/seeders/`

### Step 3: Run Migration

Add weight and dimensions columns to products table:

```bash
# Navigate to your Laravel project
cd /path/to/your-laravel-backend

# Run the migration
php artisan migrate
```

Expected output:
```
Running migrations...
2026_02_04_add_weight_dimensions_to_products .......................... DONE
```

### Step 4: Run Seeder

Populate products with weight and dimensions:

```bash
# Run the seeder
php artisan db:seed --class=ProductsWithWeightSeeder
```

Expected output:
```
✅ Successfully seeded 13 products with weight and dimensions!
```

### Step 5 (Optional): Add to DatabaseSeeder

To run this seeder automatically with other seeders, add it to `database/seeders/DatabaseSeeder.php`:

```php
public function run(): void
{
    // ... other seeders

    $this->call([
        ProductsWithWeightSeeder::class,
    ]);
}
```

Then run:
```bash
php artisan db:seed
```

## 📊 Products Included

The seeder creates **13 products** across 3 categories:

### Dog Products (8 products)
1. **Premium Adult Dog Food** - 3.00 kg, 35×25×10 cm - Rs. 2,499
2. **Interactive Puzzle Toy** - 0.35 kg, 20×15×12 cm - Rs. 899
3. **Orthopedic Dog Bed** - 2.50 kg, 90×70×15 cm - Rs. 3,999
4. **Dog Shampoo** - 0.75 kg, 22×8×8 cm - Rs. 599
5. **LED Dog Collar** - 0.15 kg, 50×2×2 cm - Rs. 1,299 (Out of stock)
6. **Grain-Free Puppy Food** - 5.00 kg, 40×30×12 cm - Rs. 3,299
7. **Retractable Leash** - 0.25 kg, 15×12×5 cm - Rs. 1,599
8. **Dental Chews Pack** - 0.50 kg, 25×18×8 cm - Rs. 799

### Cat Products (3 products)
9. **Premium Cat Food** - 2.00 kg, 30×20×8 cm - Rs. 1,899
10. **Interactive Feather Toy** - 0.08 kg, 45×3×3 cm - Rs. 499
11. **Self-Cleaning Litter Box** - 5.50 kg, 60×50×40 cm - Rs. 8,999

### Bird Products (2 products)
12. **Premium Bird Seed Mix** - 2.00 kg, 25×15×10 cm - Rs. 899
13. **Large Bird Cage** - 15.00 kg, 80×60×150 cm - Rs. 12,999

## 🔧 Customization

### Adjust Category IDs

The seeder tries to find categories by slug. If your categories have different slugs, update these lines:

```php
$dogCategoryId = DB::table('categories')->where('slug', 'dogs')->value('id') ?? 1;
$catCategoryId = DB::table('categories')->where('slug', 'cats')->value('id') ?? 2;
$birdCategoryId = DB::table('categories')->where('slug', 'birds')->value('id') ?? 3;
```

### Adjust Brand IDs

Update brand slugs if needed:

```php
$brandIds = [
    'royal_canin' => DB::table('brands')->where('slug', 'royal-canin')->value('id') ?? 1,
    'kong' => DB::table('brands')->where('slug', 'kong')->value('id') ?? 2,
    // ... etc
];
```

### Add More Products

To add more products, add them to the `$products` array in the seeder:

```php
[
    'name' => 'Your Product Name',
    'slug' => 'your-product-slug',
    'sku' => 'UNIQUE-SKU',
    'description' => 'Product description',
    'category_id' => $categoryId,
    'brand_id' => $brandId,
    'price' => 1999.00,
    'weight' => 1.50, // kg
    'dimensions' => json_encode([
        'length' => 30,
        'width' => 20,
        'height' => 15
    ]),
    'stock_quantity' => 50,
    'is_active' => true,
    // ... other fields
],
```

## 🧪 Verification

After running the seeder, verify the data:

### Check Database

```sql
-- View all products with weight
SELECT id, name, weight, dimensions, slug FROM products WHERE weight IS NOT NULL;

-- Check specific product
SELECT * FROM products WHERE slug = 'premium-adult-dog-food-chicken-rice';
```

### Test API Endpoint

```bash
# Get product by slug
curl http://127.0.0.1:8000/api/products/premium-adult-dog-food-chicken-rice

# Expected response should include:
# "weight": "3.00"
# "dimensions": {"length": 35, "width": 25, "height": 10}
```

### Test Cart API

```bash
# Add product to cart (requires authentication)
curl -X POST http://127.0.0.1:8000/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_slug": "premium-adult-dog-food-chicken-rice",
    "quantity": 2
  }'

# Expected response should include weight and shipping calculation
```

## 📋 Product Table Schema

After migration, your products table should have these columns:

| Column       | Type          | Description                           |
|--------------|---------------|---------------------------------------|
| weight       | decimal(10,2) | Product weight in kg                 |
| dimensions   | json          | {length, width, height} in cm        |

## 🔍 Troubleshooting

### Error: "Column already exists"

If the migration fails because columns already exist:

```bash
# Skip migration and just run seeder
php artisan db:seed --class=ProductsWithWeightSeeder
```

### Error: "Foreign key constraint fails"

If category or brand IDs don't exist:

1. Create categories first:
```bash
php artisan db:seed --class=CategorySeeder
php artisan db:seed --class=BrandSeeder
```

2. Or update the seeder to use existing IDs

### Error: "Duplicate entry for key 'slug'"

Products with these slugs already exist. Either:

1. Delete existing products:
```sql
DELETE FROM products WHERE slug IN (
    'premium-adult-dog-food-chicken-rice',
    'interactive-puzzle-dog-toy',
    -- ... other slugs
);
```

2. Or modify the slugs in the seeder to make them unique

## ✅ Next Steps

After seeding:

1. **Verify Products**: Check that products appear in your admin panel
2. **Test Frontend**: Log in to frontend and add products to cart
3. **Check Cart**: Verify weight and dimensions appear in cart
4. **Test Shipping**: Verify shipping costs calculate based on weight
5. **Place Order**: Complete checkout to test full flow

## 🆘 Support

If you encounter issues:

1. Check Laravel logs: `storage/logs/laravel.log`
2. Verify database connection: `php artisan tinker` then `DB::connection()->getPdo()`
3. Check table structure: `php artisan migrate:status`
4. Verify seeder ran: `SELECT COUNT(*) FROM products WHERE weight IS NOT NULL`

---

**Note**: These files are designed for the Pawsome pet care platform backend. Adjust table names, columns, and relationships based on your specific database schema.
