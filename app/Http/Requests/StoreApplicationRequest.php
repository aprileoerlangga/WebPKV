<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'company_institution' => 'required|string|max:255',
            'id_card_number' => 'required|string|max:20|unique:visitor_card_applications,id_card_number',
            'phone_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'visit_start_date' => 'required|date|after_or_equal:today',
            'visit_end_date' => 'required|date|after_or_equal:visit_start_date',
            'station_id' => 'required|exists:stations,id',
            'visit_purpose' => 'required|string|max:500',
            'visit_type' => ['required', Rule::in(['regular', 'extended'])],
            'supporting_document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120'
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->visit_type === 'regular') {
                $startDate = $this->visit_start_date;
                $endDate = $this->visit_end_date;

                if ($startDate && $endDate && $startDate !== $endDate) {
                    $validator->errors()->add(
                        'visit_end_date',
                        'Pengunjung regular tidak dapat mengajukan kunjungan lebih dari 1 hari'
                    );
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Nama lengkap wajib diisi.',
            'company_institution.required' => 'Instansi/Perusahaan wajib diisi.',
            'id_card_number.required' => 'Nomor KTP wajib diisi.',
            'id_card_number.unique' => 'Nomor KTP sudah terdaftar.',
            'phone_number.required' => 'Nomor HP wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'visit_start_date.required' => 'Tanggal kunjungan wajib diisi.',
            'visit_start_date.after_or_equal' => 'Tanggal kunjungan tidak boleh kurang dari hari ini.',
            'visit_end_date.required' => 'Tanggal selesai kunjungan wajib diisi.',
            'visit_end_date.after_or_equal' => 'Tanggal selesai tidak boleh kurang dari tanggal mulai.',
            'station_id.required' => 'Stasiun tujuan wajib dipilih.',
            'station_id.exists' => 'Stasiun yang dipilih tidak valid.',
            'visit_purpose.required' => 'Tujuan kunjungan wajib diisi.',
            'visit_type.required' => 'Jenis kunjungan wajib dipilih.',
            'supporting_document.mimes' => 'File harus berformat PDF, JPG, JPEG, atau PNG.',
            'supporting_document.max' => 'Ukuran file maksimal 5MB.',
        ];
    }
}
