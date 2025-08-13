<?php

namespace App\Exports;

use App\Models\VisitorCard;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class CardIssuanceExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    private string $period;
    private Carbon $date;

    public function __construct(string $period, string $date)
    {
        $this->period = $period;
        $this->date = Carbon::parse($date);
    }

    public function collection()
    {
        $query = VisitorCard::with(['application.station', 'issuer']);

        switch ($this->period) {
            case 'daily':
                $query->whereDate('issued_at', $this->date);
                break;
            case 'weekly':
                $query->whereBetween('issued_at', [
                    $this->date->copy()->startOfWeek(),
                    $this->date->copy()->endOfWeek()
                ]);
                break;
            case 'monthly':
                $query->whereMonth('issued_at', $this->date->month)
                      ->whereYear('issued_at', $this->date->year);
                break;
            case 'yearly':
                $query->whereYear('issued_at', $this->date->year);
                break;
        }

        return $query->orderBy('issued_at', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'No. Kartu',
            'No. Pengajuan',
            'Nama Pemohon',
            'Instansi/Perusahaan',
            'Stasiun Tujuan',
            'Tujuan Kunjungan',
            'Tanggal Penyerahan',
            'Diserahkan Oleh',
            'Kondisi Kartu',
        ];
    }

    public function map($card): array
    {
        return [
            $card->card_number,
            $card->application->application_number,
            $card->application->full_name,
            $card->application->company_institution,
            $card->application->station->name,
            $card->application->visit_purpose,
            $card->issued_at->format('d/m/Y H:i'),
            $card->issuer->name,
            ucfirst($card->condition_when_issued),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
