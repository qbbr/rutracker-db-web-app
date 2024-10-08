<?php

declare(strict_types=1);

namespace App\Pagination;

use App\Normalizer\ObjectNormalizer;

readonly class PaginationDataCollector
{
    public function __construct(
        private ObjectNormalizer $objectNormalizer,
    ) {
    }

    public function getData(
        Paginator $paginator,
        array $groups = [],
    ): array {
        return [
            'results' => $this->objectNormalizer->normalize(
                objects: $paginator->getResults(),
                groups: $groups,
            ),
            'page' => $paginator->getCurrentPage(),
            'pageSize' => $paginator->getPageSize(),
            'lastPage' => $paginator->getLastPage(),
            'total' => $paginator->getTotal(),
        ];
    }
}
