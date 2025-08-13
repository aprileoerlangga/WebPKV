<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VisitorCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'card_number',
        'application_id',
        'status',
        'condition_when_issued',
        'condition_when_returned',
        'damage_reason',
        'damage_handling',
        'issued_at',
        'returned_at',
        'issued_by',
        'received_by',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'returned_at' => 'datetime',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(VisitorCardApplication::class, 'application_id');
    }

    public function issuer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(CardHistory::class, 'card_id');
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($card) {
            if (empty($card->card_number)) {
                $card->card_number = self::generateCardNumber();
            }
        });
    }

    private static function generateCardNumber(): string
    {
        $prefix = 'VC';
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
