<?php

declare(strict_types=1);

namespace App\Controller;

use App\Config;
use App\Document\Torrent;
use App\Normalizer\ObjectNormalizer;
use App\Pagination\PaginationDataCollector;
use App\Repository\TorrentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Requirement\Requirement;

#[Route('/api/torrent')]
class TorrentController extends AbstractController
{
    public function __construct(
        private readonly TorrentRepository $torrentRepository,
        private readonly PaginationDataCollector $paginationDataCollector,
        private readonly ObjectNormalizer $objectNormalizer,
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

        $paginator = $this->torrentRepository->findLatest(
            page: $page,
            pageSize: $pageSize,
            forumIds: $forumIds,
            searchQuery: $searchQuery,
        );

        $data = $this->paginationDataCollector->getData(
            paginator: $paginator,
            groups: Torrent::GROUPS_LIST,
        );

        return new JsonResponse($data);
    }

    #[Route('/{id}', requirements: ['page' => Requirement::DIGITS], methods: ['GET'])]
    public function view(
        int $id,
    ): JsonResponse {
        $torrent = $this->torrentRepository->find($id);
        $data = $this->objectNormalizer->normalize(
            objects: $torrent,
            groups: Torrent::GROUPS_VIEW,
        );

        return new JsonResponse($data);
    }
}
