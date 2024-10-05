<?php

declare(strict_types=1);

namespace App\Parser;

use Symfony\Component\DomCrawler\Crawler;

/**
 * Hybrid XML parser (XMLReader + Crawler).
 *
 * Class to parse huge XML files in a memory-efficient way.
 */
class HybridXMLParser
{
    private \XMLReader $xml;

    /**
     * @var array<int, string>
     */
    private array $paths;

    /**
     * @var array<string, callable>
     */
    private array $pathListeners = [];

    public function __construct(
        private readonly string $encoding = 'UTF-8',
    ) {
        $this->xml = new \XMLReader();
    }

    /**
     * @param string $path XML path for watch (slash-separated)
     */
    public function bind(
        string $path,
        callable $listener,
    ): self {
        $this->pathListeners[$path] = $listener;

        return $this;
    }

    /**
     * @param string $uri     URI pointing to the document
     * @param int    $options A bitmask of the LIBXML_* constants
     */
    public function process(
        string $uri,
        int $options = 0,
    ): self {
        $this->paths = [];

        if (false === $this->xml->open($uri, $this->encoding, $options | \LIBXML_PARSEHUGE)) {
            throw new \RuntimeException(\sprintf('Cannot open URI "%s"', $uri));
        }

        while ($this->xml->read()) {
            switch ($this->xml->nodeType) {
                case \XMLReader::ELEMENT:
                    $this->paths[] = $this->xml->name;
                    $this->notifyListener($this->getCurrentPath());

                    if (!$this->xml->isEmptyElement) {
                        break;
                    }

                    // no break
                case \XMLReader::END_ELEMENT:
                    array_pop($this->paths);
                    break;
            }
        }

        $this->xml->close();

        return $this;
    }

    private function getCurrentPath(): string
    {
        return '/'.implode('/', $this->paths);
    }

    private function notifyListener(
        string $path,
    ): void {
        if (isset($this->pathListeners[$path])) {
            $node = new Crawler();
            $node->addXmlContent($this->xml->readOuterXml(), $this->encoding);
            $this->pathListeners[$path]($node, $this);
        }
    }
}
