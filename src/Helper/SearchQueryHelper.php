<?php

declare(strict_types=1);

namespace App\Helper;

class SearchQueryHelper
{
    public static function extractSearchTerms(
        string $searchQuery,
    ): array {
        if (str_starts_with($searchQuery, '"')) { // if "quoted phrase", do not separate to terms
            return [str_replace('"', '', $searchQuery)];
        }

        $terms = array_unique(explode(' ', preg_replace('/\s+/', ' ', trim($searchQuery))));

        // ignore the search terms that are too short
        return array_filter($terms, fn ($term) => 2 <= mb_strlen($term));
    }
}
