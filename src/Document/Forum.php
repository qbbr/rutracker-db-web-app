<?php

declare(strict_types=1);

namespace App\Document;

use App\Config;
use App\Repository\ForumRepository;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Doctrine\ODM\MongoDB\Types\Type;
use Symfony\Component\Serializer\Attribute\Groups;

#[MongoDB\Index(keys: ['name' => 'text'], options: ['default_language' => Config::MONGO_DEFAULT_LANGUAGE])]
#[MongoDB\Document(repositoryClass: ForumRepository::class)]
class Forum
{
    public const array GROUPS_LIST = ['forum-list'];

    #[Groups([...self::GROUPS_LIST])]
    #[MongoDB\Id(type: Type::INT, strategy: 'none')]
    private int $id;

    #[Groups([...self::GROUPS_LIST])]
    #[MongoDB\Field(type: Type::STRING)]
    private string $name;

    public static function create(
        int $id,
        string $name,
    ): self {
        $forum = new self();
        $forum->id = $id;
        $forum->name = $name;

        return $forum;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }
}
