<?php

declare(strict_types=1);

namespace App\Controller;

use App\Config;
use App\Pagination\PaginationDataCollector;
use App\Repository\TorrentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/torrent')]
class TorrentController extends AbstractController
{
    public function __construct(
        private readonly TorrentRepository $torrentRepository,
        private readonly PaginationDataCollector $paginationDataCollector,
    ) {
    }

    #[Route('/latest', methods: ['GET'])]
    public function latest(
        Request $request,
    ): JsonResponse {
        $page = $request->query->getInt('page', 1);
        $pageSize = $request->query->getInt('pageSize', Config::PAGE_SIZE);
        $forumIds = $request->query->has('forumIds')
            ? explode(',', $request->query->getString('forumIds'))
            : [];
        $searchQuery = $request->query->get('searchQuery');

        $paginator = $this->torrentRepository->findLatest($page, $pageSize, $forumIds, $searchQuery);
        $data = $this->paginationDataCollector->getData($paginator);

        return new JsonResponse($data);
    }
}
