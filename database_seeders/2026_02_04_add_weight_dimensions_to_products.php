<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Add weight column (in kg, using decimal for precision)
            if (!Schema::hasColumn('products', 'weight')) {
                $table->decimal('weight', 10, 2)->nullable()->after('cost_price')->comment('Product weight in kg');
            }

            // Add dimensions column (JSON format: {length, width, height} in cm)
            if (!Schema::hasColumn('products', 'dimensions')) {
                $table->json('dimensions')->nullable()->after('weight')->comment('Product dimensions in cm: {length, width, height}');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'weight')) {
                $table->dropColumn('weight');
            }

            if (Schema::hasColumn('products', 'dimensions')) {
                $table->dropColumn('dimensions');
            }
        });
    }
};
