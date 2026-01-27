<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class ImageUploadService
{
    private const MAX_FILE_SIZE = 5120; // 5MB in KB
    private const MAX_WIDTH = 1200;
    private const MAX_HEIGHT = 1200;
    private const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    public function uploadMessageImage(UploadedFile $file): string
    {
        $this->validate($file);

        $filename = $this->generateFilename($file);
        $path = "messages/{$filename}";

        $optimizedImage = $this->optimizeImage($file);
        
        Storage::disk('public')->put($path, $optimizedImage);

        return $path;
    }

    public function deleteMessageImage(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }

    private function validate(UploadedFile $file): void
    {
        if ($file->getSize() > self::MAX_FILE_SIZE * 1024) {
            throw new \InvalidArgumentException('Image must be less than 5MB');
        }

        if (!in_array($file->getMimeType(), self::ALLOWED_MIMES)) {
            throw new \InvalidArgumentException('Invalid image format. Only JPG, PNG, and WebP allowed');
        }
    }

    private function generateFilename(UploadedFile $file): string
    {
        return Str::uuid() . '.' . $file->getClientOriginalExtension();
    }

    private function optimizeImage(UploadedFile $file): string
    {
        $image = Image::read($file);

        // Resize if too large
        if ($image->width() > self::MAX_WIDTH || $image->height() > self::MAX_HEIGHT) {
            $image->scale(width: self::MAX_WIDTH, height: self::MAX_HEIGHT);
        }

        // Compress based on format
        $quality = match($file->getMimeType()) {
            'image/jpeg', 'image/jpg' => 85,
            'image/png' => 90,
            'image/webp' => 80,
            default => 85,
        };

        $extension = $file->getClientOriginalExtension();

        return $image->encodeByExtension($extension, quality: $quality)->toString();
    }
}