<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pengajuan Kartu Visitor Disetujui</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #2563eb;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f8fafc;
            padding: 30px;
            border: 1px solid #e2e8f0;
            border-radius: 0 0 8px 8px;
        }
        .status-approved {
            background-color: #dcfce7;
            color: #166534;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
        }
        .details {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            margin-bottom: 10px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 10px;
        }
        .detail-label {
            font-weight: bold;
            width: 180px;
            color: #4b5563;
        }
        .detail-value {
            flex: 1;
            color: #1f2937;
        }
        .important-note {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Pengajuan Kartu Visitor Disetujui</h1>
    </div>

    <div class="content">
        <p>Yth. <strong>{{ $application->full_name }}</strong>,</p>

        <div class="status-approved">
            ✅ PENGAJUAN ANDA TELAH DISETUJUI
        </div>

        <p>Pengajuan kartu visitor Anda telah diproses dan <strong>DISETUJUI</strong> oleh tim kami.</p>

        <div class="details">
            <h3>Detail Pengajuan:</h3>
            <div class="detail-row">
                <div class="detail-label">Nomor Pengajuan:</div>
                <div class="detail-value">{{ $application->application_number }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Nama:</div>
                <div class="detail-value">{{ $application->full_name }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Instansi:</div>
                <div class="detail-value">{{ $application->company_institution }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Stasiun Tujuan:</div>
                <div class="detail-value">{{ $application->station->name }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Tanggal Kunjungan:</div>
                <div class="detail-value">{{ $application->visit_start_date->format('d/m/Y') }} - {{ $application->visit_end_date->format('d/m/Y') }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Tujuan Kunjungan:</div>
                <div class="detail-value">{{ $application->visit_purpose }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Disetujui pada:</div>
                <div class="detail-value">{{ $application->processed_at->format('d/m/Y H:i') }}</div>
            </div>
        </div>

        @if($application->approval_notes)
        <div class="details">
            <h3>Catatan Persetujuan:</h3>
            <p>{{ $application->approval_notes }}</p>
        </div>
        @endif

        <div class="important-note">
            <h3>📋 LANGKAH SELANJUTNYA:</h3>
            <ul>
                <li><strong>Datang ke {{ $application->station->name }}</strong> untuk mengambil kartu visitor</li>
                <li><strong>Bawa KTP asli</strong> sebagai identitas</li>
                <li><strong>Tunjukkan email ini</strong> atau nomor pengajuan ke petugas</li>
                <li>Kartu dapat diambil pada jam kerja (Senin-Jumat, 08:00-16:00)</li>
            </ul>
        </div>

        <p>Terima kasih atas kepercayaan Anda. Jika ada pertanyaan, silakan hubungi kami melalui kontak yang tersedia.</p>
    </div>

    <div class="footer">
        <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
        <p>&copy; {{ date('Y') }} Sistem Kartu Visitor Stasiun Yogyakarta</p>
    </div>
</body>
</html>
