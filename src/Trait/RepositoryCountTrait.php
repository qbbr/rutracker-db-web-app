<?php

declare(strict_types=1);

namespace App\Trait;

trait RepositoryCountTrait
{
    public function count(): int
    {
        return $this->createQueryBuilder()
            ->count()
            ->getQuery()
            ->execute();
    }
}
