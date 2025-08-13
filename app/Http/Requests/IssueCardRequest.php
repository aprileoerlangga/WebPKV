<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth; // ✅ Tambahkan ini

class IssueCardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && in_array(Auth::user()->role, ['admin', 'super_admin']); // ✅ Ganti dari auth()
    }

    public function rules(): array
    {
        return [
            'application_id' => 'required|exists:visitor_card_applications,id',
        ];
    }

    public function messages(): array
    {
        return [
            'application_id.required' => 'ID pengajuan wajib diisi.',
            'application_id.exists' => 'Pengajuan tidak ditemukan.',
        ];
    }
}
