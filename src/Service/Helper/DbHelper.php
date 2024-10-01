<?php

declare(strict_types=1);

namespace App\Service\Helper;

use Doctrine\ORM\EntityManagerInterface;

class DbHelper
{
    public function __construct(
        private readonly EntityManagerInterface $em,
    ) {
    }

    public function getVersion(): string
    {
        return $this->em->getConnection()->executeQuery('SELECT sqlite_version()')->fetchOne();
    }

    public function getSize(string $table = 'SystemEvents'): int
    {
        return $this->em->getConnection()->executeQuery('
            SELECT page_count * page_size / 1024 / 1024 as size FROM pragma_page_count(), pragma_page_size();
        ')->fetchOne();
    }
}
