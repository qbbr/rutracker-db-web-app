<?php

declare(strict_types=1);

namespace App\Controller;

use App\Document\Forum;
use App\Normalizer\ObjectNormalizer;
use App\Repository\ForumRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/forum')]
class ForumController extends AbstractController
{
    public function __construct(
        private readonly ForumRepository $forumRepository,
        private readonly ObjectNormalizer $objectNormalizer,
    ) {
    }

    #[Route('/list')]
    public function list(
        Request $request,
    ): JsonResponse {
        $searchQuery = $request->query->get('searchQuery');
        $forums = $this->forumRepository->getAll(searchQuery: $searchQuery);
        $forums = $this->objectNormalizer->normalize(
            objects: $forums,
            groups: Forum::GROUPS_LIST,
        );

        return new JsonResponse($forums);
    }
}
