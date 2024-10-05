<?php

declare(strict_types=1);

namespace App\Controller;

use App\Document\Forum;
use App\Normalizer\ObjectNormalizer;
use App\Repository\ForumRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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
    public function list(): JsonResponse
    {
        $forums = $this->forumRepository->getAll();
        $forums = $this->objectNormalizer->normalize($forums, Forum::GROUPS_LIST);

        return new JsonResponse($forums);
    }
}
