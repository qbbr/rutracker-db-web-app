<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\ForumRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ForumRepository::class)]
class Forum
{
    #[ORM\Id]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    /**
     * @var Collection<int, Torrent>
     */
    #[ORM\OneToMany(targetEntity: Torrent::class, mappedBy: 'forum')]
    private Collection $torrents;

    public function __construct()
    {
        $this->torrents = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, Torrent>
     */
    public function getTorrents(): Collection
    {
        return $this->torrents;
    }
}
