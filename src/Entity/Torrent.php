<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\TorrentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Index(columns: ['title'])]
#[ORM\Entity(repositoryClass: TorrentRepository::class)]
class Torrent
{
    #[ORM\Id]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column]
    private ?int $size = null;

    #[ORM\Column(length: 64)]
    private ?string $hash = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $content = null;

    #[ORM\ManyToOne(targetEntity: Forum::class, inversedBy: 'torrents')]
    private ?Forum $forum = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $registredAt = null;

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

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function getSize(): ?int
    {
        return $this->size;
    }

    public function getHash(): ?string
    {
        return $this->hash;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function getForum(): ?Forum
    {
        return $this->forum;
    }

    public function getRegistredAt(): ?\DateTimeImmutable
    {
        return $this->registredAt;
    }

    public function setRegistredAt(\DateTimeImmutable $registredAt): static
    {
        $this->registredAt = $registredAt;

        return $this;
    }
}
