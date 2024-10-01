<?php

declare(strict_types=1);

namespace App\Parser;

use App\Entity\Torrent;
use App\Helper\DateTimeHelper;
use App\Repository\ForumRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\DomCrawler\Crawler;

// total: 4990664
// 20m24s
class XmlParser
{
    private const int BATCH_SIZE = 1000;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ForumRepository $forumRepository,
    ) {
    }

    public function parse(
        string $filePath,
        ProgressBar $progressBar,
    ): void {
        $i = 0;

        (new HybridXMLParser())
            ->bind('/torrents/torrent', function (Crawler $node) use (&$i, $progressBar) {
                $this->parseTorrent($node);

                if (0 === $i % self::BATCH_SIZE) {
                    $this->em->flush();
                    $this->em->clear();
                }

                $progressBar->advance();
                ++$i;
            })
            ->process($filePath)
        ;

        $this->em->flush();
        $this->em->clear();
    }

    private function parseTorrent(
        Crawler $node,
    ) {
        $id = (int) $node->attr('id');
        $registredAt = $node->attr('registred_at');
        $registredAt = DateTimeHelper::toDateTime($registredAt);
        $size = (int) $node->attr('size');
        $title = $node->filter('title')->text();
        $hash = $node->filter('torrent > torrent')->attr('hash');
        $content = $node->filter('content')->text();
        $forumNode = $node->filter('forum');
        $forumId = (int) $forumNode->attr('id');
        $forumName = $forumNode->text();

        $forum = $this->forumRepository->getOrCreateIfNotExists(
            id: $forumId,
            name: $forumName,
        );

        $torrent = Torrent::create(
            id: $id,
            size: $size,
            title: $title,
            hash: $hash,
            content: $content,
            registredAt: $registredAt,
            forum: $forum,
        );

        $this->em->persist($torrent);
    }
}
