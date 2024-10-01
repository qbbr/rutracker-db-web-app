<?php

declare(strict_types=1);

namespace App\Pagination;

use App\Config;
use Doctrine\ORM\QueryBuilder;

class Paginator
{
    private int $currentPage;
    private int $total;
    private array $results;

    public function __construct(
        private readonly QueryBuilder $qb,
        private readonly int $pageSize = Config::PAGE_SIZE,
    ) {
    }

    public function paginate(
        int $page = 1,
    ): self {
        $this->currentPage = max(1, $page);
        $firstResult = ($this->currentPage - 1) * $this->pageSize;

        $this->total = (clone $this->qb)
            ->select('count(e.id)')
            ->getQuery()
            ->getSingleScalarResult()
        ;

        $this->results = (clone $this->qb)
            ->setFirstResult($firstResult)
            ->setMaxResults($this->pageSize)
            ->getQuery()
            ->getResult()
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

    /**
     * @return array{
     *     results: array<int, mixed>,
     *     page: int,
     *     pageSize: int,
     *     lastPage: int,
     *     total: int,
     * }
     */
    public function getAsArray(): array
    {
        return [
            'results' => $this->getResults(),
            'page' => $this->getCurrentPage(),
            'pageSize' => $this->getPageSize(),
            'lastPage' => $this->getLastPage(),
            'total' => $this->getTotal(),
        ];
    }
}
