<?php

namespace App\Exports;

use App\Models\VisitorCard;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class CardReturnExport implements FromCollection, WithHeadings, WithMapping, WithStyles
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
        $query = VisitorCard::with(['application.station', 'receiver'])
                           ->whereNotNull('returned_at');

        switch ($this->period) {
            case 'daily':
                $query->whereDate('returned_at', $this->date);
                break;
            case 'weekly':
                $query->whereBetween('returned_at', [
                    $this->date->copy()->startOfWeek(),
                    $this->date->copy()->endOfWeek()
                ]);
                break;
            case 'monthly':
                $query->whereMonth('returned_at', $this->date->month)
                      ->whereYear('returned_at', $this->date->year);
                break;
            case 'yearly':
                $query->whereYear('returned_at', $this->date->year);
                break;
        }

        return $query->orderBy('returned_at', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'No. Kartu',
            'No. Pengajuan',
            'Nama Pemohon',
            'Instansi/Perusahaan',
            'Stasiun Tujuan',
            'Tanggal Penyerahan',
            'Tanggal Pengembalian',
            'Kondisi Saat Dikembalikan',
            'Alasan Kerusakan/Kehilangan',
            'Penanganan',
            'Diterima Oleh',
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
            $card->issued_at->format('d/m/Y H:i'),
            $card->returned_at?->format('d/m/Y H:i') ?? '-',
            ucfirst($card->condition_when_returned ?? '-'),
            $card->damage_reason ?? '-',
            $card->damage_handling ?? '-',
            $card->receiver?->name ?? '-',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
