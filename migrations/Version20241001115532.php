<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20241001115532 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE forum (id INTEGER NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE torrent (
          id INTEGER NOT NULL,
          forum_id INTEGER DEFAULT NULL,
          title VARCHAR(255) NOT NULL,
          size INTEGER NOT NULL,
          hash VARCHAR(64) NOT NULL,
          content CLOB NOT NULL,
          registred_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
          ,
          PRIMARY KEY(id),
          CONSTRAINT FK_DCC7B7B629CCBAD0 FOREIGN KEY (forum_id) REFERENCES forum (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        )');
        $this->addSql('CREATE INDEX IDX_DCC7B7B629CCBAD0 ON torrent (forum_id)');
        $this->addSql('CREATE INDEX IDX_DCC7B7B62B36786B ON torrent (title)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE forum');
        $this->addSql('DROP TABLE torrent');
    }
}
