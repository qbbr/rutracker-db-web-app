<?php

declare(strict_types=1);

namespace App\Pagination;

use App\Config;
use Doctrine\ODM\MongoDB\Query\Builder;

class Paginator
{
    private int $currentPage;
    private int $total;
    private array $results;

    public function __construct(
        private readonly Builder $qb,
        private readonly int $pageSize = Config::PAGE_SIZE,
    ) {
    }

    public function paginate(
        int $page = 1,
    ): self {
        $this->currentPage = max(1, $page);
        $firstResult = ($this->currentPage - 1) * $this->pageSize;

        $this->total = (clone $this->qb)
            ->count()
            ->getQuery()
            ->execute()
        ;

        $this->results = (clone $this->qb)
            ->skip($firstResult)
            ->limit($this->pageSize)
            ->getQuery()
            ->execute()
            ->toArray()
        ;

        return $this;
    }

    public function getCurrentPage(): int
    {
        return $this->currentPage;
    }

    public function getLastPage(): int
    {
        return (int) ceil($this->total / $this->pageSize);
    }

    public function getPageSize(): int
    {
        return $this->pageSize;
    }

    public function getTotal(): int
    {
        return $this->total;
    }

    public function getResults(): array
    {
        return $this->results;
    }
}
