<?php

namespace App\Console\Commands;

use App\Models\FarmerCrop;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ExpirePlantingsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'plantings:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark plantings as expired if they pass expected harvest date';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $expiredCount = FarmerCrop::where('status', 'active')
            ->whereNotNull('expected_harvest_date')
            ->where('expected_harvest_date', '<', Carbon::now())
            ->update(['status' => 'expired']);

        $this->info("Marked {$expiredCount} planting(s) as expired.");

        return Command::SUCCESS;
    }
}
