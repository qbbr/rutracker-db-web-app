<?php

declare(strict_types=1);

namespace App\Command;

use App\Parser\XmlParser;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:import',
    description: 'Import XML dump to DB',
)]
class ImportCommand extends Command
{
    public function __construct(
        private readonly XmlParser $xmlParser,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument(
                name: 'file',
                mode: InputArgument::REQUIRED,
                description: 'XML file',
            )
            ->addOption(
                name: 'total',
                shortcut: 't',
                mode: InputOption::VALUE_OPTIONAL,
                description: 'Total torrents in XML file',
                default: 0, // 4990664
            )
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle(input: $input, output: $output);
        $file = $input->getArgument('file');
        $total = (int) $input->getOption('total');
        $progressBar = new ProgressBar($output, $total);
        $progressBar->setFormat(ProgressBar::FORMAT_DEBUG);
        $io->info(\sprintf('Start parsing file "%s"', $file));
        $this->xmlParser->parse($file, $progressBar);
        $progressBar->finish();
        $io->success('DONE');

        return Command::SUCCESS;
    }
}
