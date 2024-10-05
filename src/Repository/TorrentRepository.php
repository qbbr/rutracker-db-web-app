<?php

declare(strict_types=1);

namespace App\Repository;

use App\Config;
use App\Document\Torrent;
use App\Pagination\Paginator;
use Doctrine\Bundle\MongoDBBundle\ManagerRegistry;
use Doctrine\Bundle\MongoDBBundle\Repository\ServiceDocumentRepository;
use Doctrine\Common\Collections\Order as OrderBy;

/**
 * @extends ServiceDocumentRepository<Torrent>
 */
class TorrentRepository extends ServiceDocumentRepository
{
    public function __construct(
        ManagerRegistry $registry,
    ) {
        parent::__construct($registry, Torrent::class);
    }

    public function findLatest(
        int $page = 1,
        int $pageSize = Config::PAGE_SIZE,
        array $forumIds = [],
        ?string $searchQuery = null,
    ): Paginator {
        $qb = $this->createQueryBuilder()
            ->select('id', 'title', 'size', 'hash', 'registredAt')
        ;

        if (\count($forumIds)) {
            $qb->field('forum')->in($forumIds);
        }

        if (null !== $searchQuery) {
            $qb->text($searchQuery);
        }

        $qb->sort('id', OrderBy::Descending->value);

        return (new Paginator($qb, $pageSize))->paginate($page);
    }
}
