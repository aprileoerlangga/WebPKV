<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('card_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_id')->constrained('visitor_cards');
            $table->enum('action', ['issued', 'returned', 'marked_lost', 'marked_damaged']);
            $table->text('notes')->nullable();
            $table->foreignId('performed_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('card_histories');
    }
};
