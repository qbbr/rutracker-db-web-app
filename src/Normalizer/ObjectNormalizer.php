<?php

declare(strict_types=1);

namespace App\Normalizer;

use App\Config;
use Symfony\Component\Serializer\Context\Normalizer\DateTimeNormalizerContextBuilder;
use Symfony\Component\Serializer\Context\Normalizer\ObjectNormalizerContextBuilder;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

readonly class ObjectNormalizer
{
    public function __construct(
        private NormalizerInterface $normalizer,
    ) {
    }

    /**
     * @param array<int, object>|object $objects
     * @param array<int, string>        $groups
     *
     * @return array<int, array<string, mixed>>
     */
    public function normalize(
        array|object $objects,
        array $groups = [],
    ): array {
        $contextBuilder = (new ObjectNormalizerContextBuilder())
            ->withGroups($groups)
        ;

        $contextBuilder = (new DateTimeNormalizerContextBuilder())
            ->withContext($contextBuilder)
            ->withFormat(Config::DATE_TIME_FORMAT)
        ;

        return $this->normalizer->normalize($objects, context: $contextBuilder->toArray());
    }
}
