<?php

declare(strict_types=1);

namespace App\Repository;

use App\Config;
use App\Entity\Torrent;
use App\Helper\SearchQueryHelper;
use App\Pagination\Paginator;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\Order as OrderBy;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Torrent>
 */
class TorrentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Torrent::class);
    }

    public function findLatest(
        int $page = 1,
        int $pageSize = Config::PAGE_SIZE,
        ?string $searchQuery = null,
    ): Paginator {
        $qb = $this->createQueryBuilder('e');
        $qb->select('e.id, e.title, e.size, e.hash, e.registredAt');

        if (null !== $searchQuery) {
            if ($searchTerms = SearchQueryHelper::extractSearchTerms($searchQuery)) {
                $orStatements = $qb->expr()->orX();

                foreach ($searchTerms as $term) {
                    $orStatements->add(
                        $qb->expr()->like('lower(e.title)', $qb->expr()->literal('%'.mb_strtolower($term).'%'))
                    );
                }

                $qb->andWhere($orStatements);
            }
        }

        $qb->addOrderBy('e.id', OrderBy::Descending->value);

        return (new Paginator($qb, $pageSize))->paginate($page);
    }
}
