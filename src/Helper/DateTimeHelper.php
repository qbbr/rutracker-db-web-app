<?php

declare(strict_types=1);

namespace App\Helper;

class DateTimeHelper
{
    public static function toDateTime(
        string $dateTime, // 2005.12.26 21:16:00
    ): \DateTimeImmutable {
        return new \DateTimeImmutable(str_replace('.', '-', $dateTime));
    }
}
