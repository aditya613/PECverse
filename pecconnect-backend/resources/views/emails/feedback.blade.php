<x-mail::message>
# New Feedback Received

**Type:** {{ ucfirst($feedback->type) }}
**User:** {{ $feedback->user->name ?? 'Unknown' }} ({{ $feedback->user->email ?? 'N/A' }})
**Roll No:** {{ $feedback->user->roll_no ?? 'N/A' }}

**Message:**
{{ $feedback->message }}

<x-mail::button :url="config('app.url')">
Go to Dashboard
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
