<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
        'password' => 'hashed',
    ];

    public function processedApplications(): HasMany
    {
        return $this->hasMany(VisitorCardApplication::class, 'processed_by');
    }

    public function issuedCards(): HasMany
    {
        return $this->hasMany(VisitorCard::class, 'issued_by');
    }

    public function receivedCards(): HasMany
    {
        return $this->hasMany(VisitorCard::class, 'received_by');
    }
}
