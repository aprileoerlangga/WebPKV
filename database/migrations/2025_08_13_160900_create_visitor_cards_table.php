<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitor_cards', function (Blueprint $table) {
            $table->id();
            $table->string('card_number')->unique();
            $table->foreignId('application_id')->constrained('visitor_card_applications');
            $table->enum('status', ['issued', 'returned', 'lost', 'damaged'])->default('issued');
            $table->enum('condition_when_issued', ['good'])->default('good');
            $table->enum('condition_when_returned', ['good', 'damaged', 'lost'])->nullable();
            $table->text('damage_reason')->nullable();
            $table->text('damage_handling')->nullable();
            $table->timestamp('issued_at');
            $table->timestamp('returned_at')->nullable();
            $table->foreignId('issued_by')->constrained('users');
            $table->foreignId('received_by')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_cards');
    }
};
