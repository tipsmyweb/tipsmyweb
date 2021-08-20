<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;

class MailSender
{
    public static function GetAdminEmailReceiver()
    {
        return config('mail.receiver.admin');
    }

    public static function GetTmwMailUsername()
    {
        return config('mail.username');
    }

    public static function send_contact_request($message_content, $email_sender)
    {
        $subject = "Tips My Web - Demande de contact";
        $receiver = config('mail.reveiver.admin');

        Mail::send('mail_contact_request',['message_content' => $message_content, 'email_sender' => $email_sender], function($message) use ($subject, $receiver) {
            $message->to($receiver);
            $message->from(config('mail.username'));
            $message->subject($subject);
        });
    }

    public static function send_resource_websites_availability_alert($unavailable_resources)
    {
        $subject = 'Tips My Web - Sites Web inaccessibles';
        $receiver = config('mail.reveiver.admin');

        Mail::send('resource_websites_availability_alert', ['unavailable_resources' => $unavailable_resources], function($message) use ($subject, $receiver) {
            $message->to($receiver);
            $message->from(config('mail.username'));
            $message->subject($subject);
        });
    }

    public static function sendJobFailedEmail($job_name)
    {
        $subject = '[JobFailed] Tips My Web - '.$job_name;
        $receiver = MailSender::GetAdminEmailReceiver();
        $sender = MailSender::GetTmwMailUsername();

        Mail::send(
            'job_failed',
            ['job_name' => $job_name],
            function($message) use ($subject, $receiver, $sender){
                $message->to($receiver);
                $message->from($sender);
                $message->subject($subject);
            });
    }
}