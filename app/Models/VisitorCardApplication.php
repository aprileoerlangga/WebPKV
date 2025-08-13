<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class VisitorCardApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_number',
        'full_name',
        'company_institution',
        'id_card_number',
        'phone_number',
        'email',
        'visit_start_date',
        'visit_end_date',
        'station_id',
        'visit_purpose',
        'visit_type',
        'supporting_document_path',
        'status',
        'rejection_reason',
        'approval_notes',
        'processed_at',
        'processed_by',
    ];

    protected $casts = [
        'visit_start_date' => 'date',
        'visit_end_date' => 'date',
        'processed_at' => 'datetime',
    ];

    public function station(): BelongsTo
    {
        return $this->belongsTo(Station::class);
    }

    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function visitorCard(): HasOne
    {
        return $this->hasOne(VisitorCard::class, 'application_id');
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($application) {
            $application->application_number = self::generateApplicationNumber();
        });
    }

    private static function generateApplicationNumber(): string
    {
        $prefix = 'VIS';
        $date = now()->format('Ymd');
        $sequence = str_pad(
            self::whereDate('created_at', today())->count() + 1,
            4,
            '0',
            STR_PAD_LEFT
        );

        return "{$prefix}{$date}{$sequence}";
    }
}
