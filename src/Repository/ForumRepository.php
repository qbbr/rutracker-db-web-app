<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Forum;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Forum>
 */
class ForumRepository extends ServiceEntityRepository
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

            $this->getEntityManager()->persist($forum);
            $this->getEntityManager()->flush();
        }

        return $forum;
    }
}
