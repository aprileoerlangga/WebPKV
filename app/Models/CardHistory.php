<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CardHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'card_id',
        'action',
        'notes',
        'performed_by',
    ];

    public function card(): BelongsTo
    {
        return $this->belongsTo(VisitorCard::class, 'card_id');
    }

    public function performer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
