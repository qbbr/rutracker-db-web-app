<?php

declare(strict_types=1);

namespace App\Service\Helper;

use Doctrine\Bundle\MongoDBBundle\ManagerRegistry;
use MongoDB\Client;
use MongoDB\Database;

class DbHelper
{
    public function __construct(
        private readonly ManagerRegistry $managerRegistry,
    ) {
    }

    public function getVersion(): string
    {
        return $this->getDatabase()->command(['buildInfo' => 1])->toArray()[0]['version'] ?? '...';
    }

    public function getSize(string $table = 'SystemEvents'): int
    {
        $stats = $this->getDatabase()->command(['dbStats' => 1, 'scale' => 1024])->toArray()[0] ?? [];
        $size = $stats['totalSize'] ?? 0;
        $size /= 1024;

        return (int) $size;
    }

    private function getDatabase(): Database
    {
        /** @var Client $connection */
        $connection = $this->managerRegistry->getConnection();

        return $connection->selectDatabase($_ENV['MONGODB_DB']);
    }
}
