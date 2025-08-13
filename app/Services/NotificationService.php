<?php

namespace App\Services;

use App\Models\VisitorCardApplication;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    public function sendApprovalNotification(VisitorCardApplication $application): void
    {
        try {
            // Send Email
            Mail::send('emails.application-approved', ['application' => $application], function ($message) use ($application) {
                $message->to($application->email, $application->full_name)
                        ->subject('Pengajuan Kartu Visitor Disetujui');
            });

            // Send WhatsApp (implement based on your WhatsApp API provider)
            $this->sendWhatsAppNotification(
                $application->phone_number,
                "Pengajuan kartu visitor Anda dengan nomor {$application->application_number} telah disetujui. Silakan ambil kartu di stasiun {$application->station->name}."
            );

        } catch (\Exception $e) {
            Log::error('Failed to send approval notification', [
                'application_id' => $application->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function sendRejectionNotification(VisitorCardApplication $application): void
    {
        try {
            // Send Email
            Mail::send('emails.application-rejected', ['application' => $application], function ($message) use ($application) {
                $message->to($application->email, $application->full_name)
                        ->subject('Pengajuan Kartu Visitor Ditolak');
            });

            // Send WhatsApp
            $this->sendWhatsAppNotification(
                $application->phone_number,
                "Pengajuan kartu visitor Anda dengan nomor {$application->application_number} ditolak. Alasan: {$application->rejection_reason}"
            );

        } catch (\Exception $e) {
            Log::error('Failed to send rejection notification', [
                'application_id' => $application->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    private function sendWhatsAppNotification(string $phoneNumber, string $message): void
    {
        // Implement WhatsApp API integration here
        // This depends on your chosen WhatsApp Business API provider
        // Example providers: Twilio, WhatsApp Business API, Fonnte, etc.

        Log::info('WhatsApp notification sent', [
            'phone' => $phoneNumber,
            'message' => $message
        ]);
    }
}
