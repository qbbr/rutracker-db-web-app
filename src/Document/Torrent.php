<?php

declare(strict_types=1);

namespace App\Document;

use App\Config;
use App\Repository\TorrentRepository;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Doctrine\ODM\MongoDB\Types\Type;
use Symfony\Component\Serializer\Attribute\Groups;

#[MongoDB\Index(keys: ['title' => 'text'], options: ['default_language' => Config::MONGO_DEFAULT_LANGUAGE])]
#[MongoDB\Document(repositoryClass: TorrentRepository::class)]
class Torrent
{
    public const array GROUPS_LIST = ['torrent-list'];
    public const array GROUPS_VIEW = ['torrent-view'];

    #[Groups([...self::GROUPS_LIST, ...self::GROUPS_VIEW])]
    #[MongoDB\Id(type: Type::INT, strategy: 'none')]
    private int $id;

    #[Groups([...self::GROUPS_LIST, ...self::GROUPS_VIEW])]
    #[MongoDB\Field(type: Type::STRING)]
    private string $title;

    #[Groups([...self::GROUPS_LIST, ...self::GROUPS_VIEW])]
    #[MongoDB\Field(type: Type::INT)]
    private int $size;

    #[Groups([...self::GROUPS_LIST, ...self::GROUPS_VIEW])]
    #[MongoDB\Field(type: Type::STRING)]
    private string $hash;

    #[Groups([...self::GROUPS_VIEW])]
    #[MongoDB\Field(type: Type::STRING)]
    private string $content = '';

    #[Groups([...self::GROUPS_LIST, ...self::GROUPS_VIEW])]
    #[MongoDB\Field(type: Type::DATE_IMMUTABLE)]
    private \DateTimeImmutable $registredAt;

    #[MongoDB\ReferenceOne(storeAs: 'id', targetDocument: Forum::class)]
    private Forum $forum;

    public static function create(
        int $id,
        int $size,
        string $title,
        string $hash,
        string $content,
        \DateTimeImmutable $registredAt,
        Forum $forum,
    ): self {
        $torrent = new self();
        $torrent->id = $id;
        $torrent->size = $size;
        $torrent->title = $title;
        $torrent->hash = $hash;
        $torrent->content = $content;
        $torrent->registredAt = $registredAt;
        $torrent->forum = $forum;

        return $torrent;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getSize(): int
    {
        return $this->size;
    }

    public function getHash(): string
    {
        return $this->hash;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function getRegistredAt(): \DateTimeImmutable
    {
        return $this->registredAt;
    }

    public function getForum(): Forum
    {
        return $this->forum;
    }
}
