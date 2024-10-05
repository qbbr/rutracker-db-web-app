<?php

declare(strict_types=1);

namespace App\Repository;

use App\Document\Forum;
use Doctrine\Bundle\MongoDBBundle\ManagerRegistry;
use Doctrine\Bundle\MongoDBBundle\Repository\ServiceDocumentRepository;
use Doctrine\Common\Collections\Order as OrderBy;

/**
 * @extends ServiceDocumentRepository<Forum>
 */
class ForumRepository extends ServiceDocumentRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Forum::class);
    }

    public function getOrCreateIfNotExists(
        int $id,
        string $name,
    ): Forum {
        $forum = $this->find($id);

        if (!$forum) {
            $forum = Forum::create(
                id: $id,
                name: $name,
            );

            $this->getDocumentManager()->persist($forum);
        }

        return $forum;
    }

    /**
     * @return array<int, Forum>
     */
    public function getAll(): array
    {
        $qb = $this->createQueryBuilder()
            ->select('id', 'name')
            ->sort('name', OrderBy::Ascending->value);

        return $qb
            ->getQuery()
            ->execute()
            ->toArray();
    }
}
