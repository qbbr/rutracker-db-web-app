<?php

declare(strict_types=1);

namespace App;

final readonly class Config
{
    public const int PAGE_SIZE = 25;
    public const string DATE_TIME_FORMAT = 'Y-m-d\TH:i:s';
    public const string MONGO_DEFAULT_LANGUAGE = 'russian';
}
