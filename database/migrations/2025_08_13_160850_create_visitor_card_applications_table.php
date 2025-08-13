<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitor_card_applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_number')->unique();
            $table->string('full_name');
            $table->string('company_institution');
            $table->string('id_card_number');
            $table->string('phone_number');
            $table->string('email');
            $table->date('visit_start_date');
            $table->date('visit_end_date');
            $table->foreignId('station_id')->constrained('stations');
            $table->text('visit_purpose');
            $table->enum('visit_type', ['regular', 'extended'])->default('regular');
            $table->string('supporting_document_path')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->text('approval_notes')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_card_applications');
    }
};
