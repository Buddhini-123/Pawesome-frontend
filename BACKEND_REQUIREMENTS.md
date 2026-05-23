# Backend Requirements for Weight & Dimensions Display

## 📌 Quick Summary

**The frontend is ready.** It will automatically display weight and dimensions **IF** the backend API returns them.

---

## ✅ What Backend Must Return

### API Endpoint:
```
GET /api/products/{slug}
```

### Required Response Format:
```json
{
  "success": true,
  "data": {
    "product": {
      "id": 5,
      "name": "Premium Dog Food",
      "slug": "premium-dog-food",
      "price": 1500,

      "weight": 2.5,                    // ← ADD THIS (number, in kg)

      "dimensions": {                   // ← ADD THIS (object)
        "length": 30,                   // number, in cm
        "width": 20,                    // number, in cm
        "height": 15,                   // number, in cm
        "unit": "cm"                    // optional, defaults to "cm"
      },

      "brand": {...},
      "category": {...},
      "images": [...],
      // ... other existing fields
    }
  }
}
```

---

## 🔧 Backend Modifications

### 1. Database Schema (MySQL/PostgreSQL)

```sql
-- Add weight column (if not exists)
ALTER TABLE products
ADD COLUMN weight DECIMAL(8, 2) NULL
COMMENT 'Product weight in kilograms';

-- Add dimensions column as JSON (if not exists)
ALTER TABLE products
ADD COLUMN dimensions JSON NULL
COMMENT 'Product dimensions: length, width, height in cm';

-- OR if you prefer separate columns:
ALTER TABLE products
ADD COLUMN length DECIMAL(8, 2) NULL,
ADD COLUMN width DECIMAL(8, 2) NULL,
ADD COLUMN height DECIMAL(8, 2) NULL,
ADD COLUMN dimension_unit VARCHAR(10) DEFAULT 'cm';
```

### 2. Sample Data Insert

```sql
-- Update existing products with weight and dimensions
UPDATE products
SET
  weight = 2.5,
  dimensions = JSON_OBJECT(
    'length', 30,
    'width', 20,
    'height', 15,
    'unit', 'cm'
  )
WHERE id = 1;

-- OR if using separate columns:
UPDATE products
SET
  weight = 2.5,
  length = 30,
  width = 20,
  height = 15,
  dimension_unit = 'cm'
WHERE id = 1;
```

---

## 📝 Laravel Backend Example

### If Using Laravel:

#### Option 1: API Resource (Recommended)

**File**: `app/Http/Resources/ProductResource.php`

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'price' => (float) $this->price,

            // ADD THESE TWO FIELDS:
            'weight' => $this->weight ? (float) $this->weight : null,

            'dimensions' => $this->dimensions
                ? (is_string($this->dimensions)
                    ? json_decode($this->dimensions, true)
                    : $this->dimensions)
                : null,

            // OR if using separate columns:
            // 'dimensions' => $this->length && $this->width && $this->height
            //     ? [
            //         'length' => (float) $this->length,
            //         'width' => (float) $this->width,
            //         'height' => (float) $this->height,
            //         'unit' => $this->dimension_unit ?? 'cm',
            //     ]
            //     : null,

            // ... other fields
            'brand' => new BrandResource($this->whenLoaded('brand')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'images' => ImageResource::collection($this->whenLoaded('images')),
        ];
    }
}
```

#### Option 2: Controller Direct Return

**File**: `app/Http/Controllers/ProductController.php`

```php
public function show($slug)
{
    $product = Product::with(['brand', 'category', 'images'])
        ->where('slug', $slug)
        ->firstOrFail();

    return response()->json([
        'success' => true,
        'data' => [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,

                // ADD THESE:
                'weight' => $product->weight,
                'dimensions' => $product->dimensions
                    ? json_decode($product->dimensions, true)
                    : null,

                // ... other fields
                'brand' => $product->brand,
                'category' => $product->category,
                'images' => $product->images,
            ]
        ]
    ]);
}
```

---

## 🐍 Django/Flask Backend Example

### Django (DRF):

**File**: `serializers.py`

```python
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'price',
            'weight',        # ADD THIS
            'dimensions',    # ADD THIS
            # ... other fields
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Ensure dimensions is a dict, not string
        if isinstance(data.get('dimensions'), str):
            import json
            data['dimensions'] = json.loads(data['dimensions'])

        return data
```

### Flask:

**File**: `routes.py`

```python
@app.route('/api/products/<slug>', methods=['GET'])
def get_product(slug):
    product = Product.query.filter_by(slug=slug).first_or_404()

    return jsonify({
        'success': True,
        'data': {
            'product': {
                'id': product.id,
                'name': product.name,
                'slug': product.slug,
                'price': product.price,

                # ADD THESE:
                'weight': product.weight,
                'dimensions': product.dimensions if isinstance(product.dimensions, dict)
                             else json.loads(product.dimensions) if product.dimensions
                             else None,

                # ... other fields
            }
        }
    })
```

---

## 🧪 Testing Backend Changes

### 1. Test with curl:

```bash
curl -X GET "http://127.0.0.1:8000/api/products/premium-dog-food" \
  -H "Accept: application/json" \
  | jq '.data.product | {weight, dimensions}'
```

**Expected Output:**
```json
{
  "weight": 2.5,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 15,
    "unit": "cm"
  }
}
```

### 2. Test with Postman:

1. **Method**: GET
2. **URL**: `http://127.0.0.1:8000/api/products/premium-dog-food`
3. **Headers**:
   - `Accept: application/json`
4. **Check Response**:
   - Look for `data.product.weight`
   - Look for `data.product.dimensions`

### 3. Test in Browser Console:

```javascript
fetch('http://127.0.0.1:8000/api/products/premium-dog-food', {
  headers: { 'Accept': 'application/json' }
})
.then(r => r.json())
.then(data => {
  console.log('Weight:', data.data.product.weight);
  console.log('Dimensions:', data.data.product.dimensions);
});
```

---

## 📊 Database Population Guide

### For Testing (Sample Products):

```sql
-- Dog Food Products
UPDATE products
SET weight = 2.5, dimensions = '{"length": 30, "width": 20, "height": 15, "unit": "cm"}'
WHERE category_id = 1 AND name LIKE '%Dog Food%';

-- Cat Food Products (lighter)
UPDATE products
SET weight = 1.2, dimensions = '{"length": 25, "width": 15, "height": 12, "unit": "cm"}'
WHERE category_id = 2 AND name LIKE '%Cat Food%';

-- Pet Toys (very light)
UPDATE products
SET weight = 0.3, dimensions = '{"length": 15, "width": 10, "height": 8, "unit": "cm"}'
WHERE name LIKE '%Toy%';

-- Large Items (pet beds, crates)
UPDATE products
SET weight = 5.0, dimensions = '{"length": 80, "width": 60, "height": 25, "unit": "cm"}'
WHERE name LIKE '%Bed%' OR name LIKE '%Crate%';
```

---

## 🎯 Validation Rules

### Backend Validation (Laravel Example):

```php
// In Request or Controller
$validated = $request->validate([
    'weight' => 'nullable|numeric|min:0|max:1000',
    'dimensions' => 'nullable|array',
    'dimensions.length' => 'required_with:dimensions|numeric|min:0|max:1000',
    'dimensions.width' => 'required_with:dimensions|numeric|min:0|max:1000',
    'dimensions.height' => 'required_with:dimensions|numeric|min:0|max:1000',
    'dimensions.unit' => 'nullable|string|in:cm,m,in,ft',
]);
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "dimensions returns as string, not object"

**Cause**: Database stores JSON as TEXT
**Solution**: Parse JSON when returning

```php
// Laravel
'dimensions' => $this->dimensions ? json_decode($this->dimensions, true) : null,
```

```python
# Python
import json
dimensions = json.loads(product.dimensions) if product.dimensions else None
```

### Issue 2: "weight shows as string '2.5' instead of number 2.5"

**Cause**: Not casting to number
**Solution**: Cast to float/decimal

```php
// Laravel
'weight' => (float) $this->weight,
```

```python
# Python
'weight': float(product.weight) if product.weight else None,
```

### Issue 3: "API returns dimensions but frontend doesn't show"

**Cause**: Wrong nesting level or field name
**Solution**: Ensure exact structure:

```json
{
  "data": {
    "product": {
      "dimensions": {        // ← Must be at this level
        "length": 30,
        "width": 20,
        "height": 15
      }
    }
  }
}
```

---

## ✅ Checklist Before Testing Frontend

- [ ] Database columns `weight` and `dimensions` exist
- [ ] At least one product has weight value
- [ ] At least one product has dimensions value
- [ ] API endpoint `/products/{slug}` includes weight in response
- [ ] API endpoint `/products/{slug}` includes dimensions object in response
- [ ] Dimensions is returned as object, not string
- [ ] Weight is returned as number, not string
- [ ] Tested with curl/Postman successfully
- [ ] Backend server is running on port 8000

---

## 🎉 Once Backend is Ready

1. **Refresh frontend** (Ctrl+Shift+R)
2. **Open subscriptions** page
3. **Click eye icon** on a product
4. **Modal should show**:
   - Weight card with value
   - Dimensions card with L × W × H

---

## 📞 Need Help?

If you've completed all backend changes but frontend still doesn't show weight/dimensions:

1. Share the **full API response** from:
   ```bash
   curl http://127.0.0.1:8000/api/products/{slug}
   ```

2. Share **browser console logs**:
   ```
   [Subscriptions] Product Data: {...}
   [Subscriptions] Weight: ...
   [Subscriptions] Dimensions: ...
   ```

3. Share **database query result**:
   ```sql
   SELECT id, name, weight, dimensions FROM products LIMIT 1;
   ```

---

## 🚀 Summary

**Frontend**: ✅ Ready (no further changes needed)

**Backend**: ❓ Needs to return:
- `weight` (number)
- `dimensions` (object with length, width, height)

**Once backend returns these fields, the frontend will automatically display them!**
