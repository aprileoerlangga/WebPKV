<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pengajuan Kartu Visitor Ditolak</title>
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
            background-color: #dc2626;
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
        .status-rejected {
            background-color: #fecaca;
            color: #dc2626;
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
        .rejection-reason {
            background-color: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 15px;
            margin: 20px 0;
        }
        .next-steps {
            background-color: #f0f9ff;
            border-left: 4px solid #0284c7;
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
        <h1>Pengajuan Kartu Visitor Ditolak</h1>
    </div>

    <div class="content">
        <p>Yth. <strong>{{ $application->full_name }}</strong>,</p>

        <div class="status-rejected">
            ❌ PENGAJUAN ANDA DITOLAK
        </div>

        <p>Mohon maaf, pengajuan kartu visitor Anda tidak dapat diproses lebih lanjut.</p>

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
                <div class="detail-label">Stasiun Tujuan:</div>
                <div class="detail-value">{{ $application->station->name }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Ditolak pada:</div>
                <div class="detail-value">{{ $application->processed_at->format('d/m/Y H:i') }}</div>
            </div>
        </div>

        <div class="rejection-reason">
            <h3>💬 Alasan Penolakan:</h3>
            <p><strong>{{ $application->rejection_reason }}</strong></p>
        </div>

        <div class="next-steps">
            <h3>🔄 Langkah Selanjutnya:</h3>
            <ul>
                <li>Anda dapat mengajukan ulang dengan melengkapi persyaratan yang kurang</li>
                <li>Pastikan semua dokumen yang diperlukan telah dilengkapi</li>
                <li>Hubungi kami jika memerlukan bantuan atau klarifikasi</li>
                <li>Silakan akses website untuk mengajukan permohonan baru</li>
            </ul>
        </div>

        <p>Kami mohon maaf atas ketidaknyamanan ini. Tim kami siap membantu jika Anda memerlukan informasi lebih lanjut.</p>
    </div>

    <div class="footer">
        <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
        <p>&copy; {{ date('Y') }} Sistem Kartu Visitor Stasiun Yogyakarta</p>
    </div>
</body>
</html>
