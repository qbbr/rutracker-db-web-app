<?php

declare(strict_types=1);

namespace App\Helper;

class SearchQueryHelper
{
    public static function normalize(
        ?string $searchQuery,
    ): string {
        if (null === $searchQuery) {
            return '';
        }

        $searchQuery = trim($searchQuery);

        if (empty($searchQuery)) {
            return '';
        }

        return $searchQuery;
    }
}
