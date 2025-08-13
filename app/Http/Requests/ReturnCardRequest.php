<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth; // ✅ Tambahkan ini

class ReturnCardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && in_array(Auth::user()->role, ['admin', 'super_admin']); // ✅ Ganti dari auth()
    }

    public function rules(): array
    {
        return [
            'condition' => ['required', Rule::in(['good', 'damaged', 'lost'])],
            'damage_reason' => 'required_if:condition,damaged,lost|nullable|string|max:500',
            'damage_handling' => 'required_if:condition,damaged,lost|nullable|string|max:500',
            'notes' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'condition.required' => 'Kondisi kartu wajib dipilih.',
            'condition.in' => 'Kondisi kartu tidak valid.',
            'damage_reason.required_if' => 'Alasan kerusakan/kehilangan wajib diisi.',
            'damage_handling.required_if' => 'Penanganan wajib diisi.',
            'damage_reason.max' => 'Alasan kerusakan maksimal 500 karakter.',
            'damage_handling.max' => 'Penanganan maksimal 500 karakter.',
            'notes.max' => 'Catatan maksimal 500 karakter.',
        ];
    }
}
