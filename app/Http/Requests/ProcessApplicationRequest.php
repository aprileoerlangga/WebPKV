<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth; // ✅ Tambahkan ini

class ProcessApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && in_array(Auth::user()->role, ['admin', 'super_admin']); // ✅ Ganti dari auth()
    }

    public function rules(): array
    {
        $rules = [];

        if ($this->isMethod('POST') && $this->route()->getActionMethod() === 'reject') {
            $rules['reason'] = 'required|string|max:500';
        }

        if ($this->isMethod('POST') && $this->route()->getActionMethod() === 'approve') {
            $rules['notes'] = 'nullable|string|max:500';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'Alasan penolakan wajib diisi.',
            'reason.max' => 'Alasan penolakan maksimal 500 karakter.',
            'notes.max' => 'Catatan persetujuan maksimal 500 karakter.',
        ];
    }
}
